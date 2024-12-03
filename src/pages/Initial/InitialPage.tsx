import { useContext } from "react";

import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";

import SchoolNamesContext, { School } from "../../context/SchoolNamesContext";
import { SCHOOL_LOGOS } from "./data/school-logos";

export const InitialPage = () => {
  const { t } = useTranslation();
  const { currentSchoolName } = useContext(SchoolNamesContext);

  return (
    <div
      className={`
        ${currentSchoolName === School.Educare && "bg-main"}
        h-[100dvh] flex flex-col justify-between pb-4
      `}
    >
      {currentSchoolName === School.MapleBear && (
        <div className="relative flex items-center justify-center min-h-[300px] m-auto w-[393px] mt-[70px] maple-bear-logo-box">
          <h3 className="text-[24px] mt-[40px] text-main font-normal">
            Maple Bear
          </h3>
          <img
            src={`${SCHOOL_LOGOS[currentSchoolName]}`}
            className="absolute left-0 top-0 w-full h-full"
          />
        </div>
      )}

      {currentSchoolName !== School.MapleBear && (
        <div className="mt-[100px] flex items-center justify-center gap-[80px]">
          <img src={`${SCHOOL_LOGOS[currentSchoolName]}`} className="w-[300px]"/>
        </div>
      )}

      <div className="flex flex-col gap-10 items-center justify-center mt-auto">
        <p
          className={`
            ${currentSchoolName === School.Educare && "text-white"}
            text-5xl font-handwriting text-brownText text-center
          `}
          style={{
            fontFamily: "Edu AU VIC WA NT Guides",
          }}
        >
          {t("authPages.initial.title")}
        </p>

        <div className="flex flex-col gap-2 items-center justify-center w-full px-3">
          <Link
            to={`/${currentSchoolName}/sign-up`}
            className={`
              ${currentSchoolName === School.Educare ? "bg-white text-main" : "bg-main text-white"}
              w-[360px] py-4 rounded-full text-center
            `}
          >
            {t("authPages.initial.signUpButton")}
          </Link>

          <Link
            className={`
              ${currentSchoolName === School.Educare ? "bg-main text-white border-white" : "bg-white text-main border-main"}
              rounded-full text-center p-3 border-[1px] w-full
            `}
            to={`/${currentSchoolName}/sign-in`}
          >
            {t("authPages.initial.signInButton")}
          </Link>
        </div>
      </div>
    </div>
  );
};
