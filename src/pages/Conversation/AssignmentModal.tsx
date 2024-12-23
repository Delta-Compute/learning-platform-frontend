import React, { useContext, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { addAssignment, ClassRoomProgressApiService } from "../../services";

import { useGenerateAssignmentSummary } from "../../hooks";

import { 
  QueryObserverResult, 
  RefetchOptions, 
  useMutation, 
  useQuery, 
  useQueryClient 
} from "@tanstack/react-query";

import { Modal, Button } from "../../components";

import { IAssignment } from "../../types";

import { useGetClassesTeacherId } from '../../hooks/api/classes';

import UserContext from '../../context/UserContext';

import { toast } from "react-hot-toast";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import DropdownChevronUp from "../../assets/icons/dropdown-chevron-up.svg";
import SchoolNamesContext from "../../context/SchoolNamesContext.tsx";

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentTopic: string;
  assignmentDescription: string;
  assignmentTitle: string;
  assignmentTime: number;
  onClassRoomAssignmentsRefetch?: (options?: RefetchOptions) => Promise<QueryObserverResult<IAssignment[] | null, Error>>;
  checkShowFeedbackModal?: () => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  assignmentTopic,
  assignmentDescription,
  assignmentTitle,
  assignmentTime,
  onClassRoomAssignmentsRefetch,
  checkShowFeedbackModal,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { currentSchoolName } = useContext(SchoolNamesContext);
  const [time, setTime] = useState("00:00");
  const [selectedClassRoom, setSelectedClassRoom] = useState<{ id: string, name: string } | null>(null);
  const [isRoomsDropdownOpen, setIsRoomsDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getTime());

  const [newAssignment, setNewAssignment] = useState<IAssignment | null>(null);

  const {
    data: studentsProgress,
    refetch: studentsProgressRefetch,
  } = useQuery({
    queryFn: () => ClassRoomProgressApiService.getStudentsProgress(selectedClassRoom?.id as string, newAssignment?.id as string),
    queryKey: ["students-progress", selectedClassRoom?.id as string, newAssignment?.id],
    staleTime: 5_000_000,
    enabled: false,
  });

  const { generateAssignmentSummary } = useGenerateAssignmentSummary();

  useEffect(() => {
    if (newAssignment) {
      studentsProgressRefetch();
    }
  }, [newAssignment, studentsProgressRefetch]);

  const [isOpenDate, setIsOpenDate] = useState(false);
  const { user } = useContext(UserContext);

  const getDateTimeTimestamp = () => {
    if (!selectedDate || !time) return null;

    const [hours, minutes] = time.split(":").map(Number);

    const dateWithTime = new Date(selectedDate);
    dateWithTime.setHours(hours);
    dateWithTime.setMinutes(minutes);
    dateWithTime.setSeconds(0);
    dateWithTime.setMilliseconds(0);

    return dateWithTime.getTime();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpenDate && !(event.target as HTMLElement).closest(".calendar-dropdown")) {
        setIsOpenDate(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenDate]);

  const handleInputClick = () => {
    setIsOpenDate(!isOpenDate);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date.getTime());
      setIsOpenDate(false);
    } else {
      console.log('No date selected');
    }
  };

  const { data: classRooms } = useGetClassesTeacherId(user?.id as string);

  const addNewAssignment = async (assignment: { classRoomId: string, description: string, title: string, topic: string, deadline: number, timeToDiscuss: number }) => {
    try {
      const data = await addAssignment(
        currentSchoolName,
        assignment.classRoomId,
        assignment.description,
        assignment.topic,
        assignment.title,
        assignment.deadline,
        assignment.timeToDiscuss
      );

      setNewAssignment(data);
    } catch (error) {
      console.log(error);
    }
  };

  const { mutate: createAssignmentMutation, isPending: isCreateAssignmentPending } = useMutation({
    mutationFn: (assignment: { classRoomId: string, description: string, title: string, topic: string, deadline: number, timeToDiscuss: number }) => {
      return addNewAssignment(assignment);
    },
    onSuccess: async () => {
      onClose();
      toast.success(t("conversationPage.assignmentModal.successfullyCreatedText"));
      if (onClassRoomAssignmentsRefetch) {
        await onClassRoomAssignmentsRefetch();
      }

      if (checkShowFeedbackModal) {
        checkShowFeedbackModal();
      }

      queryClient.invalidateQueries();
    },
    onError: () => {
      toast.error("Something went wrong");
    }
  });

  useEffect(() => {
    if (classRooms && classRooms?.length !== 0) {
      setSelectedClassRoom({ id: classRooms[0].id ?? "", name: classRooms[0].name ?? "" });
    }
  }, [classRooms]);

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };

  useEffect(() => {
    if (newAssignment && studentsProgress) {
      (async () => {
        await generateAssignmentSummary(newAssignment.id as string, studentsProgress);
      })();
    }
  }, [newAssignment, studentsProgress]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <p className="text-center font-semibold text-[18px] text-dark-blue">
        {t("conversationPage.assignmentModal.title")}
      </p>

      <div className="flex flex-col gap-[10px] pt-[20px] relative">
        <div className='relative'>
          <label>{t("conversationPage.assignmentModal.classLabel")}</label>
          <div
            className="cursor-pointer p-[12px] rounded-[22px] border-[1px] mt-[10px] flex items-center justify-between"
            onClick={() => setIsRoomsDropdownOpen(active => !active)}
          >
            <span>{selectedClassRoom?.name}</span>
            <div className={`${isRoomsDropdownOpen && "rotate-180"}`}>
              <img src={`${DropdownChevronUp}`} />
            </div>
          </div>

          {isRoomsDropdownOpen && (
            <ul className="absolute top-full left-0 w-full mt-2 bg-white border-[1px] rounded-[22px] shadow-lg z-10">
              {classRooms?.map((classRoom) => (
                <li
                  key={classRoom.id}
                  className="p-[10px] cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setIsRoomsDropdownOpen(false);
                    setSelectedClassRoom({
                      id: classRoom.id ?? "",
                      name: classRoom.name,
                    });
                  }}
                >
                  {classRoom.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <label className="mt-[10px]">{t("conversationPage.assignmentModal.assignmentDetailsLabel")}</label>
        <div className="p-[10px] border-[1px] rounded-[22px] overflow-y-scroll max-h-[160px]">
          <div className='font-semibold'>{assignmentTitle}</div>
          <div>
            <div>
              <span className='font-semibold'>{t("conversationPage.assignmentModal.assignment.topic")}: </span>
              <span>{assignmentTopic}</span>
            </div>
          </div>
          <div>
            <span className='font-semibold'>{t("conversationPage.assignmentModal.assignment.description")}: </span>
            <span>{assignmentDescription}</span>
          </div>
        </div>

        <div className="flex flex-col">
          <p>{t("conversationPage.assignmentModal.deadlineLabel")}:</p>
          <div className="flex justify-between mt-[10px]">
            <div className="inline-block relative">
              <input
                type="text"
                readOnly
                value={new Date(selectedDate).toLocaleDateString('en-US').split('/').join('-')}
                onClick={handleInputClick}
                placeholder="Choose a deadline"
                className="border p-2 rounded-[22px] cursor-pointer w-[160px]"
              />
              {isOpenDate && (
                <div className="absolute bottom-[50px] mt-2 z-10 bg-white shadow-lg rounded-[22px] p-2 calendar-dropdown">
                  <DayPicker
                    mode="single"
                    onSelect={(date) => {
                      handleDateSelect(date || undefined);
                    }}
                    disabled={{ before: new Date() }}
                    weekStartsOn={1}
                    showOutsideDays
                    fixedWeeks
                  />
                </div>
              )}
            </div>

            <form className="max-w-[8rem]">
              <div className="relative">
                <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="time"
                  id="time"
                  className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  min="09:00"
                  max="18:00"
                  value={time}
                  onChange={handleTimeChange}
                  required
                />
              </div>
            </form>
          </div>
          <div className="mt-[10px]">
            {t("conversationPage.assignmentModal.timeForTaskText")}: {assignmentTime / 60} minutes
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            className="bg-main text-white w-full border-main-red disabled:opacity-40 sm:w-[120px]"
            disabled={isCreateAssignmentPending}
            onClick={() => {
              if (selectedClassRoom) {
                createAssignmentMutation(
                  { classRoomId: selectedClassRoom.id, description: assignmentDescription, title: assignmentTitle, topic: assignmentTopic, deadline: getDateTimeTimestamp() || 0, timeToDiscuss: assignmentTime },
                );
              }
            }}
          >
            {!isCreateAssignmentPending ? t("conversationPage.assignButton") : t("conversationPage.loading")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};