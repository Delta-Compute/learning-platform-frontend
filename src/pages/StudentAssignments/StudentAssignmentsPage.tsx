import React, { useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { useMutation } from "@tanstack/react-query";
import { ClassRoomApiService } from "../../services";

import UserContext from "../../context/UserContext";
import SchoolNamesContext from "../../context/SchoolNamesContext";

import { useGetStudentAssignments, useFindStudentInClass } from "../../hooks";

import { Loader, Modal, Button, Input } from "../../components";
import { IAssignment } from "../../types";

import { toast } from "react-hot-toast";

import CopyIcon from "../../assets/icons/copy-icon.svg";

export const StudentAssignmentsPage = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(UserContext);
  const { currentSchoolName } = useContext(SchoolNamesContext);

  const [openAssignment, setOpenAssignment] = useState<IAssignment[]>([]);
  const [closedAssignment, setClosedAssignment] = useState<IAssignment[]>([]);
  const [openedAssignmentId, setOpenedAssignmentId] = useState("");
  const [isVerifyClassRoomCodeModalOpen, setIsVerifyClassRoomCodeModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const [selectedTab, setSelectedTab] = useState("open");
  const { data: assignments, refetch, isRefetching } = useGetStudentAssignments(user?.email as string);

  const {
    data: studentClassRoom,
    isPending: isStudentInClassPending,
    refetch: studentClassRoomRefetch,
  } = useFindStudentInClass(user?.email as string, currentSchoolName);

  const { mutate: verificationCodeMutation, isPending: isVerificationPending } = useMutation({
    mutationFn: (data: { verificationCode: string, email: string, }) => ClassRoomApiService.verifyClassRoomCodeAndAddEmail(data.verificationCode, data.email),
    onSuccess: () => {
      toast.success(t("studentPages.studentAssignments.verificationModal.successfullyAddedToastText"));
      refetch();
      studentClassRoomRefetch();
      setIsVerifyClassRoomCodeModalOpen(false);
    },
    onError: () => {
      toast.error(t("studentPages.studentAssignments.tabs.verificationModal.errorToastText"));
    },
  });

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

  const submitVerificationHandler = (event: React.FormEvent) => {
    event.preventDefault();

    verificationCodeMutation({ verificationCode, email: user?.email as string });
  };

  return (
    <>
      {(isRefetching || isVerificationPending || isStudentInClassPending) && <Loader />}

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

      <div className="fixed bottom-5 right-2 flex items-center gap-2">
        {studentClassRoom === "" ? (
          <button
            onClick={() => setIsVerifyClassRoomCodeModalOpen(true)}
            className="flex items-center rounded-full border-[1px] gap-2 px-4 py-2 bg-white"
          >
            <img src={`${CopyIcon}`} alt="Class room code image" />
            <span>{t("studentPages.studentAssignments.joinToClassButton")}</span>
          </button>
        ) : (
          <div className="py-2 px-4 border-[1px] rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>{t("studentPages.studentAssignments.inClassText")}: "{studentClassRoom?.name.toUpperCase()}"</span>
          </div>
        )}

        <button
          className="
            rounded-full border-[1px] px-4 py-2
            flex items-center gap-2 bg-white
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

      <Modal
        isOpen={isVerifyClassRoomCodeModalOpen}
        onClose={() => setIsVerifyClassRoomCodeModalOpen(false)}
      >
        <div>
          <p className="text-center text-dark-blue font-semibold text-[18px]">{t("studentPages.studentAssignments.verificationModal.title")}</p>
          <form onSubmit={submitVerificationHandler} className="mt-5 flex flex-col gap-2">
            <Input
              className="w-full"
              placeholder={t("studentPages.studentAssignments.verificationModal.verificationCodeInputPlaceholder")}
              value={verificationCode}
              onChange={(event) => setVerificationCode(event.target.value)}
            />
            <Button className="w-full bg-main text-white border-main">
              {t("studentPages.studentAssignments.verificationModal.verifyButton")}
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};