import { useContext } from "react";

import { Link } from "react-router-dom";

import UserContext from "../../context/UserContext";

import { useGetStudentAssignments } from "../../hooks";

import { Loader } from "../../components";

export const StudentAssignmentsPage = () => {
  const { user } = useContext(UserContext);
  const { data: assignments, isPending: isAssignmentsPending } = useGetStudentAssignments(user?.email ?? "");

  return (
    <div>
      {isAssignmentsPending && <Loader />}
      
      <div className="fixed top-0 w-full py-[20px] border-b-[1px] bg-white">
        <h2 className="text-center text-[20px]">Student assignments</h2>
      </div>

      <div className="pt-[100px] pb-[150px] px-[20px]">
        <div className="w-full">
          <ul className="py-[20px] flex flex-col gap-[8px]">
            {assignments?.map((assignment) => (
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
        </div>
      </div>
    </div>
  );
};