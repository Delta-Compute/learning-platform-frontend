import { useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";

import UserContext from "../../context/UserContext";

import { useGetStudentAssignments } from "../../hooks";

import { Loader } from "../../components";
import { IAssignment } from '../../types';

export const StudentAssignmentsPage = () => {
  const { user } = useContext(UserContext);
  const [openAssignment, setOpenAssignment] = useState<IAssignment[]>([]);
  const [closedAssignment, setClosedAssignment] = useState<IAssignment[]>([]);
  
  const [selectedTab, setSelectedTab] = useState("open");
  const { data: assignments, refetch, isRefetching } = useGetStudentAssignments(user?.email ?? "");

  useEffect(() => {
    if (assignments) {
      const open = assignments.filter((assignment) => assignment.deadline > new Date().getTime());
      const closed = assignments.filter((assignment) => assignment.deadline <= new Date().getTime());

      setOpenAssignment(open);
      setClosedAssignment(closed);
    }
  }, [assignments]);

  useEffect(() => {
    refetch();
  }, [refetch, user]);

  return (
    <div>
      {isRefetching && <Loader />}

      <div className="fixed top-0 w-full py-[20px] border-b-[1px] bg-white">
        <h2 className="text-center text-[20px]">Student assignments</h2>
      </div>

      <div className="pt-[100px] pb-[150px] px-[20px]">
        <div className="w-full">
          <div className='flex gap-2'>
            <div className={`flex-1 flex justify-center border-b transition-all pb-2 ${selectedTab === "open" ? 'font-semibold border-[#CC1316] border-b' : 'border-transparent'}`}
            onClick={() => setSelectedTab('open')}
            >
              Open
            </div>
            <div className={`flex-1 flex justify-center border-b transition-all pb-2 ${selectedTab === "closed" ? 'font-semibold border-[#CC1316] border-b' : 'border-transparent'}`}
            onClick={() => setSelectedTab('closed')}
            >
              Closed
            </div>
          </div>
          {selectedTab === 'open' && (
            <ul className="py-[20px] flex flex-col gap-[8px]">
            {openAssignment?.map((assignment) => (
              <Link
                key={assignment.id}
                to={`/student-assignments/${assignment.id}`}
                className="block"
              >
                <li
                  className="w-full block p-[10px] rounded-[14px] bg-gray-200"
                >
                  <p className="font-semibold">Title: <span className="font-light">{assignment.title}</span></p>
                  <p className="font-semibold">Topic: <span className="font-light">{assignment.topic}</span></p>
                </li>
              </Link>
            ))}
          </ul>
          )}
          {selectedTab === 'closed' && (
            <ul className="py-[20px] flex flex-col gap-[8px]">
            {closedAssignment?.map((assignment) => (
              <Link
                key={assignment.id}
                to={`/student-assignments/${assignment.id}`}
                className="block"
              >
                <li
                  className="w-full block p-[10px] rounded-[14px] bg-gray-200"
                >
                  <p className="font-semibold">Title: <span className="font-light">{assignment.title}</span></p>
                  <p className="font-semibold">Topic: <span className="font-light">{assignment.topic}</span></p>
                </li>
              </Link>
            ))}
          </ul>
          )}
        </div>
      </div>
    </div>
  );
};