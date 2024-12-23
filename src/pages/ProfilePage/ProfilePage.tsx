import { useContext, useEffect, useState } from "react";

import UserContext from '../../context/UserContext';
import LanguageContext from "../../context/LanguageContext";

import { useGetClassesTeacherId } from '../../hooks/api/classes';
import { useDeleteUserAccount } from "../../hooks";
import { 
  Loader, 
  ProfileSettingsModal, 
  BottomNavigation, 
  Modal,
  Button, 
} from '../../components';

import { useTranslation } from 'react-i18next';

import { UserRole } from "../../types";

import { User, UserMinus } from "lucide-react";

import settingsIcon from "../../assets/icons/settings-icon.svg";
import darkModeIcon from "../../assets/icons/darkmodeLogo.svg";
import helpIcon from "../../assets/icons/helpIcon.svg";
import languageIcon from "../../assets/icons/languageButton.svg";
import privacyIcon from "../../assets/icons/privacyIcon.svg";
import termsIcon from "../../assets/icons/termsIcon.svg";
import logoutIcon from "../../assets/icons/logoutIcon.svg";

export const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(UserContext);
  const { language } = useContext(LanguageContext);
  const [darkModeOn, setDarkModeOn] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  const [studentsCounter, setStudentsCounter] = useState(0);

  const { data, isPending, refetch } = useGetClassesTeacherId(user?.id as string);

  const { mutate: deleteAccountMutation, isPending: isDeleteAccountPending } = useDeleteUserAccount();

  const countStudents = () => {
    let counter = 0;

    data?.map(classRoom => {
      counter = counter + (classRoom.studentEmails?.length ?? 0);
    });

    setStudentsCounter(counter);
  };

  useEffect(() => {
    countStudents();
  }, [refetch, data]);

  const SettingsButton = () => {
    return (
      <button className="flex items-center justify-center w-10 h-10 rounded-full border bg-white hover:bg-gray-100">
        <img src={settingsIcon} alt="settings" onClick={() => setOpenSettings(true)} />
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full p-4">
      {(isPending || isDeleteAccountPending) && <Loader />}
      <div className="flex items-center gap-4">
        <div>
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="text-gray-500" />
          </div>
        </div>
        <div className="w-[50%]">
          <p className="text-xl font-semibold">{user?.firstName} {user?.lastName}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          {/* <span className="text-green-500 text-sm">online</span> */}
        </div>
      </div>
      <div className="flex items-center justify-between py-4 border-b">
        {user?.role === UserRole.Teacher && (
          <>
            <div className="flex space-x-4">
              <div className="px-4 py-2 border rounded-full text-sm font-medium text-gray-700 bg-white">
                {`${data?.length ?? 0} ${t("teacherPages.profile.classesCount")}`}
              </div>
              <div className="px-4 py-2 border rounded-full text-sm font-medium text-gray-700 bg-white">
                {studentsCounter ?? 0} {t("teacherPages.profile.studentsCount")}
              </div>
            </div>

            <SettingsButton />
          </>
        )}
      </div>

      <ul className="flex flex-col gap-4 mt-2 last:mt-8">
        <li className="flex items-center justify-between">
          <span className="flex items-center">
            <img src={darkModeIcon} alt="darkModeIcon" />
            <span className="ml-4">{t("teacherPages.profile.darkModeText")}</span>
          </span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              disabled={true}
              checked={darkModeOn}
              className="sr-only peer"
              onChange={(e) => setDarkModeOn(e.target.checked)}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
          </label>
        </li>
        <li className="flex items-center">
          <img src={helpIcon} alt="helpIcon" />
          <span className="ml-4">{t("teacherPages.profile.helpText")}</span>
        </li>
        <li className="flex items-center">
          <img src={languageIcon} alt="languageIcon" />
          <span className="ml-4">{t("teacherPages.profile.languageText")}</span>
          <span className="ml-auto capitalize">{language}</span>
        </li>
        <li className="flex items-center">
          <img src={privacyIcon} alt="privacyIcon" />
          <span className="ml-4">{t("teacherPages.profile.privacyPolicyText")}</span>
        </li>
        <li className="flex items-center">
          <img src={termsIcon} alt="termsIcon" />
          <span className="ml-4">{t("teacherPages.profile.termsOfServiceText")}</span>
        </li>
        <li
          className="flex items-center justify-between"
        >
          <button onClick={() => logout()} className="text-red-500 flex items-center">
            <img src={logoutIcon} alt="logoutIcon" />
            <span className="ml-4">{t("teacherPages.profile.logoutText")}</span>
          </button>
        </li>
      </ul>
      
      <div className="pt-5 mt-10 border-t-[1px]">
        <button 
          className="text-red-500 flex items-center gap-4"
          onClick={() => setIsDeleteAccountModalOpen(true)}
        >
          <UserMinus />
          <span>{t("teacherPages.profile.deleteAccountButton")}</span>
        </button>
      </div>

      <BottomNavigation />
      {openSettings && <ProfileSettingsModal isOpen={openSettings} onClose={() => setOpenSettings(false)} user={user!} />}

      <Modal 
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        title={t("teacherPages.profile.deleteAccountModal.title")}
      >
        <div className="mt-2">
          <p className="text-center text-gray-600 text-sm">{t("teacherPages.profile.deleteAccountModal.subTitle")}</p>

          <Button 
            className="w-full mt-5 bg-red-500 text-white"
            onClick={() => user && user.id && deleteAccountMutation(user.id)}
          >
            {t("teacherPages.profile.deleteAccountModal.deleteButton")}
          </Button> 
        </div>
      </Modal>  
    </div>
  );
};

export default ProfilePage;