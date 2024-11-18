import React, { useContext, useState } from "react";

import { useTranslation } from "react-i18next";

import { useCreateClass } from '../../hooks/api/classes';
import UserContext from '../../context/UserContext';
import { Loader } from '../ui/loader/Loader';

import { toast } from "react-hot-toast";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshClasses: () => void;
}

const CreateClassModal: React.FC<CreateClassModalProps> = ({ isOpen, onClose, onRefreshClasses }) => {
  const { t } = useTranslation();
  const [className, setClassName] = useState<string>("");
  const [classSubject, setClassSubject] = useState<string>("");
  const { user } = useContext(UserContext);

  const handleCloseModalBlur = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const { mutate, isPending } = useCreateClass();

  const handleCreateClass = () => {
    if (!className) return;
  
    mutate(
      {
        name: className,
        teacherId: user?.id as string,
        subject: classSubject
      },
      {
        onSuccess: () => {
          onRefreshClasses();
          toast.success(t("teacherPages.classes.classModal.successfullyCreatedText"));
          setClassName("");
          setClassSubject("");
          onClose();
        },
        onError: () => {
          toast.error("Something went wrong");
        }
      }
    );
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#00143480] bg-opacity-50" onClick={(e) => handleCloseModalBlur(e)}>
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

        {/*<div className="mb-4">*/}
        {/*  <label className="ml-[8px] block text-sm font-normal mb-2 text-[16px]">Download students e-mails list</label>*/}
        {/*  <div className="relative">*/}
        {/*    <input*/}
        {/*      type="text"*/}
        {/*      placeholder="E.g. Docs or PDF"*/}
        {/*      className="w-full border rounded-full p-3 text-gray-700 focus:outline-none"*/}
        {/*    />*/}
        {/*    <button className="absolute inset-y-0 right-4 flex items-center">*/}
        {/*      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
        {/*        <path d="M11 14V1M11 1L14 4.5M11 1L8 4.5" stroke="#868E96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />*/}
        {/*        <path d="M7 21H15C17.828 21 19.243 21 20.121 20.122C21 19.242 21 17.829 21 15V14C21 11.172 21 9.75795 20.121 8.87895C19.353 8.11095 18.175 8.01395 16 8.00195M6 8.00195C3.825 8.01395 2.647 8.11095 1.879 8.87895C1 9.75795 1 11.172 1 14V15C1 17.829 1 19.243 1.879 20.122C2.179 20.422 2.541 20.619 3 20.749" stroke="#868E96" strokeWidth="1.5" strokeLinecap="round" />*/}
        {/*      </svg>*/}
        {/*    </button>*/}
        {/*  </div>*/}
        {/*</div>*/}
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

export default CreateClassModal;