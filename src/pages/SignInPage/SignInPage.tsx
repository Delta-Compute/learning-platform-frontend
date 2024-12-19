import React, { ChangeEvent, useContext, useState } from "react";

import { useTranslation } from "react-i18next";

import { Link, useNavigate } from "react-router-dom";

import Header from "../../components/ui/header/Header";
import { Button, Loader, Input, Modal } from "../../components";

import { useLogin } from "../../hooks/api/users.tsx";
import { useMutation } from "@tanstack/react-query";
import { UsersApiService } from "../../services";

import { GoogleLogin } from "@react-oauth/google";

import { jwtDecode } from "jwt-decode";

import SchoolNamesContext from "../../context/SchoolNamesContext";

import { UserAuthType } from "../../types";

import { toast } from "react-hot-toast";

// import GoogleIcon from "../../assets/icons/google-icon.svg";
// import FacebookIcon from "../../assets/icons/fb-icon.svg";
// import AppleIcon from "../../assets/icons/apple-icon.svg";
import AILogo from "../../assets/icons/magic-wand.svg";
import { cn } from '../../utils';

type UserInfo = {
  email: string;
  password: string;
};

export const SignInPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentSchoolName } = useContext(SchoolNamesContext);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: "",
    password: "",
  });
  const [emailForAi, setEmailForAi] = useState("");

  const [emailError, setEmailError] = useState("");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const { isPending, mutate } = useLogin();

  const [resetEmail, setResetEmail] = useState("");
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);

  const { mutate: resetPasswordMutation, isPending: isResetPasswordPending } = useMutation({
    mutationFn: (data: { email: string }) => UsersApiService.sendResetVerificationCode(data.email, currentSchoolName),
    onSuccess: () => {
      navigate(`/${currentSchoolName}/reset-password`, { state: { recoveryEmail: resetEmail } });
    },
    onError: () => {
      toast.error("Something went wrong! Check what you typing");
    },
  });

  const handleLogin = async () => {
    await mutate({
      email: userInfo.email,
      password: userInfo.password,
      school: currentSchoolName,
      auth: UserAuthType.Email,
    });
  };

  const googleSignInSuccessHandler = async (credentialResponse: any) => {
    const user: { email: string } = jwtDecode(credentialResponse?.credential as string);

    await mutate({
      email: user.email,
      password: "",
      school: currentSchoolName,
      auth: UserAuthType.Google,
    });
  };

  const googleSignInErrorHandler = () => {
    toast.error("Something went wrong");
  };

  const handleOpenAi = () => {
    setIsAiModalOpen(true);
  };

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

  const handleNavigate = () => {
    if (emailError) {
      return;
    }
    navigate(`/${currentSchoolName}/check-data`, { state: { email: emailForAi } });
  };

  const submitResetPasswordHandler = (event: React.FormEvent) => {
    event.preventDefault();


    if (resetEmail === "") return;

    resetPasswordMutation({ email: resetEmail });
  };

  return (
    <div className="flex flex-col h-[100dvh] py-12 bg-bg-color">
      {(isPending || isResetPasswordPending) && <Loader />}
      <Header linkTo="/" title={t("authPages.signIn.headerTitle")} />
      <div className="flex flex-col w-full px-5 sm:w-[500px] sm:mx-auto sm:mt-10">
        <h3 className="text-[16px] text-text-color mt-2">{t("authPages.signIn.emailLabel")}</h3>
        <Input
          placeholder={t("authPages.signIn.emailInputPlaceholder")}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, email: e.target.value }))
          }
          type="email"
          value={userInfo.email}
        />
        <h3 className="text-[16px] text-text-color mt-2">{t("authPages.signIn.passwordLabel")}</h3>
        <Input
          placeholder={t("authPages.signIn.passwordInputPlaceholder")}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, password: e.target.value }))
          }
          type="password"
          value={userInfo.password}
          isPassword={true}
        />
        <Button
          className={`mt-5 bg-primary bg-main text-white`}
          onClick={() => handleLogin()}
        >
          {t("authPages.signIn.submitButton")}
        </Button>
        <div className="flex flex-row mt-4 items-center justify-between">
          <div className="h-[1px] w-5/12 bg-border"></div>
          <p className="text-placholderText text-[14px] font-light">{t("authPages.signIn.orText")}</p>
          <div className="h-[1px] w-5/12 bg-border"></div>
        </div>
        <p className="text-placholderText text-[14px] font-light text-center">
          {t("authPages.signIn.orTitle")}
        </p>

        <div className="flex flex-row justify-center mt-4 gap-4">
          <div>
            <GoogleLogin onSuccess={googleSignInSuccessHandler} onError={googleSignInErrorHandler} />
          </div>
          {/*<img*/}
          {/*  src={`${FacebookIcon}`}*/}
          {/*  alt="facebook"*/}
          {/*/>*/}
          {/*<button onClick={appleSignInHandler}>*/}
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
      <div className="flex flex-col items-center gap-2 mt-auto justify-center">
        <p className="text-[14px] flex flex-row gap-1 items-center text-placholderText font-light mr-1">
          {t("authPages.signIn.bottomText")}
          <Link
            to={`/${currentSchoolName}/sign-up`}
            className="text-main text-[16px] font-semibold cursor-pointer"
          >
            {t("authPages.signIn.bottomLinkText")}
          </Link>
        </p>

        <button
          className="text-main text-sm"
          onClick={() => setResetPasswordModalOpen(true)}
        >
          {t("authPages.resetPassword.resetPasswordButton")}?
        </button>
      </div>
      <Modal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)}>
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-[24px] font-semibold text-center text-[#001434]">
            {t("authPages.signIn.aiAuthModalTitle")}
          </h2>
          <Input
            type='email'
            value={emailForAi}
            onChange={(e) => handleChange(e)}
            placeholder={t("authPages.signIn.aiAuthEmailPlaceholder")}
            className={cn('w-full mt-4', emailError && 'border-red-500')}
            required
          />
          {emailError && <p className="text-red-500 mt-2">{emailError}</p>}

          <Button
            className="mt-4 bg-main text-white w-full"
            onClick={() => handleNavigate()}
          >
            {t("authPages.signIn.aiAuthModalButton")}
          </Button>
        </div>
      </Modal>

      <Modal
        title={t("authPages.resetPassword.modal.title")}
        isOpen={resetPasswordModalOpen}
        onClose={() => setResetPasswordModalOpen(false)}
      >
        <div>
          <form onSubmit={submitResetPasswordHandler} className="flex flex-col mt-[10px] gap-2">
            <Input
              type="email"
              placeholder={t("authPages.resetPassword.modal.emailInputPlaceholder")}
              onChange={(event) => setResetEmail(event.target.value)}
              value={resetEmail}
            />
            <Button className="bg-main text-white w-full">
              {t("authPages.resetPassword.modal.submitButton")}
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};
