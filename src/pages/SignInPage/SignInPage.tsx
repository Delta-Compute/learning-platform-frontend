import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/header/Header";
import { Button, Loader } from "../../components";
import {useContext, useState} from "react";
import GoogleIcon from "../../assets/icons/google-icon.svg";
import FacebookIcon from "../../assets/icons/fb-icon.svg";
import AppleIcon from "../../assets/icons/apple-icon.svg";
import { AuthProvider } from "../api/types";
import { useLogin } from "../../hooks/api/users";

import { GoogleLogin } from "@react-oauth/google";

import { jwtDecode } from "jwt-decode";

import SchoolNamesContext from "../../context/SchoolNamesContext";

import { UserAuthType } from "../../types";

type UserInfo = {
  email: string;
  password: string;
};

export const SignInPage = () => {
  const { t } = useTranslation();
  const { currentSchoolName } = useContext(SchoolNamesContext);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { isPending, mutate } = useLogin();
  const onSocialAuth = (provider: AuthProvider) => {
    alert(`Sign in with ${provider} is not implemented yet`);
  };

  const onSignUpClick = () => {
    navigate(`/${currentSchoolName}/sign-up`);
  };

  const handleLogin = async () => {
    await mutate({
      email: userInfo.email,
      password: userInfo.password,
      school: currentSchoolName,
      auth: UserAuthType.Email,
    });
  };

  const googleSignInSuccessHandler = async (credentialResponse: unknown) => {
    const user: { email: string } = jwtDecode(credentialResponse.credential as string);

    await mutate({
      email: user.email,
      password: "",
      school: currentSchoolName,
      auth: UserAuthType.Google,
    });
  };

  const googleSignInErrorHandler = () => {
    console.error('Помилка авторизації Google');
  };

  return (
    <div className="flex flex-col h-screen py-12 bg-bg-color">
      {isPending && <Loader />}
      <Header linkTo="/" title={t("authPages.signIn.headerTitle")} />
      <div className="flex flex-col  mt-12 mx-4">
        <h3 className="text-[16px] text-text-color mt-2">{t("authPages.signIn.emailLabel")}</h3>
        <input
          className="border border-border rounded-full p-2 w-full h-14 px-4 mt-1 text-text-color"
          placeholder={t("authPages.signIn.emailInputPlaceholder")}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, email: e.target.value }))
          }
          type="email"
          value={userInfo.email}
        />
        <h3 className="text-[16px] text-text-color mt-2">{t("authPages.signIn.passwordLabel")}</h3>
        <input
          className="border border-border rounded-full p-2 w-full h-14 px-4 mt-1 text-text-color"
          placeholder={t("authPages.signIn.passwordInputPlaceholder")}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, password: e.target.value }))
          }
          type="password"
          value={userInfo.password}
        />
        <Button
          className={`mt-10 bg-primary bg-main text-white`}
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
          <div className="flex items-center relative">
            <img
              src={`${GoogleIcon}`}
              alt="google"
              className=""
            />
            <div className="w-[40px] absolute left-0 opacity-0">
              <GoogleLogin onSuccess={googleSignInSuccessHandler} onError={googleSignInErrorHandler} />
            </div>
          </div>
          <img
            src={`${FacebookIcon}`}
            alt="facebook"
            onClick={() => onSocialAuth(AuthProvider.Facebook)}
          />
          <img
            src={`${AppleIcon}`}
            alt="apple"
            onClick={() => onSocialAuth(AuthProvider.Apple)}
          />
        </div>
      </div>
      <div className="flex flex-row items-center mt-auto justify-center">
        <p className="text-[14px] text-placholderText font-light mr-1">
          {t("authPages.signIn.bottomText")}
        </p>
        <p
          className="text-main text-[16px] font-light cursor-pointer"
          onClick={onSignUpClick}
        >
          {t("authPages.signIn.bottomLinkText")}
        </p>
      </div>
    </div>
  );
};
