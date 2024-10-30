import { useParams } from "react-router-dom";
import Header from "../../components/ui/header/Header";
import { assignmentsData, classesData, TAssignment } from "../../utils/mock";
import { useState } from 'react';

export const AssignmentDetailPage = () => {
  const { classId, id } = useParams();
  const classItem = classesData.find((item) => item.name === classId);
  const assignment = assignmentsData.find(
    (item) => item.id === id
  ) as TAssignment;

  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [isProgressOpen, setIsProgressOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen py-6 px-2 bg-[#FBF9F9]">
      <Header
        title={assignment?.title ?? ""}
        linkTo={`/classes/${classItem?.id}`}
      />
      <div className="min-h-screen bg-[#FBF9F9] p-4">
        <div className="flex items-center mb-4">
          <button className="text-gray-500 mr-2">{'<'}</button>
          <h1 className="text-lg font-bold flex-1 text-center">HM Assignment</h1>
          <button className="text-gray-500">{'⋮'}</button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold">English Speaking Practice</h2>
          <p className="text-sm text-gray-500">Topic: "My Daily Routine"</p>
          <p className="text-sm text-gray-500 mt-2">Deadline: 15/08/2024</p>

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
              Out of 24 students, 15 completed the task. Overall, students are
              making progress with spoken English, but performance varied. A few
              students displayed strong fluency and well-organized responses,
              while many need to work on pronunciation and consistent grammar,
              especially with the present simple tense. Common issues included
              using incorrect verb forms (e.g., "I go" vs. "I goes"), sentence
              structure, and hesitation while speaking. Practicing full sentences
              and reviewing present simple rules would be beneficial for the
              group.
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
