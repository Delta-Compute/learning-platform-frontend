import { ChangeEvent, useContext, useState } from "react";

import { useTranslation } from "react-i18next";

import SchoolNamesContext from "../../context/SchoolNamesContext";

import { UserAuthType } from "../../types";

import { Link } from "react-router-dom";
import Header from "../../components/ui/header/Header";
import { Button, Loader, Input, Modal } from "../../components";

import { useSingUp } from '../../hooks';

import { GoogleLogin } from "@react-oauth/google";
// import { FacebookProvider, LoginButton } from "react-facebook";

// const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;

import { jwtDecode } from "jwt-decode";

import { toast } from "react-hot-toast";

// import GoogleIcon from "../../assets/icons/google-icon.svg";
// import FacebookIcon from "../../assets/icons/fb-icon.svg";
// import AppleIcon from "../../assets/icons/apple-icon.svg";
import AILogo from "../../assets/icons/magic-wand.svg";
import { cn } from '../../utils';

type UserInfo = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const SignUpPage = () => {
  const { t } = useTranslation();
  const [isAiAuthOpen, setIsAiAuthOpen] = useState(false);
  const [emailForAi, setEmailForAi] = useState("");
  const { currentSchoolName } = useContext(SchoolNamesContext);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { isPending, mutate } = useSingUp();

  const onSignUp = async () => {
    await mutate({
      email: userInfo.email,
      password: userInfo.password,
      school: currentSchoolName,
      auth: UserAuthType.Email,
    });
  };

  const googleSignUpSuccessHandler = async (credentialResponse: any) => {
    const user: { email: string } = jwtDecode(credentialResponse?.credential as string);

    await mutate({
      email: user.email,
      password: "",
      school: currentSchoolName,
      auth: UserAuthType.Google,
    });
  };

  const googleSignUpErrorHandler = () => {
    toast.error("Something went wrong");
  };

  const handleOpenAi = () => {
    setIsAiAuthOpen(true);
  };

  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmailForAi(email);

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleAiAuth = async () => {
    if (emailError) {
      return;
    }

    mutate({
      email: emailForAi,
      password: "",
      school: currentSchoolName,
      auth: UserAuthType.AI,
    });
  };

  return (
    <div className="flex flex-col h-[100dvh] py-12 bg-bg-color">
      {isPending && <Loader />}
      <Header linkTo={`${currentSchoolName}/initial`} title={t("authPages.signUp.headerTitle")} />
      <div className="flex flex-col mt-12 w-full px-5 sm:w-[500px] sm:mx-auto sm:mt-10">
        <label className="text-text-color mt-2" htmlFor="email">{t("authPages.signUp.emailLabel")}</label>
        <Input
          id="email"
          placeholder={t("authPages.signUp.emailInputPlaceholder")}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, email: e.target.value }))
          }
          type="email"
          value={userInfo.email}
        />
        <label className="text-text-color mt-2" htmlFor="password">{t("authPages.signUp.passwordLabel")}</label>
        <Input
          id="password"
          placeholder={t("authPages.signUp.passwordInputPlaceholder")}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, password: e.target.value }))
          }
          type="password"
          value={userInfo.password}
          isPassword={true}
        />
        <label className="text-text-color mt-2" htmlFor="confirmPassword">{t("authPages.signUp.confirmPasswordLabel")}</label>
        <Input
          id="confirmPassword"
          placeholder={t("authPages.signUp.confirmPasswordInputPlaceholder")}
          onChange={(e) =>
            setUserInfo((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
          type="password"
          value={userInfo.confirmPassword}
          isPassword={true}
        />
        <Button
          className={`mt-5 bg-primary bg-main text-white`}
          onClick={onSignUp}
        >
          {t("authPages.signUp.submitButton")}
        </Button>
        <div className="flex flex-row mt-4 items-center justify-between">
          <div className="h-[1px] w-5/12 bg-border"></div>
          <p className="text-placholderText text-[14px] font-light">{t("authPages.signUp.orText")}</p>
          <div className="h-[1px] w-5/12 bg-border"></div>
        </div>
        <p className="text-placholderText text-[14px] font-light text-center">
          {t("authPages.signUp.orTitle")}
        </p>

        <div className="flex flex-row justify-center mt-4 gap-4">
          <div>
            {/*<img*/}
            {/*  src={`${GoogleIcon}`}*/}
            {/*  alt="google"*/}
            {/*  className="relative z-10"*/}
            {/*/>*/}
            {/*<div className="absolute left-0 top-0 opacity-1 z-20">*/}
            <GoogleLogin onSuccess={googleSignUpSuccessHandler} onError={googleSignUpErrorHandler} />
            {/*</div>*/}
          </div>
          {/*<div className="flex relative">*/}
          {/*  <img*/}
          {/*    src={`${FacebookIcon}`}*/}
          {/*    alt="facebook"*/}
          {/*  />*/}
          {/*  <div className="w-[49px] h-[48px] absolute left-0 top-0 opacity-1 ">*/}
          {/*    <FacebookProvider appId={facebookAppId}>*/}
          {/*      <LoginButton*/}
          {/*        scope="email"*/}
          {/*        onSuccess={signUpFacebookHandler}*/}
          {/*        style={{ backgroundColor: "red", width: "100%", height: "100%", borderRadius: "100%" }}*/}
          {/*      >*/}
          {/*        login*/}
          {/*      </LoginButton>*/}
          {/*    </FacebookProvider>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<button onClick={appleSignUpHandler}>*/}
          {/*  <img*/}
          {/*    src={`${AppleIcon}`}*/}
          {/*    alt="apple"*/}

          {/*  />*/}
          {/*</button>*/}
          <button onClick={handleOpenAi} className="relative z-30 px-2 py-1 border bg-white rounded-[4px]">
            <img
              src={AILogo}
              alt="aiLogo"
              className="w-[26px] h-[26px]"
            />
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center mt-auto justify-center">
        <p className="text-[14px] text-placholderText font-light mr-1">
          {t("authPages.signUp.bottomText")}
        </p>
        <Link
          to={`/${currentSchoolName}/sign-in`}
          className="text-main text-[16px] font-semibold cursor-pointer"
        >
          {t("authPages.signUp.bottomLinkText")}
        </Link>
      </div>
      <Modal isOpen={isAiAuthOpen} onClose={() => setIsAiAuthOpen(false)}>
        <div className="flex flex-col items-center">
          <h1 className="text-[24px] text-text-color font-semibold mt-4">
            {t("authPages.signUp.aiAuthModalTitle")}
          </h1>
          <Input
            type='email'
            value={emailForAi}
            onChange={(e) => handleChange(e)}
            placeholder={t("authPages.signUp.aiAuthInputPlaceholder")}
            className={cn('w-full mt-4', emailError && 'border-red-500')}
            required
          />
          {emailError && <p className="text-red-500 mt-2">{emailError}</p>}
          <Button
            className="mt-4 bg-main text-white w-full"
            onClick={() => handleAiAuth()}
          >
            {t("authPages.signUp.aiAuthModalButton")}
          </Button>
        </div>
      </ Modal>
    </div>
  );
};
