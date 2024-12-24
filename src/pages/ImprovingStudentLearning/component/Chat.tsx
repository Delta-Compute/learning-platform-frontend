import React, { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import SchoolNamesContext from "../../../context/SchoolNamesContext.tsx";

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
} from "../../LiveKit/hooks/index.ts";
import { VoiceId } from "../../LiveKit/data/index.ts";

import { Button } from "../../../components/index.ts";
import { SessionControls } from "../../LiveKit/components/index.ts";

import { openai } from "../../../vars/index.ts";

import { toast } from "react-hot-toast";

import PauseIcon from "../../../assets/icons/pause-icon.svg";
import { TasksForImproving } from '../TasksForImproving.tsx';
import { useUpdateUser } from '../../../hooks/index.ts';
import { Topic } from '../../../types/topic.ts';
import UserContext from '../../../context/UserContext.tsx';
import { feedBackFroImprovingSummmary } from '../../../utils/conversation_config.ts';
import { ConnectButton } from './ConnectButton.tsx';


export const Chat: React.FC = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { currentSchoolName } = useContext(SchoolNamesContext);
  const [isChosenTask, setIsChosenTask] = useState(false);

  const { disconnect } = useConnection();
  const { audioTrack, state } = useVoiceAssistant();
  const connectionState = useConnectionState();

  const [isChatRunning, setIsChatRunning] = useState(false);
  const [hasSeenAgent, setHasSeenAgent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(UserContext);
  const [summary, setSummary] = useState("");
  const [task, setTask] = useState<Topic | null>(null);
  const { mutate } = useUpdateUser();

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

  // change information state
  const { pgState } = usePlaygroundState();

  const updateUser = async () => {
    if (isLoading) return;
    await mutate({
      id: user?.id as string,
      userSummary: summary,
    },
      {
        onSuccess: () => {
          toast.success("Your profile has been updated successfully");
          navigate(`/${currentSchoolName}/student-assignments`);
        }
      }
    );
  };

  const getFeedBackAndGeneralInformation = async (): Promise<any> => {
    const conversation = displayTranscriptions.map(item => item.segment.text).join(" ");
    setIsLoading(true);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that asks for personal information to create a profile for the user. Please ask for the user's first name, last name, native language, foreign language, and role.",
          },
          {
            role: "user",
            content: `${feedBackFroImprovingSummmary(conversation)}`,
          },
        ],
        max_tokens: 350,
      });

      if (response.choices[0].message.content) {
        setSummary(response.choices[0].message.content);
      }

      setIsLoading(false);
    } catch (error) {
      toast.error("Error creating feedback");
      console.error("Error fetching topics from OpenAI:", error);
      return null;
    }
  };

  const disconnectHandler = async () => {
    try {
      setTask(null);
      await disconnect();
      setIsChosenTask(false);
      await getFeedBackAndGeneralInformation();
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
      <div className={`${!isChosenTask && !isChatRunning ? "h-[100dvh]" : ""} flex flex-col justify-between`}>
        {isChatRunning && (
          <div className="w-full">
            <div className="h-[100dvh] w-full flex justify-center items-center absolute left-0 top-0">
              <div>
                {renderVisualizer()}
              </div>
            </div>
          </div>
        )}

        {!isChatRunning && !task && (
          <div className="mt-[90px] px-3">
            <div className="px-3 flex justify-center items-start">
              {displayTranscriptions.length === 0
                ?
                (
                  <TasksForImproving feedback={user?.userSummary || ""} setTask={setTask} setIsChosenTask={setIsChosenTask} />
                )
                :
                (
                  <div className="h-full flex justify-center items-center">
                    <Button
                      className={`text-main border-main px-[22px] ${isLoading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
                        : 'hover:bg-main-red hover:text-white'
                        }`}
                      onClick={() => updateUser()}
                      disabled={isLoading}
                    >
                      {t("authPages.introducingAIPage.updateMyProfileButton")}
                    </Button>
                  </div>
                )
              }
            </div>
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
            <ConnectButton isChosenTask={isChosenTask} user={user!} task={task!} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;