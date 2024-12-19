import React, { 
  useContext, 
  useState, 
  useEffect, 
} from "react";

import { useTranslation } from "react-i18next";

import { IAssignment } from "../../types";

import { Link, useParams } from "react-router-dom";

import { useGetStudentAssignments } from "../../hooks";

import SchoolNamesContext from "../../context/SchoolNamesContext";
import UserContext from "../../context/UserContext";

import {
  LiveKitRoom,
  RoomAudioRenderer,
} from "@livekit/components-react";

import "@livekit/components-styles";

import { useConnection, AgentProvider } from "../../pages/LiveKit/hooks";

import { Chat } from "./components";

import LeftArrowIcon from "../../assets/icons/left-arrow.svg";

interface ConversationPageProps {
  role: "teacher" | "student",
};

export const ConversationPage: React.FC<ConversationPageProps> = ({ role }) => {
  const params = useParams();
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const { currentSchoolName } = useContext(SchoolNamesContext);
  const { shouldConnect, wsUrl, token } = useConnection();

  const [currentAssignment, setCurrentAssignment] = useState<IAssignment | null>(null);

  const [timeCounter, setTimeCounter] = useState(0);
  const minutes = Math.floor(timeCounter / 60);
  const remainingSeconds = timeCounter % 60;
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const { 
    data: assignments, 
    isPending: isAssignmentsPending, 
    refetch: studentAssignmentsRefetch, 
  } = useGetStudentAssignments(user?.email ?? "");

  useEffect(() => {
    if (role === "student") studentAssignmentsRefetch();
  }, [user?.email, studentAssignmentsRefetch]);

  useEffect(() => {
    if (user && user.role === "student" && assignments) {
      assignments.map(item => {
        if (item.id === params.assignmentId && user.firstName) {
          setCurrentAssignment(item);
        }
      });
    }
  }, [user?.role, user?.id, assignments, user, params.assignmentId]);

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
              to={role === "teacher" ? `/${currentSchoolName}/classes` : `/${currentSchoolName}/student-assignments`}>
              <img src={`${LeftArrowIcon}`}/>
            </Link>
          </div>
          <div className="flex flex-col gap-[6px]">
            <h2 className="text-center text-[20px]">{t("conversationPage.headerTitle")}</h2>
            {role === "student" && !isAssignmentsPending && currentAssignment && (
              <span className="text-center text-[14px]">
                {t("conversationPage.studentTimeTitle")}: {currentAssignment?.timeToDiscuss ? formatAssignmentTime(currentAssignment.timeToDiscuss) : ""} /
                <span> {minutes}min</span> : <span>{remainingSeconds < 10 && "0"}{remainingSeconds}s</span>
              </span>
            )}
          </div>
        </div>

        <div className="h-[100dvh] flex flex-col justify-between bg-bg-color">
          <div>
            <RoomAudioRenderer/>
          </div>
          <Chat 
            role={role}
            timeCounter={timeCounter}
            studentAssignments={assignments as IAssignment[]}
            onStartStudentTimer={() => setIsTimerRunning(true)}
            onStopStudentTimer={() => {
              setIsTimerRunning(false);

              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
            }} 
          />
        </div>
      </AgentProvider>
    </LiveKitRoom>
  );
};