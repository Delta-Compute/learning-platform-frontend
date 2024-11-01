import { useContext, useEffect } from "react";

import { Link } from "react-router-dom";

import UserContext from "../../context/UserContext";

import { useGetStudentAssignments } from "../../hooks";

import MicrophoneIcon from "../../assets/icons/microphone-light.svg";

export const StudentAssignmentsPage = () => {
  const { user } = useContext(UserContext);
  const { data: assignments, refetch, isPending } = useGetStudentAssignments(user?.email ?? "");

  useEffect(() => {
    if (user?.email) {
      refetch();
    }
  }, [user]);

  return (
    <div>
      <div className="fixed top-0 w-full py-[20px] border-b-[1px] bg-white">
        <h2 className="text-center text-[20px]">Student assignments</h2>
      </div>

      <div className="pt-[100px] pb-[150px]">
        <div>
          {!isPending ? (
            <ul className="py-[20px] flex flex-col items-center gap-[8px]">
              {assignments?.map((assignment) => (
                <Link 
                  key={assignment.id} 
                  to={`/student-assignments/${assignment.id}`}
                  className="block w-full"
                >
                  <li
                    className="w-[400px] p-[8px] rounded-[20px] text-center bg-gray-200"
                  >
                    <span>{assignment.description}</span>
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <div className="py-[30px]">
              <p className="text-center text-gray-500">{isPending ? "Loading..." : "No tasks yet"}</p>
            </div>
          )}
        </div>
        <div
          className="
            flex justify-center items-center flex-col fixed bottom-0
            w-full pb-[12px] bg-white
          "
        >
          <p className="text-[15px] font-semibold">Let's create a new task</p>
          <Link
            to="/ai-conversation"
            className="border-[1px] p-[10px] rounded-[50%] mt-[20px]"
          >
            <img src={`${MicrophoneIcon}`} alt="microphone" />
          </Link>
        </div>
      </div>
    </div>
  );
};