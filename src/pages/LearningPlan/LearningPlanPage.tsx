import { Link, useParams } from "react-router-dom";

import MicrophoneIcon from "../../assets/icons/microphone-light.svg";

export const LearningPlanPage = () => {
  const params = useParams();

  return (
    <div>
      <div className="fixed top-0 w-full py-[20px] border-b-[1px]">
        <h2 className="text-center text-[20px]">Teacher tasks</h2>
      </div>

      <div className="pt-[100px] ">
        <div>
          <p className="font-semibold text-center">
            Task based on learning plan
          </p>

          {/* 
            <ul className="py-[20px] flex flex-col items-center gap-[8px]">
              {generatedAssignments.map((task) => (
                <li
                  key={task.id}
                  className="w-[400px] py-[8px] rounded-[20px] text-center bg-gray-200"
                >
                  {task.title}
                </li>
              ))}
            </ul>
           */}
        </div>
        <div
          className="
            flex justify-center items-center flex-col fixed bottom-0
            w-full pb-[12px] bg-white
          "
        >
          <p className="text-[15px] font-semibold">Let's create a new task</p>
          <Link
            to={`/teacher-tasks/${params.classRoomId}`}
            className="border-[1px] p-[10px] rounded-[50%] mt-[20px]"
          >
            <img src={`${MicrophoneIcon}`} alt="microphone" />
          </Link>
        </div>
      </div>
    </div>
  );
};
