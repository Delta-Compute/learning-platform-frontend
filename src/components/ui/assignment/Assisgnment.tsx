import { FC } from "react";
import { TAssignment } from "../../../utils/mock";
import menuIcon from "../../../assets/icons/menu-icon.svg";

type Props = {
  assignment: TAssignment;
  onClick: (assignment: TAssignment) => void;
};

const Assignment: FC<Props> = ({ assignment, onClick }) => {
  return (
    <div
      className="border-[0.5px] border-[#E9ECEF] text-gray-700  rounded-2xl text-sm px-2  py-2 mt-4 bg-white"
      onClick={() => onClick(assignment)}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] text-brownText font-semibold mt-2">
          {assignment.title ? `${assignment.title}` : "Assigment"}
        </h2>
        <img src={menuIcon} alt="menu" />
      </div>
      <div className="flex items-center mt-2">
        <h3 className="text-[14px] text-placholderText font-light">
          Deadline: {assignment.deadline? `${assignment.deadline}`: "No deadline"}
        </h3>
        <h3 className="text-[14px] text-[rgba(25, 28, 30, 1)] font-light ml-2">
          {assignment.deadline}
        </h3>
      </div>
      <div className="flex items-center justify-between">
        <div className="border-[0.5px] border-[#E9ECEF] text-gray-700 rounded-full text-[16px] px-4  py-2 mt-4">
          15/24 ready
        </div>
        <div className="border-[0.5px] border-[#E9ECEF] text-gray-700 rounded-full text-[16px] px-4  py-2 mt-4">
          {assignment.status ? `${assignment.status}` : "No status"}
        </div>
      </div>
    </div>
  );
};

export default Assignment;
