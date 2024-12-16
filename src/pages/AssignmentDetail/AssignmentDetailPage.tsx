import { useEffect, useState, useContext } from "react";

import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";

import UserContext from '../../context/UserContext';
import SchoolNamesContext from "../../context/SchoolNamesContext";

import { Loader } from "../../components";
import { AssignmentSummaryConversation } from "./AssignmentSummaryConversation";
import Header from "../../components/ui/header/Header";

import { useGetRoomsAssignments, useGetStudentsProgress, useGetClassRoomProgress } from "../../hooks";

import { IAssignment } from "../../types";

import { format } from "date-fns";

import MicrophoneIcon from "../../assets/icons/microphone-light.svg";
import { ChevronDown } from "lucide-react";

export const AssignmentDetailPage = () => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [isProgressOpen, setIsProgressOpen] = useState(true);
  const [assignmentData, setAssignmentData] = useState<IAssignment | null>(null);
  const [isShownConversation, setIsShownConversation] = useState(false);

  const { classRoomId, assignmentId } = useParams();
  const { data, isPending, isRefetching: isAssignmentRefetching } = useGetRoomsAssignments(classRoomId as string);
  const { data: classRoomProgress, isPending: classRoomProgressPending, refetch, isRefetching } = useGetClassRoomProgress(classRoomId as string, assignmentId as string);
  const { data: studentsProgress } = useGetStudentsProgress(classRoomId as string, assignmentId as string);

  const { currentSchoolName } = useContext(SchoolNamesContext);

  useEffect(() => {
    refetch();
  }, [assignmentId, refetch]);

  useEffect(() => {
    const assignment = data?.find((item: any) => item.id === assignmentId);

    if (assignment) {
      setAssignmentData(assignment);
    }
  }, [data, isPending, assignmentId]);  

  const studentsDone = classRoomProgress?.studentsProgress.filter(student => student.progress).length;
  const allStudents = classRoomProgress?.studentsProgress.length;

  return (
    <>
      <div className="flex flex-col h-screen py-6 px-2 bg-[#FBF9F9]">
        <Header
          title={assignmentData?.title ? assignmentData.title : 'Assignment'}
          linkTo={`/${currentSchoolName}/classes/${classRoomId}`}
        />

        {(isPending || classRoomProgressPending || isRefetching || isAssignmentRefetching) && <Loader />}

        <div className="bg-[#FBF9F9] p-4 mt-20 pb-[80px]">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-lg font-semibold">{assignmentData?.title ? assignmentData.title : 'Assignment'}</h2>
            <p className="text-sm text-gray-500">{t("teacherPages.assignment.topicText")}: {assignmentData?.topic}</p>
            <p className="text-sm text-gray-500 mt-2">{assignmentData && format(new Date(assignmentData.deadline), "dd/MM/yyyy HH:mm")}</p>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm font-medium">{studentsDone}/{allStudents} {t("teacherPages.assignment.readyText")}</div>
              <div className="flex items-center gap-[5px]">
                {assignmentData && (
                  <div
                    className={`
                      px-3 py-1 
                      ${assignmentData.deadline >= new Date().getTime() ? "border-text-main-blue text-text-main-blue" : " border-text-light-green text-text-light-green"} 
                      text-sm rounded-full border-[1px]
                    `}
                  >
                    {assignmentData.deadline >= new Date().getTime() ? t("teacherPages.assignment.assignmentStatus.inProgress") : t("teacherPages.assignment.assignmentStatus.completed")}
                  </div>
                )}

                <button
                  className="border-[1px] rounded-full w-[32px]"
                  onClick={() => setIsShownConversation(true)}
                >
                  <img src={`${MicrophoneIcon}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsSummaryOpen(!isSummaryOpen)}
            >
              <h2 className="text-lg font-semibold mb-2">{t("teacherPages.assignment.classSummaryText")}</h2>
              <button className={`text-gray-500 transform transition-transform duration-300 ${isSummaryOpen ? 'rotate-180' : ''}`}>
                <ChevronDown />
              </button>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${isSummaryOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
            >
              <p className="text-sm text-gray-700">
                {assignmentData?.summary}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsProgressOpen(!isProgressOpen)}
            >
              <h2 className="text-lg font-semibold mb-2">{t("teacherPages.assignment.classProgressText")}</h2>
              <button className={`text-gray-500 transform transition-transform duration-300 ${isProgressOpen ? 'rotate-180' : ''}`}>
                <ChevronDown />
              </button>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${isProgressOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
            >
              <ul className="mt-2">
                {classRoomProgress?.studentsProgress.map((student, index) => (
                  <li key={index} className="flex flex-col mb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${student.progress ? "bg-text-light-green": "bg-gray-400"}`}
                        ></div>
                        <span className="text-sm capitalize">{student.firstName} {student.lastName[0]}.</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {student.progress ?
                          <span className="text-text-light-green">{t("teacherPages.assignment.assignmentStatus.completed")}</span> :
                          <span className="text-text-main-blue">{t("teacherPages.assignment.assignmentStatus.inProgress")}</span>
                        }
                      </span>

                    </div>
                    <div className="px-[10px] pt-[10px] text-[14px]">
                      {t("teacherPages.assignment.studentFeedback")}: <span className="text-gray-500">{student.feedback.length > 0 ? student.feedback : t("teacherPages.assignment.noStudentFeedbackText")}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {isShownConversation && (
        <AssignmentSummaryConversation
          userName={user?.firstName ?? ""}
          assignmentSummary={assignmentData?.summary ?? ""}
          classRoomProgress={studentsProgress ?? ""}
          onClose={() => setIsShownConversation(false)}
        />
      )}
    </>
  );
};
