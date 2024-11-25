import React, { useContext, useState } from "react";

import { useTranslation } from "react-i18next";

import { useCreateClass } from '../../hooks/api/classes';
import UserContext from '../../context/UserContext';
import SchoolNamesContext from "../../context/SchoolNamesContext";
import { Loader } from '../ui/loader/Loader';

import { toast } from "react-hot-toast";

import { v4 as uuidv4  } from "uuid"

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshClasses: () => void;
};

type StudentEmailItem = {
  id: string;
  email: string;
};

export const CreateClassModal: React.FC<CreateClassModalProps> = ({ isOpen, onClose, onRefreshClasses }) => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const { currentSchoolName } = useContext(SchoolNamesContext);

  const [className, setClassName] = useState("");
  const [classSubject, setClassSubject] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentEmailItems, setStudentEmailItems] = useState<StudentEmailItem[]>([]);

  const handleCloseModalBlur = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const { mutate, isPending } = useCreateClass();

  const handleCreateClass = () => {
    if (!className) return;

    const studentEmails = studentEmailItems.map(item => item.email);

    mutate({
        name: className,
        teacherId: user?.id as string,
        subject: classSubject,
        studentEmails,
        school: currentSchoolName,
      },
      {
        onSuccess: () => {
          onRefreshClasses();
          toast.success(t("teacherPages.classes.classModal.successfullyCreatedText"));
          setClassName("");
          setClassSubject("");
          setStudentEmail("");
          setStudentEmailItems([]);
          onClose();
        },
        onError: () => {
          toast.error(t("teacherPages.classes.classModal.somethingWentWrongText"));
        }
      }
    );
  };

  const addStudentEmail = () => {
    const student: StudentEmailItem = {
      id: uuidv4(),
      email: studentEmail,
    };

    setStudentEmailItems(prevStudents => {
      return [...prevStudents, student];
    });

    setStudentEmail("");
  };

  const removeStudentEmail = (id: string) => {
    setStudentEmailItems(studentEmailItems.filter((item) => item.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-[#00143480] bg-opacity-50"
      onClick={(e) => handleCloseModalBlur(e)}
    >
      {isPending && <Loader />}
      <div className="bg-white w-[95%] max-w-md p-2 pt-4 rounded-[32px] shadow-lg">
        <h2 className="text-[24px] font-semibold text-center mb-4 text-[#001434]">{t("teacherPages.classes.classModal.title")}</h2>

        <div className="mb-4">
          <label className="ml-[8px] block text-sm font-normal mb-2 text-[16px]">{t("teacherPages.classes.classModal.classNameLabel")}</label>
          <input
            value={className}
            type="text"
            placeholder={t("teacherPages.classes.classModal.classNameInputPlaceholder")}
            className="w-full border rounded-full p-3 text-gray-700 focus:outline-none"
            onChange={(e) => setClassName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="ml-[8px] block text-sm font-normal mb-2 text-[16px]">{t("teacherPages.classes.classModal.classSubjectLabel")}</label>
          <input
            value={classSubject}
            type="text"
            placeholder={t("teacherPages.classes.classModal.classSubjectInputPlaceholder")}
            className="w-full border rounded-full p-3 text-gray-700 focus:outline-none"
            onChange={(e) => setClassSubject(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="ml-[8px] block text-sm font-normal mb-2 text-[16px]">Download students e-mails list</label>
          <div>
            <div className="flex items-center relative">
              <input
                type="text"
                placeholder="Add student emails"
                value={studentEmail}
                onChange={(event) => setStudentEmail(event.target.value)}
                className="p-3 border rounded-full text-gray-700 w-full"
              />
              {studentEmail !== "" && (
                <button
                  className="absolute right-1 top-1 bg-main rounded-full text-white p-2"
                  onClick={addStudentEmail}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                       className="lucide lucide-plus">
                    <path d="M5 12h14"/>
                    <path d="M12 5v14"/>
                  </svg>
                </button>
              )}
            </div>

            <ul className="flex gap-2 mt-2 flex-wrap">
              {studentEmailItems.map(({id, email}) => (
                <li
                  key={id}
                  className="flex items-center gap-2 rounded-full bg-gray-200 px-2 py-1"
                >
                  <span className="text-[14px]">{email}</span>
                  <button
                    onClick={() => removeStudentEmail(id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="lucide lucide-x">
                      <path d="M18 6 6 18"/>
                      <path d="m6 6 12 12"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          onClick={() => handleCreateClass()}
          className="w-full bg-main text-white py-3 rounded-full font-semibold"
        >
          {t("teacherPages.classes.classModal.submitButton")}
        </button>
      </div>
    </div>
  );
};