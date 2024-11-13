import React, { useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

import UserContext from "../../context/UserContext";
import SchoolNamesContext from "../../context/SchoolNamesContext";

import { useGetStudentAssignments } from "../../hooks";

import { Loader } from "../../components";
import { IAssignment } from '../../types';

export const StudentAssignmentsPage = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(UserContext);
  const { currentSchoolName } = useContext(SchoolNamesContext);
  const [openAssignment, setOpenAssignment] = useState<IAssignment[]>([]);
  const [closedAssignment, setClosedAssignment] = useState<IAssignment[]>([]);
  const [openedAssignmentId, setOpenedAssignmentId] = useState('');

  const [selectedTab, setSelectedTab] = useState("open");
  const { data: assignments, refetch, isRefetching } = useGetStudentAssignments(user?.email ?? "");

  useEffect(() => {
    if (assignments) {
      const open = assignments.filter((assignment) => assignment.deadline > new Date().getTime()).sort((a, b) => b.deadline - a.deadline);
      const closed = assignments.filter((assignment) => assignment.deadline <= new Date().getTime()).sort((a, b) => b.deadline - a.deadline);

      setOpenAssignment(open);
      setClosedAssignment(closed);
    }
  }, [assignments]);

  useEffect(() => {
    refetch();
  }, [refetch, user]);

  const handleAsignmentClick = (id: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    if (openedAssignmentId === id) {
      setOpenedAssignmentId("");
    } else {
      setOpenedAssignmentId(id);
    }
  };

  return (
    <div>
      {isRefetching && <Loader />}

      <div className="fixed top-0 w-full py-[20px] border-b-[1px] bg-white">
        <h2 className="text-center text-[20px]">{t("studentPages.studentAssignments.headerTitle")}</h2>
      </div>

      <div className="pt-[100px] pb-[150px] px-[20px]">
        <div className="w-full">
          <div className='flex gap-2'>
            <div className={`flex-1 flex justify-center border-b transition-all pb-2 ${selectedTab === "open" ? 'font-semibold border-main border-b' : 'border-transparent'}`}
              onClick={() => setSelectedTab('open')}
            >
              {t("studentPages.studentAssignments.tabs.openAssignments")}
            </div>
            <div className={`flex-1 flex justify-center border-b transition-all pb-2 ${selectedTab === "closed" ? 'font-semibold border-main border-b' : 'border-transparent'}`}
              onClick={() => setSelectedTab('closed')}
            >
              {t("studentPages.studentAssignments.tabs.closedAssignments")}
            </div>
          </div>
          {selectedTab === "open" && !isRefetching &&
            <ul className="py-[20px] flex flex-col gap-[8px]">
              {openAssignment.length ? openAssignment?.map((assignment) => (
                <Link
                  key={assignment.id}
                  to={`/${currentSchoolName}/student-assignments/${assignment.id}`}
                  className="block"
                >
                  <li className="w-full block p-[10px] rounded-[14px] bg-gray-200 relative">
                    <button
                      className={`text-gray-500 absolute top-2 right-2 transform transition-transform duration-300 ${openedAssignmentId === assignment.id ? "rotate-180" : ""
                        }`}
                      onClick={(e) => {
                        handleAsignmentClick(assignment.id, e);
                      }}
                    >
                      {"▲"}
                    </button>
                    <p className="font-semibold">
                      Title: <span className="font-light">{assignment.title}</span>
                    </p>
                    <p className="font-semibold">
                      Topic: <span className="font-light">{assignment.topic}</span>
                    </p>
                    <div
                      className={`transition-[max-height] overflow-hidden ${openedAssignmentId === assignment.id ? "max-h-[500px]" : "max-h-0"
                        }`}
                    >
                      <p className="font-semibold">
                        Description: <span className="font-light">{assignment.description}</span>
                      </p>
                    </div>
                  </li>
                </Link>
              )) :
                <div className='self-center flex-1 flex justify-center mt-5'>{t("studentPages.studentAssignments.tabs.noOpenItemsTitle")}</div>
              }
            </ul>
          }
          {selectedTab === "closed" && !isRefetching &&
            <ul className="py-[20px] flex flex-col gap-[8px]">
              {closedAssignment.length ? closedAssignment?.map((assignment) => (
                <Link
                  key={assignment.id}
                  to={`/${currentSchoolName}/student-assignments/${assignment.id}`}
                  className="block"
                >
                  <li className="w-full block p-[10px] rounded-[14px] bg-gray-200 relative">
                    <button
                      className={`text-gray-500 absolute top-2 right-2 transform transition-transform duration-300 ${openedAssignmentId === assignment.id ? "rotate-180" : ""
                        }`}
                      onClick={(e) => {
                        handleAsignmentClick(assignment.id, e);
                      }}
                    >
                      {"▲"}
                    </button>
                    <p className="font-semibold">
                      {t("studentPages.studentAssignments.assignment.title")}: <span className="font-light">{assignment.title}</span>
                    </p>
                    <p className="font-semibold">
                      {t("studentPages.studentAssignments.assignment.topic")}: <span className="font-light">{assignment.topic}</span>
                    </p>
                    <div
                      className={`transition-[max-height] overflow-hidden ${openedAssignmentId === assignment.id ? "max-h-[500px]" : "max-h-0"
                        }`}
                    >
                      <p className="font-semibold">
                        {t("studentPages.studentAssignments.assignment.description")}: <span className="font-light">{assignment.description}</span>
                      </p>
                    </div>
                  </li>
                </Link>
              )) :
                <div className='self-center flex-1 flex justify-center mt-5'>{t("studentPages.studentAssignments.tabs.noClosedItemsTitle")}</div>
              }
            </ul>
          }
        </div>
      </div>
      <button
        className="
          fixed bottom-[20px] right-[10px] rounded-full border-[1px] px-[15px] py-[8px]
          flex items-center gap-[8px]
        "
        onClick={logout}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" x2="9" y1="12" y2="12"/>
        </svg>
        <span>{t("studentPages.studentAssignments.logoutButton.text")}</span>
      </button>
    </div>
  );
};