import React from "react";
import { instructionForSummaryAI } from "../../utils/conversation_config.ts";

import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import { AgentProvider } from '../LiveKit/hooks/useAgent.tsx';
import { useConnection } from '../LiveKit/hooks/useConnection.tsx';
import { t } from 'i18next';
import { Chat } from './component';

interface AssignmentSummaryConversationProps {
  assignmentSummary: string;
  classRoomProgress: string;
  onClose: () => void;
  userName: string;
};

export const AssignmentSummaryConversation: React.FC<AssignmentSummaryConversationProps> = ({
  userName,
  classRoomProgress,
  onClose,
  assignmentSummary,
}) => {

  const { shouldConnect, wsUrl, token } = useConnection();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
            <div className="absolute top-[22px] right-[20px]">
              <button
                onClick={onClose}
                className="text-black hover:text-black transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-[6px]">
              <h2 className="text-center text-[20px]">{t("conversationPage.headerTitle")}</h2>
            </div>
          </div>

          <div className="h-[100dvh] flex flex-col justify-between bg-bg-color">
            <div>
              <RoomAudioRenderer />
            </div>
            <Chat instruction={instructionForSummaryAI(userName, assignmentSummary, classRoomProgress)} />
          </div>
        </AgentProvider>
      </LiveKitRoom>
    </div>
  );
};