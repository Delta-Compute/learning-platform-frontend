import React, { useContext, useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { addAssignment } from "../../services";

import { useMutation } from "@tanstack/react-query";

import { Modal, Button } from "../../components";

import DropdownChevronUp from "../../assets/icons/dropdown-chevron-up.svg";
import { useGetClassesTeacherId } from '../../hooks/api/classes';
import UserContext from '../../context/UserContext';

import { toast } from "react-hot-toast";

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentTopic: string;
  assignmentDescription: string;
  assignmentTitle: string;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  assignmentTopic,
  assignmentDescription,
  assignmentTitle,
}) => {
  const [selectedClassRoom, setSelectedClassRoom] = useState<{ id: string, name: string } | null>(null);
  const [isRoomsDropdownOpen, setIsRoomsDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getTime());
  
  const [isOpenDate, setIsOpenDate] = useState(false);
  const { user } = useContext(UserContext);

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

  const { mutate: createAssignmentMutation, isPending: isCreateAssignmentPending } = useMutation({
    mutationFn: (assignment: { classRoomId: string, description: string, title: string, topic: string, deadline: number }) => addAssignment(assignment.classRoomId, assignment.description, assignment.topic, assignment.title, assignment.deadline),
    onSuccess: () => {
      onClose();
      toast.success("Assignment successfully created");
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <p className="text-center font-semibold text-[18px] text-dark-blue">
        Assignment
      </p>

      <div className="flex flex-col gap-[10px] pt-[20px] relative">
        <div className='relative'>
          <label>Class</label>
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

        <label className="mt-[10px]">Assignment details</label>
        <div className="p-[10px] border-[1px] rounded-[22px]">
          <div className='font-semibold'>{assignmentTitle}</div>
          <div>
            <div>
              <span className='font-semibold'>Topic: </span>
              <span>{assignmentTopic}</span>
            </div>
          </div>
          <div>
            <span className='font-semibold'>Description: </span>
            <span>{assignmentDescription}</span>
          </div>
        </div>

        <div className='flex flex-col'>
          <p>Deadline:</p>
          <p className="flex gap-[10px] mt-[10px]">
            <div className="inline-block" >
              <input
                type="text"
                readOnly
                value={new Date(selectedDate).toLocaleDateString('en-US').split('/').join('-')}
                onClick={handleInputClick}
                placeholder="Choose a deadline"
                className="border p-2 rounded-[22px] cursor-pointer"
              />
              {isOpenDate && (
                <div className="absolute top-[-100px] mt-2 z-10 bg-white shadow-lg rounded-[22px] p-2 calendar-dropdown">
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
          </p>

        </div>
        <div className="flex justify-center">
          <Button
            className="bg-main-red text-white w-full border-main-red disabled:bg-red-300 disabled:border-red-300 sm:w-[120px]"
            disabled={isCreateAssignmentPending}
            onClick={() => {
              if (selectedClassRoom) {
                createAssignmentMutation({ classRoomId: selectedClassRoom.id, description: assignmentDescription, title: assignmentTitle, topic: assignmentTopic, deadline: selectedDate });
              }
            }}
          >
            {!isCreateAssignmentPending ? "Assign" : "Loading..."}
          </Button>
        </div>
      </div>
    </Modal>
  );
};