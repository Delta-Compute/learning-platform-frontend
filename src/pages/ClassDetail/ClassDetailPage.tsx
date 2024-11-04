import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/ui/header/Header";
import settingsIcon from "../../assets/icons/settings-icon.svg";
import copyIcon from "../../assets/icons/copy-icon.svg";
import filterIcon from "../../assets/icons/filter-icon.svg";
import Assignment from "../../components/ui/assignment/Assisgnment";
import { Class } from '../../types/class';
import { useEffect, useState } from 'react';
import { useClassById } from '../../hooks/api/classes';
import { Loader, Modal } from '../../components';
import { useGetRoomsAssignments } from '../../hooks';
import { IAssignment } from '../../types';

import { useMutation } from "@tanstack/react-query";
import { ClassRoomApiService } from "../../services";

import UploadPlanIcon from "../../assets/icons/upload-plan-icon.svg";

import * as pdfjsLib from "pdfjs-dist";

import mammoth from "mammoth";

import { toast } from "react-hot-toast";

export const ClassDetailPage = () => {
  const [classItem, setClassItem] = useState<Class | null>(null);
  const [isUploadPlanModalOpen, setIsUploadPlanModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isPending } = useClassById(id as string);
  const { data: assignmentsData, isPending: isAssigmentsPending, refetch: assignmentsRefetch, isRefetching: isAssignmentsRefetching } = useGetRoomsAssignments(id as string);

  const onAssignmentClick = (assignment: IAssignment) => {
    navigate(`/classes/${id}/${assignment.id}`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    assignmentsRefetch();
  }, [id]);

  const { mutate: updateClassRoomMutation } = useMutation({
    mutationFn: (data: { classRoomId: string, learningPlan: string }) => {
      return ClassRoomApiService.updateClassRoom(data.classRoomId, data.learningPlan);
    },
    onSuccess: () => {
      setIsUploadPlanModal(false);
      toast.success("Successfully upload");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const pdfUploadHandler = async (file: File) => {
    const pdfData = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

    let extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      extractedText += textContent.items.map((item: any) => item.str).join(" ") + "\n";
    }

    return extractedText;
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

    // console.log(learningPlan);

    updateClassRoomMutation({ classRoomId: id as string, learningPlan, });
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
          <div className="flex flex-row flex-1">
            <img src={copyIcon} alt="copy" />
            <span className="text-[24px] text-[#362D2E] font-light ml-1">
              {`vgu6g25`}
            </span>
            <div className="ml-auto items-center border-[0.5px] border-[#E9ECEF] py-1 px-3 rounded-full">
              <span className="text-[16px] text-blueText font-light">
                Invite Student(s)
              </span>
            </div>
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
    </div>
  );
};
