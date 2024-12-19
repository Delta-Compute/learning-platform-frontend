import React, { useEffect, useState } from "react";


import { useTranslation } from "react-i18next";

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
import { ConnectButton, SessionControls } from "../../LiveKit/components/index.ts";

import { toast } from "react-hot-toast";

import PauseIcon from "../../../assets/icons/pause-icon.svg";

interface ChatProps {
  instruction: string;
};

export const Chat: React.FC<ChatProps> = ({ instruction }) => {
  console.log(instruction);
  
  const { t } = useTranslation();
  const { disconnect } = useConnection();
  const { audioTrack, state } = useVoiceAssistant();
  const connectionState = useConnectionState();

  const [isChatRunning, setIsChatRunning] = useState(false);

  const {
    agent,
  } = useAgent();

  // change information state
  const { pgState } = usePlaygroundState();

  useEffect(() => {
    pgState.instructions = instruction;
  }, [pgState, instruction]);

  const [hasSeenAgent, setHasSeenAgent] = useState(false);


  const disconnectHandler = async () => {
    try {
      await disconnect();
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
            <div className="flex justify-center items-center w-full h-[100dvh] absolute left-0 top-0">
              <p className="text-center">{t("conversationPage.startTalkText")}</p>
            </div>
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