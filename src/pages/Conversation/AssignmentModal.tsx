import React, { useEffect, useState } from "react";

import { Assignment } from "../../types";

import { addAssignment } from "../../services";
import { useGetAllClassRooms } from "../../hooks";
import { useMutation } from "@tanstack/react-query";

import { Modal, Button } from "../../components";

import DropdownChevronUp from "../../assets/icons/dropdown-chevron-up.svg";

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: string;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  assignment,
}) => {
  const [selectedClassRoom, setSelectedClassRoom] = useState<{id: string, name: string} | null>(null);
  const [isRoomsDropdownOpen, setIsRoomsDropdownOpen] = useState(false);

  const { data: classRooms } = useGetAllClassRooms();

  const { mutate: createAssignmentMutation, isPending: isCreateAssignmentPending } = useMutation({
    mutationFn: (assignment: Assignment) => addAssignment(assignment.classRoomId, assignment.description),
    onSuccess: () => {
      onClose();
    },
  });

  useEffect(() => {
    if (classRooms) {
      setSelectedClassRoom({ id: classRooms[0].id ?? "", name: classRooms[0].name });
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
        <div>
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
            <ul className="rounded-[8px] border-[1px] mt-[10px]">
              {classRooms?.map(classRoom => (
                <li 
                  key={classRoom.id}
                  className="p-[10px] cursor-pointer"
                  onClick={() => {
                    setIsRoomsDropdownOpen(false);
                    setSelectedClassRoom({ id: classRoom.id ?? "", name: classRoom.name });
                  }}
                >
                  {classRoom.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <label className="mt-[10px]">Assignment details</label>
        <div className="p-[10px] border-[1px] rounded-[8px]">{assignment}</div>

        <p className="flex gap-[10px] mt-[10px]">
          <span className="text-gray-500">Deadline:</span>
          <span>12/12/1222</span>
        </p>

        <div className="flex justify-center">
          <Button
            className="bg-main-red text-white w-full border-main-red disabled:bg-red-300 disabled:border-red-300 sm:w-[120px]"
            disabled={isCreateAssignmentPending}
            onClick={() => {
              if (selectedClassRoom) {
                createAssignmentMutation({ classRoomId: selectedClassRoom.id, description: assignment });
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