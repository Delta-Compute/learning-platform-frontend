import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import Onboarding from "../../assets/icons/onboarding.svg";
import { Button } from "../../components";

export const InitialPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center h-screen justify-center  py-12">
      <h3 className="text-[24px] text-main-red font-normal absolute top-1/3">
        Maple Bear
      </h3>
      <h1
        className="text-5xl font-handwriting text-brownText text-center absolute top-2/3"
        style={{
          fontFamily: "Edu AU VIC WA NT Guides",
        }}
      >
        {t("authPages.initial.title")}
      </h1>
      <div className="flex flex-col items-center justify-center mt-auto">
        <Button
          className={`w-[360px] bg-main-red text-white`}
          onClick={() => navigate("/sign-up")}
        >
          {t("authPages.initial.signUpButton")}
        </Button>
        <Button
          className={`w-[360px] mt-2 bg-primary text-main-red border-[1px] border-main-red`}
          onClick={() => navigate("/sign-in")}
        >
          {t("authPages.initial.signInButton")}
        </Button>
      </div>
      <img
        src={`${Onboarding}`}
        alt="microphone"
        className="absolute top-0 h-full w-full -z-10"
      />
    </div>
  );
};
