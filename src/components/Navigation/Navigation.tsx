import React, { useContext } from "react";

import { useTranslation } from "react-i18next";

import { Link, useLocation } from "react-router-dom";

import UserContext from "../../context/UserContext";
import SchoolNamesContext from "../../context/SchoolNamesContext";

interface BottomNavigationProps {
  classRoomId?: string | undefined;
};

export const BottomNavigation: React.FC<BottomNavigationProps> = ( classRoomId ) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { currentSchoolName } = useContext(SchoolNamesContext);
 
  const isActive = (path: string) => location.pathname === path;

  const NAVIGATION_ITEMS = [
    {
      title: t("teacherPages.navigation.classesText"),
      icon: (
        <svg
          width="20"
          height="24"
          viewBox="0 0 20 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          className={`${isActive(`/${currentSchoolName}/classes`) ? "text-[#000000]" : "text-[#ADB5BD]"} w-6 h-6`}
        >
          <path
            d="M1 9.9575C1 5.01069 4.94029 1 9.80019 1C14.6601 1 18.6004 5.01069 18.6004 9.9575C18.6004 14.8658 15.792 20.5947 11.4095 22.6419C10.9058 22.8777 10.3564 23 9.80019 23C9.24399 23 8.69458 22.8777 8.19086 22.6419C3.80836 20.5936 1 14.8669 1 9.9586V9.9575Z"
            strokeWidth="1.5"
          />
          <path
            d="M8.94623 6.09993C9.4978 5.90028 10.1019 5.90028 10.6535 6.09993L13.2297 7.04155C13.7907 7.24616 13.7907 7.95457 13.2297 8.15918L10.6535 9.1008C10.1019 9.30044 9.4978 9.30044 8.94623 9.1008L6.36998 8.15918C5.80897 7.95457 5.80897 7.24616 6.36998 7.04155L8.94623 6.09993Z"
            strokeWidth="1.5"
          />
          <path
            d="M12.5502 8.7002V11.6703C12.5547 11.8786 12.4948 12.0834 12.3787 12.2564C12.2625 12.4295 12.0957 12.5625 11.9012 12.6372C11.3357 12.8451 10.5008 13.1003 9.80011 13.1003C9.09939 13.1003 8.26447 12.8451 7.69906 12.6372C7.50448 12.5625 7.33771 12.4295 7.22154 12.2564C7.10538 12.0834 7.04548 11.8786 7.05005 11.6703V8.7002"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      path: "classes",
    },
    {
      title: "AI",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          className={`${isActive(`/ai`) ? "text-[#000000]" : "text-[#ADB5BD]"} w-6 h-6`}
        >
          <path
            d="M17.8365 3.32422L18.8364 1.20452C18.8634 1.14392 18.9073 1.09245 18.963 1.05633C19.0186 1.0202 19.0835 1.00098 19.1499 1.00098C19.2162 1.00098 19.2811 1.0202 19.3367 1.05633C19.3924 1.09245 19.4364 1.14392 19.4634 1.20452L20.4644 3.32422L22.6996 3.66632C22.9867 3.71032 23.1011 4.07992 22.8943 4.29112L21.2762 5.94112L21.6579 8.27092C21.7063 8.57012 21.406 8.79892 21.1497 8.65702L19.1499 7.55702L17.1501 8.65702C16.8938 8.79782 16.5935 8.57012 16.6419 8.27092L17.0236 5.94112L15.4066 4.29112C15.1976 4.07992 15.3131 3.71032 15.6002 3.66632L17.8365 3.32422Z"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.1 1.055C12.7385 1.01833 12.3718 1 12 1C5.9247 1 1 5.9247 1 12C1 14.0031 1.5357 15.883 2.4718 17.5L1.55 22.45L6.5 21.5282C8.17159 22.4949 10.069 23.0027 12 23C18.0753 23 23 18.0753 23 12C23 11.6282 22.9817 11.2615 22.945 10.9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      path: classRoomId ? `/teacher-assignments/${classRoomId}` : `/classes`,
    },
    {
      title: t("teacherPages.navigation.profileText"),
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          className={`${isActive(`/${currentSchoolName}/profile/${user?.id}`) ? "text-[#000000]" : "text-[#ADB5BD]"} w-6 h-6`}
        >
          <path
            d="M23.1431 18V21.4286C23.1431 21.8833 22.9625 22.3193 22.641 22.6408C22.3195 22.9623 21.8835 23.1429 21.4289 23.1429H18.0003M18.0003 0.857178H21.4289C21.8835 0.857178 22.3195 1.03779 22.641 1.35928C22.9625 1.68077 23.1431 2.11681 23.1431 2.57146V6.00003M0.857422 6.00003V2.57146C0.857422 2.11681 1.03803 1.68077 1.35952 1.35928C1.68102 1.03779 2.11705 0.857178 2.57171 0.857178H6.00028M6.00028 23.1429H2.57171C2.11705 23.1429 1.68102 22.9623 1.35952 22.6408C1.03803 22.3193 0.857422 21.8833 0.857422 21.4286V18M12.0003 11.1429C12.9096 11.1429 13.7817 10.7817 14.4246 10.1387C15.0676 9.49571 15.4289 8.62363 15.4289 7.71432C15.4289 6.80501 15.0676 5.93294 14.4246 5.28995C13.7817 4.64697 12.9096 4.28575 12.0003 4.28575C11.091 4.28575 10.2189 4.64697 9.57591 5.28995C8.93293 5.93294 8.57171 6.80501 8.57171 7.71432C8.57171 8.62363 8.93293 9.49571 9.57591 10.1387C10.2189 10.7817 11.091 11.1429 12.0003 11.1429ZM18.5197 18.8572C18.0766 17.4763 17.2065 16.2719 16.0349 15.4173C14.8632 14.5628 13.4505 14.1023 12.0003 14.1023C10.5501 14.1023 9.13736 14.5628 7.96569 15.4173C6.79403 16.2719 5.92394 17.4763 5.48085 18.8572H18.5197Z"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      path: `profile/${user?.id}`
    }
  ];

  return (
    <div
      className="fixed bottom-[10px] w-[90%] bg-white shadow-lg py-2 rounded-[40px] left-1/2 transform -translate-x-1/2"
    >
      <ul className="flex justify-around items-center">
        {NAVIGATION_ITEMS.map((item, index) => (
          <Link
            key={index}
            to={`/${currentSchoolName}/${item.path}`}
          >
            <li className="flex flex-col gap-2 items-center">
              {item.icon}
              <span className={`${isActive(`/${currentSchoolName}/${item.path}`) ? `text-black` : `text-gray-400`} text-xs`}>{item.title}</span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};