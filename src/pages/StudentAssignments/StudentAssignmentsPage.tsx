import { useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

import UserContext from "../../context/UserContext";

import { useGetStudentAssignments } from "../../hooks";

import { Loader } from "../../components";
import { IAssignment } from '../../types';

export const StudentAssignmentsPage = () => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
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
      setOpenedAssignmentId('');
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
            <div className={`flex-1 flex justify-center border-b transition-all pb-2 ${selectedTab === "open" ? 'font-semibold border-[#CC1316] border-b' : 'border-transparent'}`}
              onClick={() => setSelectedTab('open')}
            >
              {t("studentPages.studentAssignments.tabs.openAssignments")}
            </div>
            <div className={`flex-1 flex justify-center border-b transition-all pb-2 ${selectedTab === "closed" ? 'font-semibold border-[#CC1316] border-b' : 'border-transparent'}`}
              onClick={() => setSelectedTab('closed')}
            >
              {t("studentPages.studentAssignments.tabs.closedAssignments")}
            </div>
          </div>
          {selectedTab === 'open' && !isRefetching &&
            <ul className="py-[20px] flex flex-col gap-[8px]">
              {openAssignment.length ? openAssignment?.map((assignment) => (
                <Link
                  key={assignment.id}
                  to={`/student-assignments/${assignment.id}`}
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
          {selectedTab === 'closed' && !isRefetching &&
            <ul className="py-[20px] flex flex-col gap-[8px]">
              {closedAssignment.length ? closedAssignment?.map((assignment) => (
                <Link
                key={assignment.id}
                to={`/student-assignments/${assignment.id}`}
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
    </div>
  );
};