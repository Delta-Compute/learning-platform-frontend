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
import { DataForReport, ReportData } from '../../types/reportData';
import SchoolNamesContext from "../../context/SchoolNamesContext.tsx";
import toast from 'react-hot-toast';
import { openai } from '../../vars/open-ai.ts';
import { instructionsForReport } from '../../utils/conversation_config.ts';

interface UpdateClassModalProps {
  onClose: () => void;
  classItem: Class;
}

export const ReportModal: React.FC<UpdateClassModalProps> = ({ onClose, classItem }) => {
  const { currentSchoolName } = useContext(SchoolNamesContext);
  const [ isFeedbackGenerating, setIsFeedbackGenerating ] = useState(false);
  const [classChosenItem, setClassChosenItem] = useState<Class>(classItem);
  const [selectedStudent, setSelectedStudent] = useState<User | string>("All");
  const [chosenStudent, setChosenStudent] = useState<string[]>([]);
  const [selectedRange, setSelectedRange] = useState<string | { from: number; to: number }>("Last week");
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadModalData, setDownloadModalData] = useState<DataForReport | null>(null);

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

  const { data: reportData, isLoading, refetch, isRefetching } = useClassRoomReport(
    classChosenItem?.id || "",
    memoizedChosenStudent,
    range.from,
    range.to
  );

  useEffect(() => {
    refetch();
  }, [classChosenItem, memoizedChosenStudent, range, refetch]);

  const generateFeedbackForEachStudentAssignments = async (student: ReportData) => {
    try {
      const completedAssignments = student.completedAssignments
        .map(
          (assignment) =>
            `${assignment.title}, ${assignment.createdAt ? new Date(assignment.createdAt).toLocaleString() : "No date"}, ${assignment.feedback || "No feedback"}`
        )
        .join("\n");
      const inCompletedAssignments = student.inCompletedAssignments
        .map(
          (assignment) =>
            `${assignment.title}, ${assignment.createdAt ? new Date(assignment.createdAt).toLocaleString() : "No date"}, ${assignment.feedback || "No feedback"}`
        )
        .join("\n");


      const instructions = `
        Student: ${student.studentName} (${student.studentEmail})
        Completed Assignments:
        ${completedAssignments || "No completed assignments"}
  
        Incompleted Assignments:
        ${inCompletedAssignments || "No incompleted assignments"}
        `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You must create a feedback for student based on their assignments.",
          },
          {
            role: "user",
            content: `${instructionsForReport(instructions)}`,
          },
        ],
        max_tokens: 350,
      });

      if (response.choices[0].message.content) {
        const feedback = response.choices[0].message.content.trim();
        return feedback;
      }


    } catch (error) {
      console.error("Error fetching topics from OpenAI:", error);
    }
  };

  const generateFeedbackForAllStudents = async (reportData: ReportData[]) => {
    try {
      const updatedReportData = await Promise.all(
        reportData.map(async (student) => {
          const feedback = await generateFeedbackForEachStudentAssignments(student);
          return {
            ...student,
            feedback,
          };
        })
      );

      return updatedReportData;
    } catch (error) {
      console.error("Error generating feedback for all students:", error);
      return [];
    }
  };

  const handleOnSave = async () => {
    setIsFeedbackGenerating(true);
    const updatedReportData = await generateFeedbackForAllStudents(reportData);
    if (!reportData || !reportData.length) {
      toast.error(t("teacherPages.classes.classModal.noDataError"));
      return;
    }
    const reportDataState: DataForReport = {
      dataForReport: updatedReportData,
      baseData: {
        schoolName: currentSchoolName,
        teacherName: `${user?.firstName} ${user?.lastName}` as string,
        className: classChosenItem.name,
        dateRange: typeof selectedRange === "string" ? selectedRange : `${selectedRange.from} - ${selectedRange.to}`,
      },
    }

    setIsFeedbackGenerating(false);

    setDownloadModalData(reportDataState);
    setIsDownloadModalOpen(true);
  };

  const handleSetSelectedStudent = useCallback((student: User | string) => {
    setSelectedStudent(student);
  }, []);

  const handleSetChosenStudent = useCallback((emails: string[]) => {
    setChosenStudent(emails);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#00143480] bg-opacity-50" onClick={(e) => handleCloseModalBlur(e)}>
      {(isClassesPending || isStudentsPending || isRefetchingStudents || isLoading || isRefetching || isFeedbackGenerating) && <Loader />}
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
      {isDownloadModalOpen &&
        <DownloadSendReportModal
          data={downloadModalData!}
          onClose={() => setIsDownloadModalOpen(false)}
          baseData={{ student: selectedStudent, range: typeof selectedRange === "string" ? calculateRange(selectedRange) : selectedRange, className: classChosenItem.name }}
        />
      }
    </div>
  );
};
