import React, { useState } from "react";

import { useTranslation } from "react-i18next";

import { Loader } from '../ui/loader/Loader';

import { toast } from "react-hot-toast";
import { User } from '../../types';
import { useUpdateUser } from '../../hooks';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ onClose, user }) => {
  const { t } = useTranslation();
  const [userFirstName, setUserFirstName] = useState<string>(user?.firstName || "");
  const [userLastName, setUserLastName] = useState<string>(user?.lastName || "");
  const [userEmail, setUserEmail] = useState<string>(user?.email || "");
  const [userNatureLanguage, setUserNatureLanguage] = useState<string>(user?.nativeLanguage || "");
  const [userForeignLanguage, setUserForeignLanguage] = useState<string>(user?.foreignLanguage || "");

  const handleCloseModalBlur = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const { mutate, isPending } = useUpdateUser();

  const handleUpdateProfile = () => {
    if (!user.id) return;

    mutate(
      {
        id: user?.id,
        firstName: userFirstName,
        lastName: userLastName,
        email: userEmail,
        natureLanguage: userNatureLanguage,
        foreignLanguage: userForeignLanguage,
      },
      {
        onSuccess: () => {
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
        <h2 className="text-[24px] font-semibold text-center mb-4 text-[#001434]">{t("teacherPages.profile.profileModalTitle")}</h2>

        <div className="mb-4">
          <label className="ml-[8px] block text-sm font-normal mb-2 text-[16px]">{t("teacherPages.profile.firstNameModal")}</label>
          <input
            value={userFirstName}
            type="text"
            placeholder={t("teacherPages.profile.firstNameInputPlaceholder")}
            className="w-full border rounded-full p-3 text-gray-700 focus:outline-none"
            onChange={(e) => setUserFirstName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="ml-[8px] block text-sm font-normal mb-2 text-[16px]">{t("teacherPages.profile.lastNameModal")}</label>
          <input
            value={userLastName}
            type="text"
            placeholder={t("teacherPages.profile.lastNameInputPlaceholder")}
            className="w-full border rounded-full p-3 text-gray-700 focus:outline-none"
            onChange={(e) => setUserLastName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="ml-[8px] block text-sm font-normal mb-2 text-[16px]">{t("teacherPages.profile.emailModal")}</label>
          <input
            value={userEmail}
            type="text"
            placeholder={t("teacherPages.profile.emailInputPlaceholder")}
            className="w-full border rounded-full p-3 text-gray-700 focus:outline-none"
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="ml-[8px] block text-sm font-normal mb-2 text-[16px]">{t("teacherPages.profile.nativeLanguage")}</label>
          <input
            value={userNatureLanguage}
            type="text"
            placeholder={t("teacherPages.profile.nativeLanguageInputPlaceholder")}
            className="w-full border rounded-full p-3 text-gray-700 focus:outline-none"
            onChange={(e) => setUserNatureLanguage(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="ml-[8px] block text-sm font-normal mb-2 text-[16px]">{t("teacherPages.profile.foreignLanguage")}</label>
          <input
            value={userForeignLanguage}
            type="text"
            placeholder={t("teacherPages.profile.foreignLanguageInputPlaceholder")}
            className="w-full border rounded-full p-3 text-gray-700 focus:outline-none"
            onChange={(e) => setUserForeignLanguage(e.target.value)}
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
          onClick={() => handleUpdateProfile()}
          className="w-full bg-main text-white py-3 rounded-full font-semibold"
        >
          {t("teacherPages.classes.classModal.submitSettingsButton")}
        </button>
      </div>
    </div>
  );
};