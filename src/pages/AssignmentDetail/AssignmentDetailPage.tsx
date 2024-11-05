import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { Loader } from "../../components";
import Header from "../../components/ui/header/Header";

import { useGetRoomsAssignments } from '../../hooks';

import { useGetClassRoomProgress } from '../../hooks/api/class-room-progress.ts';

import { IAssignment } from "../../types";

import { format } from "date-fns";

export const AssignmentDetailPage = () => {
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [isProgressOpen, setIsProgressOpen] = useState(true);
  const [assignmentData, setAssignmentData] = useState<IAssignment | null>(null);

  const { classRoomId, assignmentId } = useParams();
  const { data, isPending, isRefetching: isAssignmentRefetching } = useGetRoomsAssignments(classRoomId as string);
  const { data: classRoomProgress, isPending: classRoomProgressPending, refetch, isRefetching } = useGetClassRoomProgress(classRoomId as string, assignmentId as string);

  useEffect(() => {
    refetch();
  }, [assignmentId, refetch]);

  useEffect(() => {
    console.log();
  }, []);

  useEffect(() => {
    const assignment = data?.find((item: any) => item.id === assignmentId);

    if (assignment) {
      setAssignmentData(assignment);
    }
  }, [data, isPending, assignmentId]);

  const studentsDone = classRoomProgress?.studentsProgress.filter(student => student.progress).length;
  const allStudents = classRoomProgress?.studentsProgress.length;

  return (
    <div className="flex flex-col h-screen py-6 px-2 bg-[#FBF9F9]">
      <Header
        title={assignmentData?.title ?? "Assignment"}
        linkTo={`/classes/${classRoomId}`}
      />

      {(isPending || classRoomProgressPending || isRefetching || isAssignmentRefetching) && <Loader />}

      <div className="min-h-screen bg-[#FBF9F9] p-4 mt-20">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold">{assignmentData?.title}</h2>
          <p className="text-sm text-gray-500">Topic: {assignmentData?.topic}</p>
          <p className="text-sm text-gray-500 mt-2">{assignmentData && format(new Date(assignmentData.deadline), "dd/MM/yyyy HH:mm")}</p>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm font-medium">{studentsDone}/{allStudents} ready</div>
            {assignmentData && (
              <div
                className={`
                  px-3 py-1 
                  ${assignmentData.deadline >= new Date().getTime() ? "bg-blue-100 text-blue-700" : "bg-green-200 text-green-800"} 
                  text-sm rounded-full
                `}
              >
                {assignmentData.deadline >= new Date().getTime() ? "In Progress" : "Completed"}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsSummaryOpen(!isSummaryOpen)}
          >
            <h2 className="text-lg font-semibold mb-2">Class Summary</h2>
            <button className={`text-gray-500 transform transition-transform duration-300 ${isSummaryOpen ? 'rotate-180' : ''}`}>
              {"▲"}
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
            <h2 className="text-lg font-semibold mb-2">Class Progress</h2>
            <button className={`text-gray-500 transform transition-transform duration-300 ${isProgressOpen ? 'rotate-180' : ''}`}>
              {"▲"}
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
                        className={`w-3 h-3 rounded-full mr-2 ${student.progress ? 'bg-green-500' : 'bg-gray-400'}`}
                      ></div>
                      <span className="text-sm capitalize">{student.firstName} {student.lastName[0]}.</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {student.progress ? <span className="text-green-500">Completed</span> : <span className="text-blue-400">In progress</span>}
                    </span>
                  </div>
                  <div className="px-[10px] pt-[10px] text-[14px]">
                    Feedback: <span className="text-gray-500">{student.feedback.length > 0 ? student.feedback : "No feedback"}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
