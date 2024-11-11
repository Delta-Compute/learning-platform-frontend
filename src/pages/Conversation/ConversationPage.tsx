import React, { useEffect, useRef, useCallback, useState, useContext } from "react";

import { RealtimeClient } from "@openai/realtime-api-beta";
// @ts-ignore
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js";
// @ts-ignore
import { WavRecorder, WavStreamPlayer } from "../../lib/wavtools/index.js";
// @ts-ignore
import { teacherInstructions, studentInstructionsForAI, studentFeedbackInstructions } from "../../utils/conversation_config.ts";

import { IAssignment } from "../../types";

import UserContext from "../../context/UserContext";

import { Link, useParams } from "react-router-dom";

import { Button } from "../../components";
import { AssignmentModal } from "./AssignmentModal";

import CrossIconWhite from "../../assets/icons/cross-icon-white.svg";
import LeftArrowIcon from "../../assets/icons/left-arrow.svg";
import { SpeakingDots } from '../../components/SpeakingDots/index.tsx';
import { useGenerateAssignmentSummary, useGetStudentAssignments } from "../../hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ClassRoomProgressApiService } from "../../services/index.ts";

import { toast } from "react-hot-toast";
import { useClassById } from '../../hooks/api/classes.ts';
import { Class } from '../../types/class.ts';
import { AssignmentsBasedOnLearningPlan } from "./AssignmentsBasedOnLearningPlan.tsx";
import { openai } from '../../vars/open-ai.ts';

interface RealtimeEvent {
  time: string;
  source: "client" | "server";
  count?: number;
  event: { [key: string]: any };
}

const apiKey = import.meta.env.VITE_OPEN_AI_API_KEY;

interface ConversationPageProps {
  role: "teacher" | "student";
};

