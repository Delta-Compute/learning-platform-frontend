import { useEffect, useState } from "react";

import { ConnectionState } from "livekit-client";

import { BarVisualizer, useConnectionState, useVoiceAssistant } from "@livekit/components-react";

import {
  useAgent,
  useConnection,
  // usePlaygroundState,
} from "../hooks";
// import { VoiceId } from "../data";

import { ConnectButton, SessionControls } from "../components";

import { toast } from "react-hot-toast";

import PauseIcon from "../../../assets/icons/pause-icon.svg";

export const Chat = () => {
  const { disconnect } = useConnection();
  const connectionState = useConnectionState();
  const { audioTrack, state } = useVoiceAssistant();
  const [isChatRunning, setIsChatRunning] = useState(false);
  const {
    agent,
    // displayTranscriptions
  } = useAgent();

  // change information state
  // const { pgState } = usePlaygroundState();
  //
  // useEffect(() => {
  //   pgState.sessionConfig.voice = VoiceId.sage;
  // }, []);

  // conversation items
  // displayTranscriptions

  const [hasSeenAgent, setHasSeenAgent] = useState(false);

  useEffect(() => {
    let disconnectTimer: NodeJS.Timeout | undefined;
    let appearanceTimer: NodeJS.Timeout | undefined;

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
          className="w-full h-full"
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col">
        <div className="w-full">
          <div className="h-[100dvh] w-full flex justify-center items-center absolute left-0 top-0">
            <div>
              {isChatRunning && renderVisualizer()}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center py-4 px-5">
          {isChatRunning ? (
            <div className="relative w-full h-[80px] flex items-center">
              <div className="relative z-30">
                <SessionControls />
              </div>

              <div className="w-full flex justify-center absolute z-10 left-0 top-0">
                <button
                  onClick={async () => await disconnect()}
                  className="
                    border-[1px] rounded-full w-[77.6px] h-[77.6px]
                    flex items-center justify-center
                  "
                >
                  <img src={`${PauseIcon}`} alt="pause"/>
                </button>
              </div>
            </div>
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
    </div>
  );
};