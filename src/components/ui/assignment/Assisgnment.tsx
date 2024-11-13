import { FC } from "react";

import { IAssignment } from "../../../types";

import { format } from "date-fns";

import { useTranslation } from "react-i18next";

import menuIcon from "../../../assets/icons/menu-icon.svg";

type Props = {
  assignment: IAssignment;
  onClick: (assignment: IAssignment) => void;
};

const Assignment: FC<Props> = ({ assignment, onClick }) => {
  const { t } = useTranslation();

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
          {t("teacherPages.class.assignmentDeadlineText")}: {format(new Date(assignment.deadline), "dd/MM/yyyy HH:mm")}
        </h3>
      </div>
      <div className="flex items-center justify-between">
        {/* <div className="border-[0.5px] border-[#E9ECEF] text-gray-700 rounded-full text-[16px] px-4  py-2 mt-4">
          15/24 ready
        </div> */}
        <div className="border-[0.5px] border-[#E9ECEF] text-gray-700 rounded-full text-[16px] px-4  py-2 mt-4">
          {assignment.deadline >= new Date().getTime() ? t("teacherPages.class.assignmentStatus.inProgress") : t("teacherPages.class.assignmentStatus.completed")}
        </div>
      </div>
    </div>
  );
};

export default Assignment;
