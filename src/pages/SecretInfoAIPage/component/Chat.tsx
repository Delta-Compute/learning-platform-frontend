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
import { ConnectButton, SessionControls } from "../../LiveKit/components/index.ts";

import { openai } from "../../../vars/index.ts";

import { toast } from "react-hot-toast";

import PauseIcon from "../../../assets/icons/pause-icon.svg";
import { instructionsForSecretWords, getFavoiriteColorAndNumberInstructions } from '../../../utils/conversation_config.ts';
import { parseSecrets } from '../../../utils/parseSecrets.ts';


export const Chat: React.FC = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { currentSchoolName } = useContext(SchoolNamesContext);
  const [color, setColor] = useState("");
  const [number, setNumber] = useState("");

  const { disconnect } = useConnection();
  const { audioTrack, state } = useVoiceAssistant();
  const connectionState = useConnectionState();

  const [isChatRunning, setIsChatRunning] = useState(false);

  const {
    agent,
    displayTranscriptions,
  } = useAgent();

  // change information state
  const { pgState } = usePlaygroundState();

  useEffect(() => {
    pgState.instructions = instructionsForSecretWords();
  }, [pgState]);

  useEffect(() => {
    if (displayTranscriptions.length > 0) {
      if (displayTranscriptions && displayTranscriptions[displayTranscriptions.length - 1].segment.text.includes("Ending")) {
        disconnectHandler();
      }
    }
  }, [displayTranscriptions]);

  const [hasSeenAgent, setHasSeenAgent] = useState(false);

  const getFeedBackAndGeneralInformation = async (): Promise<any> => {

    const conversation = displayTranscriptions.map(item => item.segment.text).join(" ");

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that asks for favorite color and number",
          },
          {
            role: "user",
            content: `${getFavoiriteColorAndNumberInstructions(conversation)}`,
          },
        ],
        max_tokens: 150,
      });

      if (response.choices[0].message.content) {
        const parsedData = parseSecrets(response.choices[0].message.content);

        setColor(parsedData.color);
        setNumber(parsedData.number);
      }
    } catch (error) {
      console.error("Error fetching topics from OpenAI:", error);
      return null;
    }
  };

  const handleNavigateToCreateProfile = () => {
    navigate(`/${currentSchoolName}/confirm-secret-info-ai`, { state: { color, number } });
  };

  const disconnectHandler = async () => {
    try {
      await getFeedBackAndGeneralInformation();
      await disconnect();
    } catch (error) {
      console.log(error);
    }
  };

  const navigateHandler = () => {
    handleNavigateToCreateProfile();
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
      <div className="flex flex-col justify-between">
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
            {displayTranscriptions.length === 0 ?
              <div className="flex justify-center items-center w-full h-[100dvh] absolute left-0 top-0">
                <p className="text-center">{t("conversationPage.secondTitleSecret")}</p>
              </div>
              :
              <div className="absolute right-[20px] bottom-[20px]">
                <Button
                  className="border-main w-full px-[22px] bg-main text-white"
                  onClick={() => {
                    navigateHandler();
                  }}
                >
                  {t("authPages.introducingAIPage.updateProfileButton")}
                </Button>
              </div>
            }
          </div>
        )}
      </div>

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
          <ConnectButton />
        )}
      </div>
    </div>
  );
};

export default Chat;