export const ConversationPage: React.FC<ConversationPageProps> = ({ role }) => {
  const { user } = useContext(UserContext);

  const params = useParams();
  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ sampleRate: 24000, bufferLength: 4096 })
  );
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000, bufferLength: 4096 })
  );
  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient({
      apiKey: apiKey,
      dangerouslyAllowAPIKeyInBrowser: true,
    })
  );

  const { data: assignments, isPending: isAssignmentsPending, refetch } = useGetStudentAssignments(user?.email ?? "");

  const { generateAssignmentSummary } = useGenerateAssignmentSummary();

  useEffect(() => {
    refetch();
  }, [user?.email, refetch]);

  const [studentInstructions, setStudentInstructions] = useState("");
  const [classRoom, setClassRoom] = useState<Class | null>(null);

  const [currentAssignment, setCurrentAssignment] = useState<IAssignment | null>(null);
  const [classRoomId, setClassRoomId] = useState("");

  const [assignmentTopic, setAssignmentTopic] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentTime, setAssignmentTime] = useState(0);

  const [studentsFeedback, setStudentsFeedback] = useState("");
  const [timeCounter, setTimeCounter] = useState(0);
  const minutes = Math.floor(timeCounter / 60);
  const remainingSeconds = timeCounter % 60;
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const { data } = useClassById(params.classId as string);

  useEffect(() => {
    if (data) {
      setClassRoom(data);
    }
  }, [params.classId, data]);

  const {
    data: studentsProgress,
    refetch: studentsProgressRefetch,
  } = useQuery({
    queryFn: () => ClassRoomProgressApiService.getStudentsProgress(classRoomId as string, params.assignmentId as string),
    queryKey: ["students-progress"],
    staleTime: 5_000_000,
  });

  const { mutate: updateStudentStatus } = useMutation({
    mutationFn: (data: { classRoomId: string, assignmentId: string, studentEmail: string, feedback: string }) => {
      return ClassRoomProgressApiService.updateClassRoomProgress(
        data.classRoomId,
        data.assignmentId,
        data.studentEmail,
        data.feedback,
      )
    },
    onSuccess: () => {
      toast.success("Successfully updated");

      studentsProgressRefetch();
    },
    onError: () => {
      toast.success("Something went wrong");
    }
  });

  useEffect(() => {
    if (user && user.role === "student" && assignments) {
      assignments.map(item => {
        if (item.id === params.assignmentId && user.firstName) {
          setStudentInstructions(studentInstructionsForAI(user.firstName, item.description));
          setClassRoomId(item.classRoomId);
          setCurrentAssignment(item);
        }
      });
    }
  }, [user?.role, user?.id, assignments, user, params.assignmentId]);

  const eventsScrollHeightRef = useRef(0);
  const eventsScrollRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<string>(new Date().toISOString());

  const [items, setItems] = useState<ItemType[]>([]);

  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

  // const [isAssignmentCreated, setIsAssignmentCreated] = useState(false);
  // const [summary, setSummary] = useState("");

  const [connectionLoading, setConnectionLoading] = useState(false);

  const connectConversation = useCallback(async () => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;
    client.updateSession({ turn_detection: { type: "server_vad" }, voice: "echo" });

    setConnectionLoading(true);

    // Set state variables
    startTimeRef.current = new Date().toISOString();
    setIsConnected(true);
    setRealtimeEvents([]);
    setItems(client.conversation.getItems());

    try {
      await Promise.all([
        client.connect(),
        wavRecorder.begin(),
        wavStreamPlayer.connect()
      ]);
  
      console.log("connected");
  
      if (client.getTurnDetectionType() === "server_vad") {
        console.log("server vad");
        
        await wavRecorder.record((data: any) => client.appendInputAudio(data.mono));
        
        setConnectionLoading(false);
      } else {
        toast.error("Something went wrong, please try again");
      }
    } catch (error) {
      toast.error("Something went wrong, please try again");
    } finally {
      setConnectionLoading(false);
    }
  }, []);

  const disconnectConversation = useCallback(async () => {
    setIsConnected(false);
    setRealtimeEvents([]);

    const client = clientRef.current;
    client.disconnect();

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.end();

    const wavStreamPlayer = wavStreamPlayerRef.current;

    await wavStreamPlayer.interrupt();
    getFeedbackToStudent();
  }, [items]);

  // const deleteConversationItem = useCallback(async (id: string) => {
  //   const client = clientRef.current;
  //   client.deleteItem(id);
  // }, []);

  useEffect(() => {
    if (eventsScrollRef.current) {
      const eventsEl = eventsScrollRef.current;
      const scrollHeight = eventsEl.scrollHeight;

      if (scrollHeight !== eventsScrollHeightRef.current) {
        eventsEl.scrollTop = scrollHeight;
        eventsScrollHeightRef.current = scrollHeight;
      }
    }
  }, [realtimeEvents]);

  useEffect(() => {
    const conversationEls = [].slice.call(
      document.body.querySelectorAll("[data-conversation-content]")
    );

    for (const el of conversationEls) {
      const conversationEl = el as HTMLDivElement;

      conversationEl.scrollTop = conversationEl.scrollHeight;
    }
  }, [items]);

  useEffect(() => {
    // Get refs
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const client = clientRef.current;

    // Set instructions
    client.updateSession({ instructions: user?.role === "teacher" && user.firstName ? teacherInstructions(user.firstName, classRoom?.learningPlan || "") : studentInstructions });
    // Set transcription, otherwise we don't get user transcriptions back
    client.updateSession({ input_audio_transcription: { model: "whisper-1" } });

    // handle realtime events from client + server for event logging
    client.on("realtime.event", (realtimeEvent: RealtimeEvent) => {
      setRealtimeEvents((realtimeEvents) => {
        const lastEvent = realtimeEvents[realtimeEvents.length - 1];

        if (lastEvent?.event.type === realtimeEvent.event.type) {
          // if we receive multiple events in a row, aggregate them for display purposes
          lastEvent.count = (lastEvent.count || 0) + 1;
          return realtimeEvents.slice(0, -1).concat(lastEvent);
        } else {
          return realtimeEvents.concat(realtimeEvent);
        }
      });
    });

    client.on("error", (event: any) => {
      console.error(event);
    });

    client.on("conversation.interrupted", async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();

      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;

        await client.cancelResponse(trackId, offset);
      }
    });

    client.on("conversation.updated", async ({ item, delta }: any) => {
      const items = client.conversation.getItems();

      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }

      if (item.status === "completed" && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        );
        item.formatted.file = wavFile;
      }

      setItems(items);

      if (items[items.length - 1]?.formatted?.transcript?.includes("**CREATING ASSIGNMENT**") && user?.role === "teacher") {
        const transcript = items[items.length - 1]?.formatted?.transcript;
        const assignmentText = transcript ? transcript.split("**CREATING ASSIGNMENT**")[1] : "";
        const lines = assignmentText.trim().split("\n");

        const title = lines.find(line =>
          line.startsWith("**Title**") || line.startsWith("**Title:**")
        )?.replace(/^\*\*Title\**:\s*/, "").trim();
        const topic = lines.find(line =>
          line.startsWith("**Topic**") || line.startsWith("**Topic:**")
        )?.replace(/^\*\*Title\**:\s*/, "").trim();
        const description = lines.find(line =>
          line.startsWith("**Description**") || line.startsWith("**Description:**")
        )?.replace(/^\*\*Title\**:\s*/, "").trim();
        const time = parseInt(
          lines.find(line =>
            line.startsWith("**Time**") || line.startsWith("**Time:**")
          )?.replace("**Time**: ", "").replace("**Time**", "") || "0"
        );

        if (title) {
          setAssignmentTitle(title);
        }

        if (topic) {
          setAssignmentTopic(topic);
        }

        if (description) {
          setAssignmentDescription(description);
        }

        if (time) {
          setAssignmentTime(+time * 60);
        }
      }

      if (items[items.length - 1]?.formatted?.transcript?.includes("**Feedback**") && user?.role === "student") {
        const transcript = items[items.length - 1]?.formatted?.transcript;
        const feedbackText = transcript ? transcript.split("**Feedback**: ")[1] : "";

        if (feedbackText) {
          setStudentsFeedback(feedbackText);
        }
      }
    });
    const items = client.conversation.getItems();
    setItems(items);


    return () => {
      client.reset();
    };
  }, [user?.id, params.assignmentId, user?.role, user?.firstName, studentInstructions, classRoom]);

  // update assignment summary
  const updateStudentStatusHandler = async () => {
    updateStudentStatus({
      classRoomId: classRoomId,
      assignmentId: params.assignmentId ?? "",
      studentEmail: user?.email as string,
      feedback: studentsFeedback ?? "",
    });

    await generateAssignmentSummary(params.assignmentId as string, studentsProgress as string);
  };

  // handle student time 
  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setTimeCounter((prevCounter) => prevCounter + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning]);

  const getFeedbackToStudent = async (): Promise<any> => {
    const studentsConversation = items.map(item => item.formatted.transcript).join(" ");

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that selects key topics for students.",
          },
          {
            role: "user",
            content: `${studentFeedbackInstructions(user?.firstName || '', studentsConversation)}`,
          },
        ],
        max_tokens: 150,
      });

      if (response.choices[0].message.content) {
        setStudentsFeedback(response.choices[0].message.content.trim().replace("**Feedback**: ", ""));
      }

    } catch (error) {
      console.error("Error fetching topics from OpenAI:", error);
      return null;
    }
  };

  const formatAssignmentTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    switch (true) {
      case minutes !== 0 && remainingSeconds !== 0:
        return `${minutes}min ${remainingSeconds}s`;
      case minutes !== 0 && remainingSeconds === 0:
        return `${minutes}min`;
      case minutes === 0:
        return `${remainingSeconds}s`;
      default:
        return "0s";
    }
  };

  return (
    <div
      data-component="ConsolePage"
      className="flex flex-col justify-between h-[100vh] w-full m-auto"
    >
      <div className="pt-[100px] h-[calc(100dvh-142px)]">
        <div className="p-[20px] border-b-[1px] fixed z-[1] top-0 w-full bg-white">
          <div className="absolute top-[20px] left-[20px]">
            <Link to={role === "teacher" ? "/classes" : "/student-assignments"}>
              <img src={`${LeftArrowIcon}`} />
            </Link>
          </div>
          <div className="flex flex-col gap-[6px]">
            <h2 className="text-center text-[20px]">AI Assistant</h2>
            {role === "student" && !isAssignmentsPending && currentAssignment && (
              <span className="text-center text-[14px]">
                Time to discuss: {currentAssignment?.timeToDiscuss ? formatAssignmentTime(currentAssignment.timeToDiscuss) : ""} /
                <span> {minutes}min</span> : <span>{remainingSeconds < 10 && "0"}{remainingSeconds}s</span>
              </span>
            )}
          </div>
        </div>

        {!isConnected ? (
          <div className="px-[20px] pb-[200px] h-[calc(100dvh-170px)] w-full m-auto md:w-[700px]">
            {items.length === 0 && (
              <div className="h-full">
                {role === "teacher" ? (
                  <AssignmentsBasedOnLearningPlan />
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p>Start talk</p>
                  </div>
                )}
              </div>
            )}

            {items.length > 0 && (
              <div>
                <div
                  className="py-[10px] flex flex-col gap-[15px]"
                  data-conversation-content
                >
                  <div
                    className={`
                      ${items.at(-1)?.role === "user" && "justify-end"} 
                      flex
                    `}
                  >
                    <div className="max-w-[95%] flex gap-[8px]">
                      <div>
                        <div
                          className={`${items.at(-1)?.role === "user" &&
                            "justify-end"
                            } flex`}
                        >
                          <span className="border-[1px] bg-gray-200 px-[10px] py-[6px] rounded-[8px]">
                            {(items.at(-1)?.role === "assistant" ? "AI" : items.at(-1)?.role) || items.at(-1)?.type}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-300 rounded-[10px] p-[8px]">
                        {items.at(-1)?.type ===
                          "function_call_output" && (
                            <div>{items.at(-1)?.formatted.output}</div>
                          )}
                        {!!items.at(-1)?.formatted.tool && (
                          <div>
                            {items.at(-1)?.formatted?.tool?.name}(
                            {items.at(-1)?.formatted?.tool?.arguments})
                          </div>
                        )}
                        {!items.at(-1)?.formatted.tool &&
                          items.at(-1)?.role === "user" && (
                            <div className="bg-red">
                              {items.at(-1)?.formatted.transcript ||
                                (items.at(-1)?.formatted.audio?.length
                                  ? "(awaiting transcript)"
                                  : items.at(-1)?.formatted.text ||
                                  "(item sent)")}
                            </div>
                          )}
                        {!items.at(-1)?.formatted.tool &&
                          items.at(-1)?.role === "assistant" && (
                            <div>
                              {items.at(-1)?.formatted.transcript ||
                                items.at(-1)?.formatted.text ||
                                "(truncated)"}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[100dvh] mt-[-120px] flex items-center justify-center">
            {connectionLoading ? <p className="text-center">Connection loading...</p> : <SpeakingDots isConnected={isConnected} />}
          </div>
        )}
      </div>

      <div
        className={`
          ${!isConnected ? "justify-end" : "justify-start"}
          flex items-end min-h-[90px] pt-[30px]
          pb-[20px] fixed bottom-0 z-0 px-[20px]
          w-full bg-white
        `}
      >
        {isConnected && (
          <button
            className="relative z-[2] bg-main-red p-[12px] rounded-[50%]"
            onClick={disconnectConversation}
          >
            <img src={`${CrossIconWhite}`} alt="close" />
          </button>
        )}

        <div className="absolute top-[0] left-[10px] w-[calc(100%-20px)] z-[1] flex justify-center">
          {/* {role === "teacher" && items.length === 0 && (<div className="flex flex-col justify-center items-center gap-[5px]">
            <svg width="19" height="22" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.49809 15H9.49809M5.49809 10H13.4981M5.00009 2.5C3.44409 2.547 2.51709 2.72 1.87509 3.362C0.996094 4.242 0.996094 5.657 0.996094 8.488V14.994C0.996094 17.826 0.996094 19.241 1.87509 20.121C2.75309 21 4.16809 21 6.99609 21H11.9961C14.8251 21 16.2391 21 17.1171 20.12C17.9971 19.241 17.9971 17.826 17.9971 14.994V8.488C17.9971 5.658 17.9971 4.242 17.1171 3.362C16.4761 2.72 15.5481 2.547 13.9921 2.5" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.99609 2.75C4.99609 1.784 5.78009 1 6.74609 1H12.2461C12.7102 1 13.1553 1.18437 13.4835 1.51256C13.8117 1.84075 13.9961 2.28587 13.9961 2.75C13.9961 3.21413 13.8117 3.65925 13.4835 3.98744C13.1553 4.31563 12.7102 4.5 12.2461 4.5H6.74609C6.28197 4.5 5.83685 4.31563 5.50866 3.98744C5.18047 3.65925 4.99609 3.21413 4.99609 2.75Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            <p className="text-[15px] font-semibold">Let's create a new task</p>
          </div>
          )} */}

          {user?.role === "teacher" && (
            <button
              className={`
                ${!isConnected && "border-[1px]"} 
                rounded-[50%] bg-white p-[10px] w-[77.6px] h-[77.6px]
              `}
              style={{
                boxShadow: isConnected
                  ? "5px 4px 20px 0px rgba(0, 0, 0, 0.13)"
                  : "",
                backgroundImage: isConnected
                  ? `url(/pause-icon.svg)`
                  : `url(/microphone-light.svg)`,
                backgroundPositionX: "center",
                backgroundPositionY: "center",
                backgroundRepeat: "no-repeat",
              }}
              onClick={!isConnected ? connectConversation : disconnectConversation}
            />
          )}

          {user?.role === "student" && (
            <button
              className={`
                ${!isConnected && "border-[1px]"} 
                rounded-[50%] bg-white p-[10px] w-[77.6px] h-[77.6px]
                disabled:opacity-[0.4] relative z-[3]
              `}
              style={{
                boxShadow: isConnected
                  ? "5px 4px 20px 0px rgba(0, 0, 0, 0.13)"
                  : "",
                backgroundImage: isConnected
                  ? `url(/pause-icon.svg)`
                  : `url(/microphone-light.svg)`,
                backgroundPositionX: "center",
                backgroundPositionY: "center",
                backgroundRepeat: "no-repeat",
              }}
              disabled={(!isAssignmentsPending && currentAssignment === null)}
              onClick={() => {
                if (!isConnected) {
                  connectConversation();
                  setIsTimerRunning(true);
                } else {
                  disconnectConversation();
                  setIsTimerRunning(false);

                  if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                  }
                }
              }}
            />
          )}
        </div>

        {items.length > 0 && !isConnected && user?.role === "teacher" && (
          <div className="self-end relative z-[2]">
            <Button
              className="text-main-red border-main-red px-[22px] hover:bg-main-red hover:text-white"
              onClick={() => setIsAssignmentModalOpen(true)}
            >
              Assign
            </Button>
          </div>
        )}

        {items.length > 0 && !isConnected && user?.role === "student" && currentAssignment && (
          <div className="absolute right-[20px] bottom-[20px]">
            {timeCounter >= currentAssignment.timeToDiscuss ? (
              <Button
                className="border-main-red w-full px-[22px] bg-main-red text-white"
                onClick={() => {
                  updateStudentStatusHandler();
                }}
              >
                Save
              </Button>
            ) : (
              <div className="text-[14px] w-[100px] self-end">Need to reach the time limit</div>
            )}
          </div>
        )}
      </div>

      {user?.role !== "student" && <AssignmentModal
        assignmentTopic={assignmentTopic}
        assignmentTitle={assignmentTitle}
        assignmentDescription={assignmentDescription}
        assignmentTime={assignmentTime}
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
      />}
    </div>
  );
};
