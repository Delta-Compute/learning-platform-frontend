import { useParams } from "react-router-dom";
import Header from "../../components/ui/header/Header";
import { useEffect, useState } from 'react';
import { useGetRoomsAssignments, use, useUpdateAssignment } from '../../hooks';
import { Loader } from '../../components';
import { IAssignment } from '../../types';
import { useGetClassRoomProgress } from '../../hooks/api/class-room-progres';

import { format } from "date-fns";
import { useGetClassRoomProgressSummary } from '../../hooks/api/class-room-progress.summary';
import { instructionsForSummary } from '../../utils';
import { openai } from '../../vars/open-ai';

export const AssignmentDetailPage = () => {
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [isProgressOpen, setIsProgressOpen] = useState(true);
  const [assignmentData, setAssignmentData] = useState<IAssignment | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const { classRoomId, assignmentId } = useParams();
  const { mutate, isPending: isUpdateAssignmentPending } = useUpdateAssignment(assignmentId as string, summary as string);
  const { data, isPending, isRefetching: isAssignmentRefetching, refetch: refetchAssignment } = useGetRoomsAssignments(classRoomId as string);
  const { data: classRoomProgress, isPending: classRoomProgressPending, refetch, isRefetching } = useGetClassRoomProgress(classRoomId as string, assignmentId as string);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const { data: summaryData, isPending: summaryPending } = useGetClassRoomProgressSummary(classRoomId as string, assignmentId as string);

  useEffect(() => {
    refetch();
  }, [assignmentId, refetch]);

  useEffect(() => {
    const assignment = data?.find((item) => item.id === assignmentId);
    if (assignment) {
      setAssignmentData(assignment);
    }
  }, [data, isPending, assignmentId]);

  useEffect(() => {
    if (summaryData && !summaryPending) {
      getSummaryFromAI();
    }
  }, [summaryData, summaryPending]);


  const studentsDone = classRoomProgress?.studentsProgress.filter(student => student.progress).length;
  const allStudents = classRoomProgress?.studentsProgress.length;

  const getSummaryFromAI = async () => {
    setIsLoadingSummary(true);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that selects key topics for students.",
          },
          {
            role: "user",
            content: `${instructionsForSummary(summaryData || '')}`,
          },
        ],
        max_tokens: 150,
      });

      setSummary(response.choices[0].message.content);
      if (summary !== assignmentData?.summary) {
        mutate({
          assignmentId: assignmentId as string,
          summary: response.choices[0].message.content as string,
        }, {
          onSuccess: () => {
            refetchAssignment();
          },
        });
      }
    }

    catch (error) {
      console.log(error);
    }

    finally {
      setIsLoadingSummary(false);
    }
  }

  return (
    <div className="flex flex-col h-screen py-6 px-2 bg-[#FBF9F9]">
      <Header
        title={assignmentData?.title ?? "Assignment"}
        linkTo={`/classes/${classRoomId}`}
      />
      {(isPending || classRoomProgressPending || isRefetching || summaryPending || isLoadingSummary || isAssignmentRefetching || isUpdateAssignmentPending) && <Loader />}
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
                    Feedback: <span className="text-gray-500">{student.feedback}</span>
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
