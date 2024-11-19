import React, { useContext, useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { useGetClassesTeacherId } from '../../hooks/api/classes';
import { Loader } from '../ui/loader/Loader';

// import { toast } from "react-hot-toast";
import { Class } from '../../types/class';
import UserContext from '../../context/UserContext';
import StudentDropdown from './StudentsDropdown';
import { useGetUsersByEmails } from '../../hooks';

interface UpdateClassModalProps {
  onClose: () => void;
  classItem: Class;
}

export const ReportModal: React.FC<UpdateClassModalProps> = ({ onClose, classItem }) => {
  const [classChosenItem, setClassChosenItem] = useState<Class | null>(classItem);
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const { data: classRooms, isPending: isClassesPending } = useGetClassesTeacherId(user?.id as string);
  const {
    data: studentsList,
    isPending: isStudentsPending,
    refetch: refetchStudents,
    isRefetching: isRefetchingStudents,
  } = useGetUsersByEmails(classChosenItem?.studentEmails || []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const handleBlurClass = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (!dropdownRef.current?.contains(e.relatedTarget)) {
      setIsDropdownOpen(false);
    }
  };

  const handleSelect = (classItem: Class) => {
    setClassChosenItem(classItem);
    setIsDropdownOpen(false);
  };

  const handleCloseModalBlur = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (classChosenItem) {
      refetchStudents();
    }
  }, [classChosenItem, refetchStudents]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#00143480] bg-opacity-50" onClick={(e) => handleCloseModalBlur(e)}>
      {isClassesPending && isStudentsPending && isRefetchingStudents && <Loader />}
      <div className="bg-white w-[95%] max-w-md p-2 pt-4 rounded-[32px] shadow-lg">
        <h2 className="text-[24px] font-semibold text-center mb-4 text-[#001434]">{t("teacherPages.classes.classModal.classSettingsTitle")}</h2>

        <div className="mb-4 relative">
          <label className="ml-[8px] block text-sm font-normal mb-2 text-[16px]">
            {t("teacherPages.classes.classModal.classNameLabel")}
          </label>
          <input
            value={classChosenItem?.name}
            type="text"
            placeholder={t("teacherPages.classes.classModal.classNameInputPlaceholder")}
            className="w-full border rounded-full p-3 text-gray-700 focus:outline-none"
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={handleBlurClass}
            readOnly
          />
          {isDropdownOpen && classRooms?.length && (
            <ul
              ref={dropdownRef}
              tabIndex={0}
              className="absolute z-10 bg-white border rounded-2xl shadow-md mt-1 w-full max-h-40 overflow-y-auto"
            >
              {classRooms
                .map((room) => (
                  <li
                    key={room.id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onMouseDown={() => handleSelect(room)}
                  >
                    {room.name}
                  </li>
                ))}
            </ul>
          )}
        </div>
        <StudentDropdown students={studentsList!} t={t} />
        <button
          onClick={() => { }}
          className="w-full bg-main text-white py-3 rounded-full font-semibold"
        >
          {t("teacherPages.classes.classModal.submitSettingsButton")}
        </button>
      </div>
    </div>
  );
};
