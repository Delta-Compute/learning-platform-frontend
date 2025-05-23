import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import { AgentProvider } from '../LiveKit/hooks/useAgent.tsx';
import { useConnection } from '../LiveKit/hooks/useConnection.tsx';
import { Chat } from './component';
import { t } from 'i18next';

export const IntroducingWithAI = () => {
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
        <div className="p-[20px] border-b-[1px] fixed z-10 top-0 w-full bg-bg-color">
          <div className="flex flex-col gap-[6px]">
            <h2 className="text-center text-[20px]">{t("conversationPage.headerTitle")}</h2>
          </div>
        </div>

        <div className="h-[100dvh] flex flex-col justify-between bg-bg-color">
          <div>
            <RoomAudioRenderer />
          </div>
          <Chat />
        </div>
      </AgentProvider>
    </LiveKitRoom>
  );
};