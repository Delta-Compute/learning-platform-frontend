import { useParams } from "react-router-dom";
import Header from "../../components/ui/header/Header";
import { TAssignment } from "../../utils/mock";
import { useEffect, useState } from 'react';
import { useGetRoomsAssignments } from '../../hooks';
import { Loader } from '../../components';

export const AssignmentDetailPage = () => {
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [isProgressOpen, setIsProgressOpen] = useState(true);
  const [assignmentData, setAssignmentData] = useState<TAssignment | null>(null);
  const { classId, assignmentId } = useParams();
  const { data, isPending } = useGetRoomsAssignments(classId as string);
  
  useEffect(() => {
    const assignment = data?.find((item) => item.id === assignmentId);
    if (assignment) {
      setAssignmentData(assignment);
    }
  }, [data, isPending, assignmentId]);


  return (
    <div className="flex flex-col h-screen py-6 px-2 bg-[#FBF9F9]">
      <Header
        title={assignmentData?.title ?? "Assignment"}
        linkTo={`/classes/${classId}`}
      />
      {isPending && <Loader />}
      <div className="min-h-screen bg-[#FBF9F9] p-4 mt-20">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold">English Speaking Practice</h2>
          <p className="text-sm text-gray-500">Topic: "My Daily Routine"</p>
          <p className="text-sm text-gray-500 mt-2">{assignmentData?.deadline ? assignmentData?.deadline : "No deadline"}</p>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm font-medium">15/24 ready</div>
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
            <button className="text-gray-500">
              {isSummaryOpen ? "▲" : "▼"}
            </button>
          </div>
          {isSummaryOpen && (
            <p className="text-sm text-gray-700">
              {assignmentData?.description}
            </p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsProgressOpen(!isProgressOpen)}
          >
            <h2 className="text-lg font-semibold mb-2">Class Progress</h2>
            <button className="text-gray-500">
              {isProgressOpen ? "▲" : "▼"}
            </button>
          </div>
          {isProgressOpen && (
            <ul>
              <li className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Alice Brown</span>
                </div>
                <span className="text-sm text-gray-500">Completed</span>
              </li>
              <li className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                  <span className="text-sm">David Lee</span>
                </div>
                <span className="text-sm text-gray-500">Not Completed</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
