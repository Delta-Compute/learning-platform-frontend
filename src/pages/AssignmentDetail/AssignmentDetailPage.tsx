import { useParams } from "react-router-dom";
import Header from "../../components/ui/header/Header";
import { useEffect, useState } from 'react';
import { useGetRoomsAssignments } from '../../hooks';
import { Loader } from '../../components';
import { IAssignment } from '../../types';
import { useGetClassRoomProgress } from '../../hooks/api/class-room-progres';

export const AssignmentDetailPage = () => {
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [isProgressOpen, setIsProgressOpen] = useState(true);
  const [assignmentData, setAssignmentData] = useState<IAssignment | null>(null);
  const { classId, assignmentId } = useParams();
  const { data, isPending } = useGetRoomsAssignments(classId as string);
  const { data: classRoomProgress, isPending: classRoomProgressPending, refetch, isRefetching } = useGetClassRoomProgress(classId as string, assignmentId as string);

  useEffect(() => {
    refetch();
  }, [assignmentId]);

  useEffect(() => {
    const assignment = data?.find((item) => item.id === assignmentId);
    if (assignment) {
      setAssignmentData(assignment);
    }
  }, [data, isPending, assignmentId]);

  const studentsDone = classRoomProgress?.studentsProgress.filter(student => student.progress).length;
  const allStudents = classRoomProgress?.studentsProgress.length;

  console.log(assignmentData, 'assignmentData');
  

  return (
    <div className="flex flex-col h-screen py-6 px-2 bg-[#FBF9F9]">
      <Header
        title={assignmentData?.title ?? "Assignment"}
        linkTo={`/classes/${classId}`}
      />
      {isPending || classRoomProgressPending || isRefetching && <Loader />}
      <div className="min-h-screen bg-[#FBF9F9] p-4 mt-20">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold">{assignmentData?.title}</h2>
          <p className="text-sm text-gray-500">Topic: {assignmentData?.topic}</p>
          <p className="text-sm text-gray-500 mt-2">{assignmentData?.deadline ? assignmentData?.deadline : "No deadline"}</p>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm font-medium">{studentsDone}/{allStudents} ready</div>
            <div className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
              In Progress
            </div>
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
            className={`transition-all duration-300 ease-in-out overflow-hidden ${isSummaryOpen ? 'max-h-40' : 'max-h-0'
              }`}
          >
            <p className="text-sm text-gray-700">
              {assignmentData?.description}
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
            className={`transition-all duration-300 ease-in-out overflow-hidden ${isProgressOpen ? 'max-h-40' : 'max-h-0'
              }`}
          >
            <ul className="mt-2">
              {classRoomProgress?.studentsProgress.map((student, index) => (
                <li key={index} className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${student.progress ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                    ></div>
                    <span className="text-sm">{student.firstName}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {student.progress ? 'Completed' : 'Not Completed'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
