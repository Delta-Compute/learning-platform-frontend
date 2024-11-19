import { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import settingsIcon from "../../assets/icons/settings-icon.svg";
import darkModeIcon from "../../assets/icons/darkmodeLogo.svg";
import helpIcon from "../../assets/icons/helpIcon.svg";
import languageIcon from "../../assets/icons/languageButton.svg";
import privacyIcon from "../../assets/icons/privacyIcon.svg";
import termsIcon from "../../assets/icons/termsIcon.svg";
import logoutIcon from "../../assets/icons/logoutIcon.svg";
import { useParams } from 'react-router-dom';
import { useGetClassesTeacherId } from '../../hooks/api/classes';
import { Loader, ProfileSettingsModal } from '../../components';
import BottomNavigation from '../../components/Navigation/Navigation';
import { useTranslation } from 'react-i18next';

export const ProfilePage = () => {
  const { t } = useTranslation();
  const { userId } = useParams();
  const { user } = useContext(UserContext);
  const [darkModeOn, setDarkModeOn] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const { data, isPending, refetch } = useGetClassesTeacherId(userId as string);

  useEffect(() => {
    refetch()
  }, [userId, refetch]);

  return (
    <div className="flex flex-col h-full p-4">
      {isPending && <Loader />}
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-300" />
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
          {/* <span className="text-green-500 text-sm">online</span> */}
        </div>
      </div>
      <div className="flex items-center justify-between py-4 border-b">
        <div className="flex space-x-4">
          <div className="px-4 py-2 border rounded-full text-sm font-medium text-gray-700">
            {`${data?.length} ${t("teacherPages.profile.classesCount")}`}
          </div>
          <div className="px-4 py-2 border rounded-full text-sm font-medium text-gray-700">
            56 {t("teacherPages.profile.studentsCount")}
          </div>
        </div>
        <button className="flex items-center justify-center w-10 h-10 rounded-full border bg-white hover:bg-gray-100">
          <img src={settingsIcon} alt="settings" onClick={() => setOpenSettings(true)}/>
        </button>
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
          <span className="ml-auto">Eng</span>
        </li>
        <li className="flex items-center">
          <img src={privacyIcon} alt="privacyIcon" />
          <span className="ml-4">{t("teacherPages.profile.privacyPolicyText")}</span>
        </li>
        <li className="flex items-center">
          <img src={termsIcon} alt="termsIcon" />
          <span className="ml-4">{t("teacherPages.profile.termsOfServiceText")}</span>
        </li>
        <li className="flex items-center text-red-500 mt-6">
          <img src={logoutIcon} alt="logoutIcon" />
          <span className="ml-4">{t("teacherPages.profile.logoutText")}</span>
        </li>
      </ul>
      <BottomNavigation />
      {openSettings && <ProfileSettingsModal isOpen={openSettings} onClose={() => setOpenSettings(false)} user={user!}/>}
    </div>
  );
};

export default ProfilePage;