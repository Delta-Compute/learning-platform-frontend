import { Link } from "react-router-dom";
import LeftArrowIcon from "../../assets/icons/left-arrow.svg";


import { useTranslation } from "react-i18next";
import SchoolNamesContext from '../../context/SchoolNamesContext.tsx';
import { AgentProvider } from '../LiveKit/hooks/useAgent.tsx';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import { useConnection } from '../LiveKit/hooks/useConnection.tsx';
import { useContext } from 'react';
import { Chat } from './component';

export const SecretInfo = () => {
  const { t } = useTranslation();
  const { shouldConnect, wsUrl, token } = useConnection();

  const { currentSchoolName } = useContext(SchoolNamesContext);


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
          <div className="absolute top-[20px] left-[20px]">
            <Link
              to={`/${currentSchoolName}/join-your-school`}
            >
              <img src={`${LeftArrowIcon}`} />
            </Link>
          </div>
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