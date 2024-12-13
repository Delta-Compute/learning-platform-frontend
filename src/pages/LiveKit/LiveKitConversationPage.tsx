import React from "react";

import {
  LiveKitRoom,
  RoomAudioRenderer,
} from "@livekit/components-react";

import "@livekit/components-styles";

import { useConnection, AgentProvider } from "./hooks";

import { Chat } from "./components";

export const LiveKitConversationPage = () => {
  const { shouldConnect, wsUrl, token } = useConnection();

  return (
    <LiveKitRoom
      serverUrl={wsUrl}
      token={token}
      connect={shouldConnect}
      audio={true}
      className="flex flex-col"
      style={{ "--lk-bg": "white" } as React.CSSProperties}
      options={{
        publishDefaults: {
          stopMicTrackOnMute: true,
        },
      }}
    >
      <AgentProvider>
        <div className="h-[100dvh] flex flex-col justify-between">
          <div>
            <RoomAudioRenderer />
          </div>
          <Chat />
        </div>
      </AgentProvider>
    </LiveKitRoom>
  );
};