import { useContext } from "react";

import { Link } from "react-router-dom";

import TeacherConversations from "../../context/teacher-conversations";

// import { useGetUser } from "../../hooks";
// import { updateUser } from "../../services";
// import { useMutation } from "@tanstack/react-query";

import MicrophoneIcon from "../../assets/icons/microphone-light.svg";

export const LearningPlanPage = () => {
  const { teacherConversations } = useContext(TeacherConversations);

  // get user data
  // const { data: user } = useGetUser("XSY9IOoOlaL6JlLQJxZj");

  // mutation to update user
  // const { mutate: userMutation, isPending } = useMutation({
  //   mutationFn: (user: { firstName: string }) => updateUser("XSY9IOoOlaL6JlLQJxZj", user.firstName),
  //   onSuccess: () => {
  //     console.log("success");
  //   },
  // });

  // mutation using
  // const changeUser = () => { userMutation({ firstName: "some first name" }); }

  return (
    <div>
      <div className="fixed top-0 w-full py-[20px] border-b-[1px]">
        <h2 className="text-center text-[20px]">Teacher tasks</h2>
      </div>

      <div className="pt-[100px] ">
        <div>
          <p className="font-semibold text-center">Task based on learning plan</p>

          {teacherConversations.length > 0 ? (
            <ul className="py-[20px] flex flex-col items-center gap-[8px]">
              {teacherConversations.map((task) => (
                <li
                  key={task.id}
                  className="w-[400px] py-[8px] rounded-[20px] text-center bg-gray-200"
                >
                  {task.title}
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-[30px]">
              <p className="text-center text-gray-500">No tasks yet</p>
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
          <Link to="/ai-conversation" className="border-[1px] p-[10px] rounded-[50%] mt-[20px]">
            <img src={`${MicrophoneIcon}`} alt="microphone"/>
          </Link>
        </div>
      </div>
    </div>
  );
};