import { useContext } from "react";

import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";

import SchoolNamesContext, { School } from "../../context/SchoolNamesContext";

import MapleBearLogo from "../../assets/images/maple-bear-logo.png";
import AdeliaCostaLogo from "../../assets/images/adelia-costa-logo.png";
import SBLogo from "../../assets/images/sb-logo.png";
import EducareLogo from "../../assets/images/educare-logo.png";
import BekaLogo from "../../assets/images/beka-logo.png";
import CincinattiLogo from "../../assets/images/cincinatti-logo.png";

const SCHOOL_LOGOS = {
  [School.AdeliaCosta]: AdeliaCostaLogo,
  [School.SB]: SBLogo,
  [School.Educare]: EducareLogo,
  [School.Beka]: BekaLogo,
  [School.MapleBear]: MapleBearLogo,
  [School.Cincinatti]: CincinattiLogo,
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
      {currentSchoolName === School.MapleBear && (
        <div className="relative flex items-center justify-center min-h-[300px] w-[393px] mt-[50px] maple-bear-logo-box">
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
        <div className="mt-[100px] flex flex-col gap-[80px]">
          <img src={`${SCHOOL_LOGOS[currentSchoolName]}`} className="w-[300px]"/>
        </div>
      )}

      <div className="flex flex-col items-center justify-center mt-auto">
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

        <Link
          to={`/${currentSchoolName}/sign-up`}
          className={`
            ${currentSchoolName === School.Educare ? "bg-white text-main mt-[60px]" : "bg-main text-white mt-[100px]"}
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
    </div>
  );
};
