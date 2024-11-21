import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { useGetClassesTeacherId } from '../../hooks/api/classes';
import { Loader } from '../ui/loader/Loader';

// import { toast } from "react-hot-toast";
import { Class } from '../../types/class';
import UserContext from '../../context/UserContext';
import StudentDropdown from './StudentsDropdown';
import { useClassRoomReport, useGetUsersByEmails } from '../../hooks';
import { ClassesDropdown } from './ClassesDropdown';
import { User } from '../../types';
import { DateDropdown } from './DateDropdown';
import { calculateRange } from '../../utils/calculateRange';
import { DownloadSendReportModal } from './DownloadSendReportModal';
import { ReportData } from '../../types/reportData';
import SchoolNamesContext from "../../context/SchoolNamesContext.tsx";

interface UpdateClassModalProps {
  onClose: () => void;
  classItem: Class;
}

export const ReportModal: React.FC<UpdateClassModalProps> = ({ onClose, classItem }) => {
  const { currentSchoolName } = useContext(SchoolNamesContext);
  const [classChosenItem, setClassChosenItem] = useState<Class>(classItem);
  const [selectedStudent, setSelectedStudent] = useState<User | string>("All");
  const [chosenStudent, setChosenStudent] = useState<string[]>([]);
  const [selectedRange, setSelectedRange] = useState<string | { from: number; to: number }>("Last week");
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadModalData, setDownloadModalData] = useState<ReportData | null>(null);

  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const { data: classRooms, isPending: isClassesPending } = useGetClassesTeacherId(user?.id as string);
  const {
    data: studentsList,
    isPending: isStudentsPending,
    refetch: refetchStudents,
    isRefetching: isRefetchingStudents,
  } = useGetUsersByEmails(classChosenItem?.studentEmails || [], currentSchoolName);

  const handleCloseModalBlur = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    refetchStudents();
  }
    , [classChosenItem, selectedStudent, refetchStudents]);

  useEffect(() => {
    if (selectedStudent === "All") {
      setChosenStudent(classChosenItem.studentEmails || []);
    }
  }, [selectedStudent, classChosenItem.studentEmails]);

  const range = useMemo(() => {
    return typeof selectedRange === "string"
      ? calculateRange(selectedRange)
      : selectedRange;
  }, [selectedRange]);

  const memoizedChosenStudent = useMemo(() => [...chosenStudent], [chosenStudent]);

  const { data, isLoading, refetch, isRefetching } = useClassRoomReport(
    classChosenItem?.id || "",
    memoizedChosenStudent,
    range.from,
    range.to
  );

  useEffect(() => {
    refetch();
  }, [classChosenItem, memoizedChosenStudent, range, refetch]);

  const handleOnSave = () => {
    const range = typeof selectedRange === "string" ? calculateRange(selectedRange) : selectedRange;
    setIsDownloadModalOpen(true);
    setDownloadModalData({
      classId: classChosenItem?.id || "",
      studentEmail: chosenStudent,
      range,
    });
  };

  console.log(data, 'data');


  const handleSetSelectedStudent = useCallback((student: User | string) => {
    setSelectedStudent(student);
  }, []);

  const handleSetChosenStudent = useCallback((emails: string[]) => {
    setChosenStudent(emails);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#00143480] bg-opacity-50" onClick={(e) => handleCloseModalBlur(e)}>
      {(isClassesPending || isStudentsPending || isRefetchingStudents || isLoading || isRefetching) && <Loader />}
      <div className="bg-white w-[95%] max-w-md p-2 pt-4 rounded-[32px] shadow-lg">
        <h2 className="text-[24px] font-semibold text-center mb-4 text-[#001434]">{t("teacherPages.classes.classModal.reportTitle")}</h2>

        <ClassesDropdown classes={classRooms!} setSelectedClass={setClassChosenItem} classChosenItem={classChosenItem} t={t} />
        <StudentDropdown students={studentsList!} t={t} setSelectedStudent={handleSetSelectedStudent} selectedStudent={selectedStudent} setChosenStudent={handleSetChosenStudent} />
        <DateDropdown t={t} selectedOption={selectedRange} setSelectedOption={setSelectedRange} />
        <button
          onClick={handleOnSave}
          className="w-full bg-main text-white py-3 rounded-full font-semibold"
        >
          {t("teacherPages.classes.classModal.submitSettingsButton")}
        </button>
      </div>
      {isDownloadModalOpen && <DownloadSendReportModal data={downloadModalData!} onClose={() => setIsDownloadModalOpen(false)} />}
    </div>
  );
};
