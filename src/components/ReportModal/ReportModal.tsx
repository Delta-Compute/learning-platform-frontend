import React, { useState } from "react";

import { useTranslation } from "react-i18next";

import { useUpdateClass } from '../../hooks/api/classes';
import { Loader } from '../ui/loader/Loader';

import { toast } from "react-hot-toast";
import { Class } from '../../types/class';

interface UpdateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshClasses: () => void;
  classItem: Class;
}

export const ClassSettingsModal: React.FC<UpdateClassModalProps> = ({ onClose, onRefreshClasses, classItem }) => {
  const { t } = useTranslation();
  const [className, setClassName] = useState<string>(classItem?.name);
  const [classSubject, setClassSubject] = useState<string>(classItem?.subject);  

  const handleCloseModalBlur = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const { mutate, isPending } = useUpdateClass(classItem?.id as string);

  const handleUpdateClass = () => {
    if (!className) return;

    mutate(
      {
        name: className,
        subject: classSubject
      },
      {
        onSuccess: () => {
          onRefreshClasses();
          toast.success(t("teacherPages.classes.classModal.successfullyUpdatedText"));
          onClose();
        },
        onError: () => {
          toast.error(t("teacherPages.classes.classModal.somethingWentWrongText"));
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#00143480] bg-opacity-50" onClick={(e) => handleCloseModalBlur(e)}>
      {isPending && <Loader />}
      <div className="bg-white w-[95%] max-w-md p-2 pt-4 rounded-[32px] shadow-lg">
        <h2 className="text-[24px] font-semibold text-center mb-4 text-[#001434]">{t("teacherPages.classes.classModal.classSettingsTitle")}</h2>

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
        <button
          onClick={() => handleUpdateClass()}
          className="w-full bg-main text-white py-3 rounded-full font-semibold"
        >
          {t("teacherPages.classes.classModal.submitSettingsButton")}
        </button>
      </div>
    </div>
  );
};
