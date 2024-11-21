import React, { useContext, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { useGetClassesTeacherId } from '../../hooks/api/classes';
import { Loader } from '../ui/loader/Loader';

// import { toast } from "react-hot-toast";
import { Class } from '../../types/class';
import UserContext from '../../context/UserContext';
import StudentDropdown from './StudentsDropdown';
import { useGetUsersByEmails } from '../../hooks';
import { ClassesDropdown } from './ClassesDropdown';
import { User } from '../../types';
import { DateDropdown } from './DateDropdown';
// import { calculateRange } from '../../utils/calculateRange';

interface UpdateClassModalProps {
  onClose: () => void;
  classItem: Class;
}

export const ReportModal: React.FC<UpdateClassModalProps> = ({ onClose, classItem }) => {
  const [classChosenItem, setClassChosenItem] = useState<Class | null>(classItem);
  const [selectedStudent, setSelectedStudent] = useState<User | string>("All");
  const [selectedRange, setSelectedRange] = useState<string | { from: number; to: number }>("Last week");

  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const { data: classRooms, isPending: isClassesPending } = useGetClassesTeacherId(user?.id as string);
  const {
    data: studentsList,
    isPending: isStudentsPending,
    refetch: refetchStudents,
    isRefetching: isRefetchingStudents,
  } = useGetUsersByEmails(classChosenItem?.studentEmails || []);

  const handleCloseModalBlur = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // useEffect(() => {
  //   if (typeof selectedRange === "string") {
  //     const range = calculateRange(selectedRange);
  //     setSelectedRange(range);
  //   }
  // }, [selectedRange]);

  useEffect(() => {
    if (classChosenItem) {
      refetchStudents();
    }
  }, [classChosenItem, refetchStudents]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#00143480] bg-opacity-50" onClick={(e) => handleCloseModalBlur(e)}>
      {isClassesPending && isStudentsPending && isRefetchingStudents && <Loader />}
      <div className="bg-white w-[95%] max-w-md p-2 pt-4 rounded-[32px] shadow-lg">
        <h2 className="text-[24px] font-semibold text-center mb-4 text-[#001434]">{t("teacherPages.classes.classModal.reportTitle")}</h2>

        <ClassesDropdown classes={classRooms!} setSelectedClass={setClassChosenItem} classChosenItem={classChosenItem} t={t} />
        <StudentDropdown students={studentsList!} t={t} setSelectedStudent={setSelectedStudent} selectedStudent={selectedStudent} />
        <DateDropdown t={t} selectedOption={selectedRange} setSelectedOption={setSelectedRange} />
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
