import React, { useContext, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

import UserContext from "../../../context/UserContext";
import SchoolNamesContext from "../../../context/SchoolNamesContext";

import { IAssignment } from "../../../types";

import {
  teacherInstructions,
  studentInstructionsForAI,
  studentFeedbackInstructions,
} from "../../../utils/conversation_config.ts";

import { ConnectionState } from "livekit-client";

import {
  BarVisualizer,
  useConnectionState,
  useVoiceAssistant,
} from "@livekit/components-react";

import {
  useAgent,
  useConnection,
  usePlaygroundState,
} from "../../LiveKit/hooks";
import { VoiceId } from "../../LiveKit/data";

import {
  useGetRoomsAssignments,
  useClassById,
  useGenerateAssignmentSummary,
  useGetStudentAssignments,
  useWakeLock,
} from "../../../hooks";
import { ClassRoomProgressApiService } from "../../../services";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button, Modal } from "../../../components";
import { ConnectButton, SessionControls } from "../../LiveKit/components";
import { AssignmentsBasedOnLearningPlan } from "../AssignmentsBasedOnLearningPlan";
import { checkAndShowModal } from "../../../utils/checkShowFeedbackModal";
import { AssignmentModal } from "../AssignmentModal";

import { openai } from "../../../vars";

import { toast } from "react-hot-toast";

import PauseIcon from "../../../assets/icons/pause-icon.svg";

interface ChatProps {
  role: "student" | "teacher";
  timeCounter?: number;
  studentAssignments?: IAssignment[];
  onStartStudentTimer?: () => void;
  onStopStudentTimer?: () => void;
};

