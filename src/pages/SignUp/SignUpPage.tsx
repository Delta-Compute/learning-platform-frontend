import { useContext, useState } from "react";

import { useTranslation } from "react-i18next";

import SchoolNamesContext from "../../context/SchoolNamesContext";

import { UserAuthType } from "../../types";

import { Link } from "react-router-dom";
import Header from "../../components/ui/header/Header";
import { Button, Loader, Input } from "../../components";

import { useSingUp } from '../../hooks';

import { GoogleLogin } from "@react-oauth/google";

import { jwtDecode } from "jwt-decode";

import { toast } from "react-hot-toast";

import GoogleIcon from "../../assets/icons/google-icon.svg";
import FacebookIcon from "../../assets/icons/fb-icon.svg";
import AppleIcon from "../../assets/icons/apple-icon.svg";

type UserInfo = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const SignUpPage = () => {
  const { t } = useTranslation();
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

  const appleSignUpHandler = () => {
    const clientId = "com.example.client";
    const redirectURI = `http://localhost:5173/${currentSchoolName}/introducing-with-ai`;
    const scope = "email name";
    const responseType = "code";

    const url = `https://appleid.apple.com/auth/authorize? 
      response_type=${responseType}&
      client_id=${clientId}&
      redirect_uri=${encodeURIComponent(redirectURI)}&
      scope=${scope}`;

    window.location.href = url;
  };

  return (
    <div className="flex flex-col h-[100dvh] py-12 bg-bg-color">
      {isPending && <Loader />}
      <Header linkTo={`${currentSchoolName}/initial`} title={t("authPages.signUp.headerTitle")} />
      <div className="flex flex-col  mt-12 mx-4">
        <h3 className="text-[16px] text-text-color mt-2">{t("authPages.signUp.emailLabel")}</h3>
        <Input
          placeholder={t("authPages.signUp.emailInputPlaceholder")}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, email: e.target.value }))
          }
          type="email"
          value={userInfo.email}
        />
        <h3 className="text-[16px] text-text-color mt-2">{t("authPages.signUp.passwordLabel")}</h3>
        <Input
          placeholder={t("authPages.signUp.passwordInputPlaceholder")}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, password: e.target.value }))
          }
          type="password"
          value={userInfo.password}
        />
        <h3 className="text-[16px] text-text-color mt-2">{t("authPages.signUp.confirmPasswordLabel")}</h3>
        <Input
          placeholder={t("authPages.signUp.confirmPasswordInputPlaceholder")}
          onChange={(e) =>
            setUserInfo((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
          type="password"
          value={userInfo.confirmPassword}
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
          <div className="flex items-center relative">
            <img
              src={`${GoogleIcon}`}
              alt="google"
              className=""
            />
            <div className="w-[40px] absolute left-0 opacity-0">
              <GoogleLogin onSuccess={googleSignUpSuccessHandler} onError={googleSignUpErrorHandler}/>
            </div>
          </div>
          <img
            src={`${FacebookIcon}`}
            alt="facebook"
          />
          <button onClick={appleSignUpHandler}>
            <img
              src={`${AppleIcon}`}
              alt="apple"
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
    </div>
  );
};
