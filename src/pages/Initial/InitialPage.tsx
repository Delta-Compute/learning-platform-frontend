import { useContext } from "react";

import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";

import SchoolNamesContext, { School } from "../../context/SchoolNamesContext";

import Onboarding from "../../assets/icons/onboarding.svg";
import AdeliaCostaLogo from "../../assets/images/adelia-costa-logo.png";
import SBLogo from "../../assets/images/sb-logo.png";
import EducareLogo from "../../assets/images/educare-logo.png";
import BekaLogo from "../../assets/images/beka-logo.png";

const SCHOOL_LOGOS = {
  [School.AdeliaCosta]: AdeliaCostaLogo,
  [School.SB]: SBLogo,
  [School.Educare]: EducareLogo,
  [School.Beka]: BekaLogo,
};

export const InitialPage = () => {
  const { t } = useTranslation();
  const { currentSchoolName } = useContext(SchoolNamesContext);

  return (
    <div
      className={`
        ${currentSchoolName === School.Educare && "bg-main"}
        flex flex-col items-center h-screen justify-center 
        py-12 
      `}
    >
      {currentSchoolName === School.MappleBear && (
        <h3 className="text-[24px] text-main font-normal absolute top-1/3">
          Maple Bear
        </h3>
      )}

      {currentSchoolName !== School.MappleBear ? (
        <div className="mt-[100px] flex flex-col gap-[80px]">
          <img src={`${SCHOOL_LOGOS[currentSchoolName]}`} className="w-[280px] h-[220px]"/>

          <h1
            className={`
              ${currentSchoolName === School.Educare && "text-white"}
              text-5xl font-handwriting text-brownText text-center
            `}
            style={{
              fontFamily: "Edu AU VIC WA NT Guides",
            }}
          >
            {t("authPages.initial.title")}
          </h1>
        </div>
      ) : (
        <h1
          className={`
            text-brownText text-5xl font-handwriting text-center absolute top-2/3
          `}
          style={{
            fontFamily: "Edu AU VIC WA NT Guides",
          }}
        >
          {t("authPages.initial.title")}
        </h1>
      )}

      <div className="flex flex-col items-center justify-center mt-auto">
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
            w-[360px] mt-2 bg-primary border-[1px] py-4 rounded-full text-center
          `}
          to={`/${currentSchoolName}/sign-in`}
        >
          {t("authPages.initial.signInButton")}
        </Link>
      </div>
      {currentSchoolName === School.MappleBear && <img
        src={`${Onboarding}`}
        alt="microphone"
        className="absolute top-0 left-0 h-full w-full -z-10"
      />}
    </div>
  );
};