export const Chat: React.FC<ChatProps> = ({
  role,
  timeCounter,
  studentAssignments,
  onStartStudentTimer,
  onStopStudentTimer,
}) => {
  const params = useParams();
  const navigate = useNavigate();

  const { releaseWakeLock } = useWakeLock();

  const { t } = useTranslation();

  const { user } = useContext(UserContext);
  const { currentSchoolName } = useContext(SchoolNamesContext);

  const { disconnect } = useConnection();
  const { audioTrack, state } = useVoiceAssistant();
  const connectionState = useConnectionState();

  const [isChatRunning, setIsChatRunning] = useState(false);

  const [studentsFeedback, setStudentsFeedback] = useState("");

  const [currentAssignment, setCurrentAssignment] = useState<IAssignment | null>(null);

  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // assignment
  const [assignment, setAssignment] = useState({
    topic: "",
    title: "",
    description: "",
    time: 0,
  });

  const {
    agent,
    displayTranscriptions,
  } = useAgent();


  useEffect(() => {
    if (displayTranscriptions.length > 0) {
      if (displayTranscriptions && displayTranscriptions[displayTranscriptions.length - 1].segment.text.includes("Ending")) {
        disconnectHandler();
      }
    }
  }, [displayTranscriptions]);

  const {
    data: assignmentsData,
    refetch: assignmentsRefetch,
  } = useGetRoomsAssignments(params.classRoomId as string);

  const checkShowFeedbackModal = () => {
    if (assignmentsData && assignmentsData.length > 0) {
      const check = checkAndShowModal(assignmentsData.length);

      if (check) {
        setIsFeedbackModalOpen(true);
      }
    }
  };

  const { data: assignments } = useGetStudentAssignments(user?.email ?? "");

  const checkStudentAssignmentsShowFeedbackModal = () => {
    if (assignments && assignments.length > 0) {
      const closed = assignments.filter((assignment) => assignment.deadline <= new Date().getTime()).sort((a, b) => b.deadline - a.deadline);
      const check = checkAndShowModal(closed.length);

      if (check) {
        setIsFeedbackModalOpen(true);
      }
    }
  };

  const [classRoomId, setClassRoomId] = useState("");

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
      checkStudentAssignmentsShowFeedbackModal();
    },
    onError: () => {
      toast.success("Something went wrong");
    }
  });

  const { generateAssignmentSummary } = useGenerateAssignmentSummary();

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

  const { data: classRoom } = useClassById(
    role === "teacher" ? params.classRoomId as string : classRoomId
  );

  // change information state
  const { pgState } = usePlaygroundState();

  // instructions for student
  useEffect(() => {
    if (role === "student" && user && studentAssignments) {
      studentAssignments.map(assignment => {
        if (assignment.id === params.assignmentId) {
          pgState.instructions = studentInstructionsForAI(
            user.firstName!,
            user.foreignLanguage,
            assignment.topic,
            user.natureLanguage,
            (assignment.timeToDiscuss / 60).toString(),
            assignment.description,
          );
          setClassRoomId(assignment.classRoomId);
          setCurrentAssignment(assignment);
        }
      });
    }
  }, [user, studentAssignments, classRoomId]);

  // instructions for teacher
  useEffect(() => {
    if (role === "teacher" && user && classRoom) {
      pgState.instructions = teacherInstructions(
        user.firstName!,
        classRoom.learningPlan || "",
        user?.natureLanguage,
        user?.foreignLanguage
      );
    }
  }, [user, classRoom]);

  const [hasSeenAgent, setHasSeenAgent] = useState(false);

  const getFeedbackToStudent = async (): Promise<any> => {
    const studentsConversation = displayTranscriptions.map(item => item.segment.text).join(" ");

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
        max_tokens: 250,
      });

      if (response.choices[0].message.content) {
        setStudentsFeedback(response.choices[0].message.content.trim().replace("**Feedback**: ", ""));
      }

    } catch (error) {
      console.error("Error fetching topics from OpenAI:", error);
      return null;
    }
  };

  const disconnectHandler = async () => {
    try {
      await disconnect();

      releaseWakeLock();

      onStopStudentTimer && onStopStudentTimer();
      getFeedbackToStudent();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let disconnectTimer: NodeJS.Timeout | undefined;
    let appearanceTimer: NodeJS.Timeout | undefined;

    pgState.sessionConfig.voice = VoiceId.alloy;

    if (connectionState === ConnectionState.Connected && !agent) {
      appearanceTimer = setTimeout(() => {
        disconnect();
        setHasSeenAgent(false);

        toast("Agent Unavailable");
      }, 5000);
    }

    if (agent) {
      setHasSeenAgent(true);
    }

    if (
      connectionState === ConnectionState.Connected &&
      !agent &&
      hasSeenAgent
    ) {
      // Agent disappeared while connected, wait 5s before disconnecting
      disconnectTimer = setTimeout(() => {
        if (!agent) {
          disconnect();
          setHasSeenAgent(false);
        }

        toast("Agent Disconnected");
      }, 5000);
    }

    setIsChatRunning(
      connectionState === ConnectionState.Connected && hasSeenAgent,
    );

    return () => {
      if (disconnectTimer) clearTimeout(disconnectTimer);
      if (appearanceTimer) clearTimeout(appearanceTimer);
    };
  }, [connectionState, agent, disconnect, hasSeenAgent]);

  useEffect(() => {
    let transcriptions;

    if (displayTranscriptions.length > 0) transcriptions = displayTranscriptions.at(-1)?.segment.text;

    if (transcriptions && role === "teacher") {
      const extractField = (text: string, key: string) => {
        const regex = new RegExp(`\\*\\*${key}\\*\\*:\\s*(.*?)(?=\\*\\*|$)`, "gs");
        const match = regex.exec(text);

        return match ? match[1].trim() : undefined;
      };

      const title = extractField(transcriptions, "Title");
      const topic = extractField(transcriptions, "Topic");
      const description = extractField(transcriptions, "Description");
      const time = parseInt(extractField(transcriptions, "Time") || "1", 10);

      setAssignment({
        title: title ?? "",
        topic: topic ?? "",
        description: description ?? "",
        time: time * 60,
      });
    }

    if (transcriptions && role === "student") {
      const feedbackText = transcriptions.split("**Feedback**: ")[1];

      if (feedbackText) {
        setStudentsFeedback(feedbackText);
      }
    }
  }, [displayTranscriptions]);

  const renderVisualizer = () => (
    <div className="flex w-full items-center">
      <div className="h-[320px] w-full">
        <BarVisualizer
          state={state}
          barCount={5}
          trackRef={audioTrack}
          className="w-full h-full bg-bg-color"
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="h-[100dvh] flex flex-col justify-between">
        {isChatRunning && (
          <div className="w-full">
            <div className="h-[100dvh] w-full flex justify-center items-center absolute left-0 top-0">
              <div>
                {renderVisualizer()}
              </div>
            </div>
          </div>
        )}

        {!isChatRunning && (
          <div className="mt-[90px] px-3">
            {displayTranscriptions.length === 0 && (
              <div className="h-full">
                {role === "teacher" ? (
                  <AssignmentsBasedOnLearningPlan
                    assignmentsRefetch={assignmentsRefetch}
                    checkShowFeedbackModal={checkShowFeedbackModal}
                  />
                ) : (
                  <div className="flex justify-center items-center w-full h-[100dvh] absolute left-0 top-0">
                    <p className="text-center">{t("conversationPage.startTalkText")}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-center py-4 px-5">
          {isChatRunning ? (
            <div className="relative w-full h-[80px] flex items-center">
              <div className="relative z-30">
                <SessionControls />
              </div>

              <div className="w-full flex justify-center absolute z-10 left-0 top-0">
                <button
                  onClick={disconnectHandler}
                  className="
                    border-[1px] rounded-full w-[77.6px] h-[77.6px]
                    flex items-center justify-center bg-white
                  "
                >
                  <img src={`${PauseIcon}`} alt="pause" />
                </button>
              </div>
            </div>
          ) : (
            <ConnectButton onStartStudentTimer={onStartStudentTimer} />
          )}
        </div>

        {displayTranscriptions.length > 0 && !isChatRunning && user?.role === "teacher" && (
          <div className="fixed bottom-[20px] right-[20px]">
            <Button
              className="text-main border-main px-[22px] bg-white hover:bg-main-red hover:text-white"
              onClick={() => setIsAssignmentModalOpen(true)}
            >
              {t("conversationPage.assignButton")}
            </Button>
          </div>
        )}

        {displayTranscriptions.length > 0 && !isChatRunning && role === "student" && currentAssignment && timeCounter && (
          <div className="absolute right-[20px] bottom-[20px]">
            {timeCounter >= currentAssignment.timeToDiscuss ? (
              <Button
                className="border-main w-full px-[22px] bg-main text-white"
                onClick={() => {
                  updateStudentStatusHandler();
                }}
              >
                {t("conversationPage.saveStudentFeedbackButton")}
              </Button>
            ) : (
              <div className="text-[14px] w-[100px] self-end">{t("conversationPage.reachTimeLimitText")}</div>
            )}
          </div>
        )}
      </div>

      {role === "teacher" && (
        <AssignmentModal
          assignmentTopic={assignment.topic}
          assignmentTitle={assignment.title}
          assignmentDescription={assignment.description}
          assignmentTime={assignment.time}
          isOpen={isAssignmentModalOpen}
          onClose={() => setIsAssignmentModalOpen(false)}
          onClassRoomAssignmentsRefetch={assignmentsRefetch}
          checkShowFeedbackModal={checkShowFeedbackModal}
        />)
      }

      <Modal title={t("teacherPages.classes.classModal.titleCreateFeedback")} isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)}>
        <div className="flex flex-col gap-4">
          <p className="text-center">{t("teacherPages.classes.classModal.createFeedbackQuestion")}</p>
          <div className='flex gap-2'>
            <Button className="bg-white w-[50%]" onClick={() => setIsFeedbackModalOpen(false)}>{t("teacherPages.classes.classModal.laterButton")}</Button>
            <Button className="bg-[#CC1316] text-white w-[50%]" onClick={() => navigate(`/${currentSchoolName}/feedback`)}>{t("teacherPages.classes.classModal.giveFeedbackButton")}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};