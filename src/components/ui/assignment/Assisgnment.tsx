import { FC } from "react";

import { IAssignment } from "../../../types";

import { format } from "date-fns";

import { useTranslation } from "react-i18next";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import menuIcon from "../../../assets/icons/threeDots.svg";

type Props = {
  assignment: IAssignment;
  onClick: (assignment: IAssignment) => void;
  onDelete: (assignmentId: string, classRoomId: string) => void;
};

const Assignment: FC<Props> = ({ assignment, onClick, onDelete }) => {
  const {t} = useTranslation();

  const ASSIGNMENT_OPTION_ITEMS = [
    {
      title: "Delete",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M3 6h18"/>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          <line x1="10" x2="10" y1="11" y2="17"/>
          <line x1="14" x2="14" y1="11" y2="17"/>
        </svg>
      ),
      onSelect: () => onDelete(assignment.id, assignment.classRoomId),
    }
  ];

  return (
    <li
      className="border-[0.5px] relative list-none border-[#E9ECEF] text-gray-700  rounded-2xl text-sm p-[15px] bg-white"
    >
      <div className="absolute right-[4px] top-[5px]">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white p-2 text-sm font-semibold text-gray-900"
            >
              <img src={menuIcon} />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-[130px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="p-2 flex flex-col gap-1">
                {ASSIGNMENT_OPTION_ITEMS.map(item => (
                  <MenuItem
                    key={item.title}
                  >
                    <div className="flex items-center gap-2 p-1" onClick={() => item.onSelect()}>
                      <div className="text-red-500">{item.icon}</div>
                      <div className="cursor-pointer text-red-600">{item.title}</div>
                    </div>
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </div>
        </Menu>
      </div>
      <div className="flex items-center justify-between pr-4">
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
