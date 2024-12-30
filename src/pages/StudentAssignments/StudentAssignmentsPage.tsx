import React, { useContext, useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { useMutation } from "@tanstack/react-query";
import { ClassRoomApiService } from "../../services";

import UserContext from "../../context/UserContext";
import SchoolNamesContext from "../../context/SchoolNamesContext";

import {
  useGetStudentAssignments,
  useFindStudentInClass,
} from "../../hooks";

import { Loader, Modal, Button, Input, BottomNavigation } from "../../components";
import { IAssignment } from "../../types";

import { toast } from "react-hot-toast";

import CopyIcon from "../../assets/icons/copy-icon.svg";

import { ChevronDown } from "lucide-react";

export const StudentAssignmentsPage = () => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const { currentSchoolName } = useContext(SchoolNamesContext);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [openAssignment, setOpenAssignment] = useState<IAssignment[]>([]);
  const [closedAssignment, setClosedAssignment] = useState<IAssignment[]>([]);
  const [openedAssignmentId, setOpenedAssignmentId] = useState("");
  const [isVerifyClassRoomCodeModalOpen, setIsVerifyClassRoomCodeModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("open");
  const { data: assignments, refetch: refetchAssignments, isRefetching } = useGetStudentAssignments(user?.email as string);

  const {
    data: studentClassRoom,
    isPending: isStudentInClassPending,
    refetch: studentClassRoomRefetch,
  } = useFindStudentInClass(user?.email as string, currentSchoolName);

  const { mutate: verificationCodeMutation, isPending: isVerificationPending } = useMutation({
    mutationFn: (data: { verificationCode: string, email: string }) => ClassRoomApiService.verifyClassRoomCodeAndAddEmail(data.verificationCode, data.email),
    onSuccess: () => {
      toast.success(t("studentPages.studentAssignments.verificationModal.successfullyAddedToastText"));
      setIsVerifyClassRoomCodeModalOpen(false);
      studentClassRoomRefetch();
      refetchAssignments();
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";

      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    refetchAssignments();
  }, [user?.id, refetchAssignments]);

  useEffect(() => {
    if (assignments) {
      const open = assignments.filter((assignment) => assignment.deadline > new Date().getTime()).sort((a, b) => b.deadline - a.deadline);
      const closed = assignments.filter((assignment) => assignment.deadline <= new Date().getTime()).sort((a, b) => b.deadline - a.deadline);

      setOpenAssignment(open);
      setClosedAssignment(closed);
    }
  }, [assignments]);

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

    if (!verificationCode) {
      toast.error(t("studentPages.studentAssignments.verificationModal.emptyCodeToastText"));
      return;
    };

    verificationCodeMutation({ verificationCode, email: user?.email as string });
  };

  return (
    <>
      {(isRefetching || isVerificationPending || isStudentInClassPending) && <Loader />}

      <div className="fixed top-0 w-full py-[20px] bg-white">
        <div className="p-5 fixed z-30 top-0 w-full bg-bg-color border-b-[1px]">
          <p className="text-center text-[24px]">{t("studentPages.studentAssignments.headerTitle")}</p>
        </div>
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
          {selectedTab === "open" && !isRefetching && (
            <ul className="py-[20px] flex flex-col gap-[8px]">
              {studentClassRoom && assignments?.length ? (
                openAssignment.length ? (
                  openAssignment.map((assignment) => (
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
                          <ChevronDown />
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
                  ))
                ) : (
                  <div className="self-center flex-1 flex justify-center mt-5">
                    {t("studentPages.studentAssignments.tabs.noOpenItemsTitle")}
                  </div>
                )
              ) : (
                <Button onClick={() => navigate(`/${currentSchoolName}/free-form-lesson`)} className='text-white bg-[#CC1316]'>
                  {t("studentPages.studentAssignments.tabs.startFreeFormLesson")}
                </Button>
              )}
            </ul>
          )}

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
                      <ChevronDown />
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

      <div className="fixed bottom-[84px] right-6 flex items-center">
        {!isStudentInClassPending && (
          <>
            {studentClassRoom === "" ? (
              <button
                onClick={() => setIsVerifyClassRoomCodeModalOpen(true)}
                className="flex items-center rounded-full border-[1px] gap-2 px-4 py-2 bg-white"
              >
                <img src={`${CopyIcon}`} alt="Class room code image" />
                <span>{t("studentPages.studentAssignments.joinToClassButton")}</span>
              </button>
            ) : (
              <div className="py-2 px-4 border-[1px] rounded-full flex items-center gap-2 bg-white">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>{t("studentPages.studentAssignments.inClassText")}: "{studentClassRoom?.name.toUpperCase()}"</span>
              </div>
            )}
          </>
        )}

        <BottomNavigation />
      </div>

      <Modal
        isOpen={isVerifyClassRoomCodeModalOpen}
        onClose={() => setIsVerifyClassRoomCodeModalOpen(false)}
        title={t("studentPages.studentAssignments.verificationModal.title")}
      >
        <div>
          <form onSubmit={submitVerificationHandler} className="mt-2 flex flex-col gap-2">
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

      <Modal title={t("teacherPages.classes.classModal.titleCreateFeedback")} isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)}>
        <div className="flex flex-col gap-4">
          <p className="text-center">{t("teacherPages.classes.classModal.createFeedbackQuestion")}</p>
          <div className='flex gap-2'>
            <Button className="bg-white w-[50%]" onClick={() => setIsFeedbackModalOpen(false)}>{t("teacherPages.classes.classModal.laterButton")}</Button>
            <Button className="bg-[#CC1316] text-white w-[50%]" onClick={() => navigate(`/${currentSchoolName}/feedback`)}>{t("teacherPages.classes.classModal.giveFeedbackButton")}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};