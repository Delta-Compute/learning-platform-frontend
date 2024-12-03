import { FC } from "react";

import { IAssignment } from "../../../types";

import { format } from "date-fns";

import { useTranslation } from "react-i18next";
import { DropdownMenu } from '../dropdown-menu/DropdownMenu';

import menuIcon from "../../../assets/icons/threeDots.svg";

type Props = {
  assignment: IAssignment;
  onClick: (assignment: IAssignment) => void;
  onDelete: (assignmentId: string, classRoomId: string) => void;
};

const Assignment: FC<Props> = ({ assignment, onClick, onDelete }) => {
  const { t } = useTranslation();

  return (
    <li
      className="border-[0.5px] relative list-none border-[#E9ECEF] text-gray-700  rounded-2xl text-sm p-[15px] bg-white"
    >
      <div className='absolute right-[2px] top-[5px] p-[10px]'>
        <DropdownMenu menuItems={[{ title: "Delete" }]} onClick={() => onDelete(assignment.id, assignment.classRoomId)}>
          <button>
            <img src={menuIcon} alt="menu" className="w-[20px]" />
          </button>
        </DropdownMenu>
      </div>
      <div className="flex items-center justify-between">
        <p onClick={() => onClick(assignment)} className="text-[20px] text-brownText font-semibold leading-6">
          {assignment.title ? `${assignment.title}` : "Assigment"}
        </p>

        {/*<button className="absolute right-[2px] top-[5px] p-[10px]">*/}
        {/*  <img src={menuIcon} alt="menu" className="w-[20px]" />*/}
        {/*</button>*/}
      </div>
      <div className="flex items-center mt-2">
        <h3 className="text-[14px] text-placholderText font-light">
          {t("teacherPages.class.assignmentDeadlineText")}: {format(new Date(assignment.deadline), "dd/MM/yyyy HH:mm")}
        </h3>
      </div>
      <div className="flex items-center justify-between">
        {/* <div className="border-[0.5px] border-[#E9ECEF] text-gray-700 rounded-full text-[16px] px-4  py-2 mt-4">
          15/24 ready
        </div> */}
        <div
          className={`
            ${assignment.deadline >= new Date().getTime() ? "text-text-main-blue border-text-main-blue" : "text-text-light-green border-text-light-green"}
            border-[1px] rounded-full text-[16px] px-4  py-2 mt-4
         `}
        >
          {assignment.deadline >= new Date().getTime() ? t("teacherPages.class.assignmentStatus.inProgress") : t("teacherPages.class.assignmentStatus.completed")}
        </div>
      </div>
    </li>
  );
};

export default Assignment;
