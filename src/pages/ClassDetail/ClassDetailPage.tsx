import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { Class } from '../../types/class';

import { useClassById } from '../../hooks/api/classes';

import { Loader, Modal, Input, Button } from "../../components";
import { useGetRoomsAssignments } from "../../hooks";
import { IAssignment } from "../../types";

import Header from "../../components/ui/header/Header";
import Assignment from "../../components/ui/assignment/Assisgnment";

import { useMutation } from "@tanstack/react-query";
import { ClassRoomApiService } from "../../services";

// import * as pdfjsLib from "pdfjs-dist";
import pdfToText from "react-pdftotext";

import mammoth from "mammoth";

import { toast } from "react-hot-toast";

import settingsIcon from "../../assets/icons/settings-icon.svg";
import copyIcon from "../../assets/icons/copy-icon.svg";
import filterIcon from "../../assets/icons/filter-icon.svg";
import UploadPlanIcon from "../../assets/icons/upload-plan-icon.svg";

export const ClassDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [classItem, setClassItem] = useState<Class | null>(null);
  const [isUploadPlanModalOpen, setIsUploadPlanModal] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");

  const { data, isPending } = useClassById(id as string);
  
  const { 
    data: assignmentsData, 
    isPending: isAssigmentsPending, 
    refetch: assignmentsRefetch, 
    isRefetching: isAssignmentsRefetching,
  } = useGetRoomsAssignments(id as string);

  const { mutate: addNewStudentMutation, isPending: isAddingStudentPending } = useMutation({
    mutationFn: (data: { classRoomId: string, studentEmails: string[] }) => {
      return ClassRoomApiService.updateClassRoom(data.classRoomId, { studentEmails: data.studentEmails });
    },
    onSuccess: () => {
      toast.success("Successfully added");
      setIsAddStudentModalOpen(false);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const onAssignmentClick = (assignment: IAssignment) => {
    navigate(`/classes/${id}/${assignment.id}`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    assignmentsRefetch();
  }, [id, assignmentsRefetch]);

  const { mutate: updateClassRoomMutation } = useMutation({
    mutationFn: (data: { classRoomId: string, learningPlan: string }) => {
      return ClassRoomApiService.updateClassRoom(data.classRoomId, { learningPlan: data.learningPlan });
    },
    onSuccess: () => {
      setIsUploadPlanModal(false);
      toast.success("Successfully uploaded");
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
    } catch(error) {
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

    updateClassRoomMutation({ classRoomId: id as string, learningPlan, });
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

    addNewStudentMutation({ classRoomId: id as string, studentEmails });
  };

  useEffect(() => {
    if (data) {
      setClassItem(data);
    }
  }, [data]);

  useEffect(() => {
    if (id) {
      assignmentsRefetch();
    }
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen py-6 px-2 bg-bg-color">
      {isPending || isAssigmentsPending || isAssignmentsRefetching && <Loader />}
      <Header title={classItem?.name as string} linkTo="/classes" />
      <div className=" px-4 mt-12">
        <div
          className={`bg-white p-4 rounded-[16px] shadow flex flex-col space-y-2`}
        >
          <div className="bg-gray-200 h-24 rounded-[8px]"></div>
          <div className="flex items-center gap-[10px] justify-between">
            <p className="text-[14px] text-gray-500 font-light">
              Upload class learning plan to have more suitable task
              recommendations
            </p>

            <button className="w-[34px]" onClick={() => setIsUploadPlanModal(true)}>
              <img src={`${UploadPlanIcon}`} />
            </button>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-700 border-[0.5px] border-[#E9ECEF] py-1 px-3 rounded-full text-sm">
              {classItem?.studentEmails?.length} Students
            </span>
            <span className="border-[0.5px] border-[#E9ECEF] text-gray-700 py-1 px-3 rounded-full text-sm">
              {classItem?.assignmentIds?.length} assignments
            </span>
            <span className="border-[0.5px] border-[#E9ECEF] text-gray-700 py-1 px-1 rounded-full text-sm">
              <img src={settingsIcon} alt="settings" />
            </span>
          </div>
        </div>
        <div
          className={`bg-white p-4 rounded-[16px] shadow flex flex-col space-y-2  mt-2`}
        >
          <h2 className="text-[16px] text-placholderText font-light">
            Class Code
          </h2>
          <div className="flex flex-col gap-[15px]">
            <div className="flex justify-between">
              <img src={copyIcon} alt="copy"/>
              <span className="text-[24px] text-[#362D2E] font-light ml-1">
                {`vgu6g25`}
              </span>
              <div className="ml-auto items-center border-[0.5px] border-[#E9ECEF] py-1 px-3 rounded-full">
                <span className="text-[16px] text-blueText font-light">
                  Invite Student(s)
                </span>
              </div>
            </div>

            <button
              className="py-[10px] border-[0.5px] border-[#E9ECEF] px-3 rounded-full"
              onClick={() => setIsAddStudentModalOpen(true)}
            >
              Add student
            </button>
          </div>
        </div>

        <div className="flex flex-row mt-6">
          <h2 className="text-[18px] text-text-color font-normal">
            Assignments
          </h2>

          <div className="flex flex-row ml-auto items-center">
            <span className="text-[16px] text-brownText font-light">
              Filter
            </span>
            <img src={filterIcon} alt="filter" />
          </div>
        </div>

        {!isAssignmentsRefetching && assignmentsData?.map((assignment, index) => (
          <Assignment
            key={index}
            assignment={assignment}
            onClick={onAssignmentClick}
          />
        ))}

        {!isAssignmentsRefetching && !isAssigmentsPending && assignmentsData?.length === 0 && <p className="text-gray-500 text-center mt-[60px]">No assignments yet</p>}
      </div>

      <Modal
        isOpen={isUploadPlanModalOpen}
        onClose={() => setIsUploadPlanModal(false)}
      >
        <div className="flex flex-col gap-[20px] items-center">
          <p className="text-center text-[18px] font-semibold">Upload learning plan</p>

          <div className="relative mt-[20px]">
            <input
              type="file"
              className="relative py-[14px] z-[2] opacity-0"
              accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
              onChange={uploadLearningPlanHandler}
            />
            <div
              className="
                flex absolute top-0 left-0 z-[0] items-center w-full justify-center 
                gap-[10px] bg-gray-300 py-[14px] rounded-[8px]
              "
            >
              Upload <img src={`${UploadPlanIcon}`} />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
      >
        <div>
          <p className="font-semibold text-[20px] text-center">Add student email</p>

          <form onSubmit={submitStudentEmail} className="flex flex-col mt-[10px]">
            <Input
              type="email"
              value={studentEmail}
              onChange={(event) => setStudentEmail(event.target.value)}
              className=""
              placeholder="Enter student email"
            />
            <Button
              className="bg-main-red text-white w-full border-main-red mt-[10px] disabled:bg-red-300 disabled:border-red-300 sm:w-[120px]"
              disabled={isAddingStudentPending}
            >
              {!isAddingStudentPending ? "Add new student" : "Loading..."}
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};
