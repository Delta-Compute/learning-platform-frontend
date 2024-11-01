import React, { useContext, useEffect, useState } from "react";

import { addAssignment } from "../../services";

import { useMutation } from "@tanstack/react-query";

import { Modal, Button } from "../../components";

import DropdownChevronUp from "../../assets/icons/dropdown-chevron-up.svg";
import { useGetClassesTeacherId } from '../../hooks/api/classes';
import UserContext from '../../context/UserContext';

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
  const { user } = useContext(UserContext);

  const { data: classRooms } = useGetClassesTeacherId(user?.id as string);

  const { mutate: createAssignmentMutation, isPending: isCreateAssignmentPending } = useMutation({
    mutationFn: (assignment: { classRoomId: string, description: string, title: string, topic: string }) => addAssignment(assignment.classRoomId, assignment.description),
    onSuccess: () => {
      onClose();
    },
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

      <div className="flex flex-col gap-[10px] pt-[20px]">
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
            <ul className="absolute top-full left-0 w-full mt-2 bg-white border-[1px] rounded-[8px] shadow-lg z-10">
              {classRooms?.map((classRoom) => (
                <li
                  key={classRoom.id}
                  className="p-[10px] cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setIsRoomsDropdownOpen(false);
                    setSelectedClassRoom({
                      id: classRoom.id ?? '',
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
        <div className="p-[10px] border-[1px] rounded-[8px]">
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

        <p className="flex gap-[10px] mt-[10px]">
          <span className="text-gray-500">Deadline: </span>
          <span>12/12/1222</span>
        </p>

        <div className="flex justify-center">
          <Button
            className="bg-main-red text-white w-full border-main-red disabled:bg-red-300 disabled:border-red-300 sm:w-[120px]"
            disabled={isCreateAssignmentPending}
            onClick={() => {
              if (selectedClassRoom) {
                createAssignmentMutation({ classRoomId: selectedClassRoom.id, description: assignmentDescription, title: assignmentTitle, topic: assignmentTopic });
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