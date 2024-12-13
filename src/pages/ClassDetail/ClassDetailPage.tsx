import React, { useContext, useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { useNavigate, useParams } from "react-router-dom";

import { Class } from '../../types/class';

import { useClassById } from '../../hooks/api/classes';

import {
  Loader,
  Modal,
  Input,
  Button,
  ClassSettingsModal,
  ReportModal,
} from "../../components";
import { useDeleteAssignment, useGetRoomsAssignments } from "../../hooks";
import { IAssignment } from "../../types";

import Header from "../../components/ui/header/Header";
import Assignment from "../../components/ui/assignment/Assisgnment";

import { useMutation } from "@tanstack/react-query";
import { ClassRoomApiService } from "../../services";

import SchoolNamesContext from "../../context/SchoolNamesContext";

// import * as pdfjsLib from "pdfjs-dist";
import pdfToText from "react-pdftotext";

import { useClickOutside } from '../../hooks/actions/useClickOutside';

import mammoth from "mammoth";

import { toast } from "react-hot-toast";

import settingsIcon from "../../assets/icons/settings-icon.svg";
import copyIcon from "../../assets/icons/copy-icon.svg";
import filterIcon from "../../assets/icons/filter-icon.svg";
import UploadPlanIcon from "../../assets/icons/upload-plan-icon.svg";
import reportIcon from "../../assets/icons/reportIcon.svg";
import AddClassIcon from "../../assets/icons/add-class-icon.svg";
import tick from "../../assets/icons/tick-svg.svg";

export const ClassDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentSchoolName } = useContext(SchoolNamesContext);

  const [classSettingsOpen, setClassSettingsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [classItem, setClassItem] = useState<Class | null>(null);
  const [filter, setFilter] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUploadPlanModalOpen, setIsUploadPlanModal] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");

  const {
    data: classRoom,
    isPending: isClassRoomPending,
    refetch: refetchClassRoom,
    isRefetching: isClassRoomRefetching,
  } = useClassById(id as string);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsFilterOpen(false));

  const filterOptions = [
    {
      id: 1,
      name: t("teacherPages.class.filterOptions.freshest"),
      value: "newest",
    },
    {
      id: 2,
      name: t("teacherPages.class.filterOptions.oldest"),
      value: "oldest",
    },
    {
      id: 3,
      name: t("teacherPages.class.filterOptions.alphabetically"),
      value: "alphabetical",
    }
  ]

  const {
    data: assignmentsData,
    isPending: isAssigmentsPending,
    refetch: assignmentsRefetch,
    isRefetching: isAssignmentsRefetching,
  } = useGetRoomsAssignments(id as string);  

  const { mutate, isPending: isAssignmentDeleting } = useDeleteAssignment();

  const handleDelete = async (assignmentId: string, classRoomId: string) => {
    mutate({ assignmentId, classRoomId });
    assignmentsRefetch();
  };

  const [filteredAssignments, setFilteredAssignments] = useState<IAssignment[]>(assignmentsData ?? []);

  const onAssignmentClick = (assignment: IAssignment) => {
    navigate(`/${currentSchoolName}/classes/${id}/${assignment.id}`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    assignmentsRefetch();
    setFilteredAssignments(assignmentsData ?? []);
  }, [id, assignmentsRefetch, assignmentsData]);

  const { mutate: updateClassRoomMutation, isPending: isUpdateClassRoomPending } = useMutation({
    mutationFn: (data: FormData) => {
      return ClassRoomApiService.updateClassRoom(id as string, data);
    },
    onSuccess: () => {
      setIsUploadPlanModal(false);
      setIsAddStudentModalOpen(false);
      setStudentEmail("");
      toast.success(t("teacherPages.class.uploadPlanModal.successfullyUploadedText"));
      refetchClassRoom();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const pdfUploadHandler = async (file: File) => {
    if (!file) {
      console.error("No file selected");
      return "";
    }

    try {
      const data = await pdfToText(file);

      return data;
    } catch (error) {
      console.log(error);
    }

    return "";
  };

  const docxUploadHandler = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    return result.value;
  };

  const uploadLearningPlanHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    let learningPlan = "";

    if (file.type === "application/pdf") {
      learningPlan = await pdfUploadHandler(file);
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword"
    ) {
      learningPlan = await docxUploadHandler(file);
    } else {
      console.error("Unsupported file type");
      return;
    }

    const formData = new FormData();

    formData.append("learningPlan", learningPlan);

    updateClassRoomMutation(formData as FormData);
  };

  const submitStudentEmail = (event: React.FormEvent) => {
    event.preventDefault();

    if (studentEmail === "") {
      toast.error("Email should not be empty");
      return;
    }

    let studentEmails: string[] = [];

    if (classItem?.studentEmails) {
      studentEmails = [...classItem.studentEmails];
    }

    studentEmails.push(studentEmail);

    const formData = new FormData();

    studentEmails.forEach((email) => {
      formData.append("studentEmails[]", email);
    });

    updateClassRoomMutation(formData as FormData);
  };

  useEffect(() => {
    if (classRoom) {
      setClassItem(classRoom);
    }
    if (assignmentsData) {
      setFilteredAssignments(assignmentsData);
    }
  }, [classRoom, assignmentsData, isAssigmentsPending, isAssignmentsRefetching]);

  useEffect(() => {
    if (id) {
      assignmentsRefetch();
    }
  }, [id, assignmentsRefetch]);

  const toggleDropdown = () => setIsFilterOpen(!isFilterOpen);

  const handleFilter = (type: string) => {
    let filteredAssignments = assignmentsData ? [...assignmentsData] : [];
    setFilter(type);
    if (filter === "newest") {
      filteredAssignments = filteredAssignments.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    } else if (filter === "oldest") {
      filteredAssignments = filteredAssignments.sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
    } else if (filter === "alphabetical") {
      filteredAssignments = filteredAssignments.sort((a, b) => a.title.localeCompare(b.title));
    }

    setIsFilterOpen(false);
    setFilteredAssignments(filteredAssignments);
  };

  const changeImageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target?.files?.[0];

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    updateClassRoomMutation(formData as FormData);
  };

  const copyClassRoomCodeHandler = async () => {
    try {
      await navigator.clipboard.writeText(classRoom?.verificationCode as string);

      toast.success(t("teacherPages.class.copiedCodeText"));
    } catch (error) {
      console.error("error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-color pb-10">
      {(
        isClassRoomPending
        || isAssigmentsPending
        || isAssignmentsRefetching
        || isClassRoomRefetching
        || isUpdateClassRoomPending
        || isAssignmentDeleting
      ) && <Loader />}
      <Header title={classItem?.name as string} linkTo={`/${currentSchoolName}/classes`} />
      <div className="px-4 mt-20 relative">
        <div
          className={`bg-white p-4 rounded-[16px] shadow flex flex-col space-y-2`}
        >
          <div className="bg-gray-200 h-[140px] rounded-[8px] relative overflow-hidden z-10">
            <div className="w-[40px] right-[10px] bottom-[10px]">
              <input
                type="file"
                accept="image/*"
                onChange={changeImageHandler}
                className="absolute left-0 top-0 z-30 opacity-0 w-full h-full"
              />
            </div>

            <img src={`${AddClassIcon}`} className="absolute block right-[10px] bottom-[10px] z-20" />

            {classRoom?.logo !== "" && (
              <img
                src={classRoom?.logo}
                alt="logo"
                className="absolute left-0 top-0 w-full h-full z-10 object-cover"
              />
            )}
          </div>
          <div className="w-full flex flex-wrap gap-[8px]">
            <div
              className="flex items-center justify-center gap-[8px] border w-[calc(50%-4px)] px-[10px] py-[7px] rounded-2xl"
              onClick={() => setIsUploadPlanModal(true)}
            >
              <p className="text-[14px] font-light w-fit text-[#3ABF38]">
                {t("teacherPages.class.uploadPlanText")}
              </p>
              <button>
                <img src={`${UploadPlanIcon}`} className='w-[17px] h-[16px]' alt="Upload Plan" />
              </button>
            </div>

            <div
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center justify-center gap-[8px] border w-[calc(50%-4px)] px-[10px] py-[7px] rounded-2xl"
            >
              <p className="text-[14px] text-gray-500 font-light w-fit">
                {t("teacherPages.class.reportText")}
              </p>
              <button>
                <img src={`${reportIcon}`} alt="Upload Plan" className="w-[17px] h-[16px]" />
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-700 border-[0.5px] border-[#E9ECEF] py-1 px-3 rounded-full text-sm">
              {classItem?.studentEmails?.length} {t("teacherPages.class.studentsText")}
            </span>
            <span className="border-[0.5px] border-[#E9ECEF] text-gray-700 py-1 px-3 rounded-full text-sm">
              {classItem?.assignmentIds?.length} {t("teacherPages.class.assignmentsText")}
            </span>
            <span
              className="border-[0.5px] border-[#E9ECEF] text-gray-700 py-1 px-1 rounded-full text-sm"
              onClick={() => setClassSettingsOpen(true)}
            >
              <img src={settingsIcon} alt="settings" />
            </span>
          </div>
        </div>
        <div
          className="bg-white p-4 rounded-[16px] shadow flex flex-col space-y-2  mt-2"
        >
          <h2 className="text-[16px] text-placholderText font-light">
            {t("teacherPages.class.classCodeText")}
          </h2>
          <div className="flex flex-col gap-[15px]">
            <div className="flex items-center justify-between">
              <button
                onClick={copyClassRoomCodeHandler}
                className="flex items-center"
              >
                <img src={copyIcon} alt="copy" />
                <span className="text-[24px] w-[130px] font-light truncate">
                  {classRoom?.verificationCode}
                </span>
              </button>
            </div>

            <Button
              className="py-[8px] text-text-main-blue"
              onClick={() => setIsAddStudentModalOpen(true)}
            >
              {t("teacherPages.class.addStudentButton")}
            </Button>
          </div>
        </div>

        <div className="flex flex-row mt-6">
          <h2 className="text-[18px] text-text-color font-normal">
            {t("teacherPages.class.assignmentsTitleText")}
          </h2>

          {assignmentsData && assignmentsData?.length > 0 && !isAssigmentsPending &&
            <div className="flex flex-row ml-auto items-center relative">
              <span className="text-[16px] text-brownText font-light">
                {t("teacherPages.class.filterText")}
              </span>
              <img src={filterIcon} alt="filter" onClick={toggleDropdown} ref={dropdownRef} />
              {isFilterOpen && (
                <div className="absolute z-10 right-0 top-[20px] mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="p-2" ref={dropdownRef}>
                    {filterOptions.map((option) => (
                      <div className='w-full flex content-center justify-between'>
                        <button
                          key={option.id}
                          onClick={() => handleFilter(option.value)}
                          className="block text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {option.name}
                        </button>
                        {filter === option.value && <img src={tick} alt="tick" className="w-4 h-4 self-center" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          }
        </div>

        <ul className="flex flex-col gap-2 pt-3">
          {!isAssignmentsRefetching && filteredAssignments?.map((assignment, index) => (
            <Assignment
              key={index}
              assignment={assignment}
              onClick={onAssignmentClick}
              onDelete={() => handleDelete(assignment.id, assignment.classRoomId)}
            />
          ))}
        </ul>

        {!isAssignmentsRefetching && !isAssigmentsPending && assignmentsData?.length === 0 && <p className="text-gray-500 text-center mt-[60px]">{t("teacherPages.class.noAssignmentsText")}</p>}
      </div>

      <Modal
        isOpen={isUploadPlanModalOpen}
        onClose={() => setIsUploadPlanModal(false)}
        title={t("teacherPages.class.uploadPlanModal.title")}
      >
        <div className="flex flex-col items-center">
          <div className="relative mt-[16px]">
            <Input
              type="file"
              className="w-full pr-[60px]"
              accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
              onChange={uploadLearningPlanHandler}
            />

            <img src={`${UploadPlanIcon}`} className="w-[20px] absolute top-4 right-4" />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
      >
        <div>
          <p className="font-semibold text-[20px] text-center">{t("teacherPages.class.addStudentModal.title")}</p>

          <form onSubmit={submitStudentEmail} className="flex flex-col mt-[10px]">
            <Input
              type="email"
              value={studentEmail}
              onChange={(event) => setStudentEmail(event.target.value)}
              placeholder={t("teacherPages.class.addStudentModal.studentEmailInputPlaceholder")}
            />
            <Button
              className="bg-main text-white w-full border-main mt-[10px] disabled:opacity-40 sm:w-[120px]"
              disabled={isUpdateClassRoomPending}
            >
              {!isUpdateClassRoomPending ? t("teacherPages.class.addStudentModal.addStudentButton") : t("teacherPages.class.addStudentModal.loading")}
            </Button>
          </form>
        </div>
      </Modal>
      {classSettingsOpen && <ClassSettingsModal isOpen={classSettingsOpen} onClose={() => setClassSettingsOpen(false)} onRefreshClasses={refetchClassRoom} classItem={classItem!} />}
      {isReportModalOpen && <ReportModal onClose={() => setIsReportModalOpen(false)} classItem={classItem!} />}
    </div>
  );
};
