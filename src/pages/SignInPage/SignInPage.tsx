import { useContext, useState } from "react";

import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";

import Header from "../../components/ui/header/Header";
import { Button, Loader, Input } from "../../components";

import { AuthProvider } from "../api/types";
import { useLogin } from "../../hooks/api/users";

import { GoogleLogin } from "@react-oauth/google";

import { jwtDecode } from "jwt-decode";

import SchoolNamesContext from "../../context/SchoolNamesContext";

import { UserAuthType } from "../../types";

import { toast } from "react-hot-toast";

import GoogleIcon from "../../assets/icons/google-icon.svg";
import FacebookIcon from "../../assets/icons/fb-icon.svg";
import AppleIcon from "../../assets/icons/apple-icon.svg";

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
  const { isPending, mutate } = useLogin();
  const onSocialAuth = (provider: AuthProvider) => {
    alert(`Sign in with ${provider} is not implemented yet`);
  };

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

  const appleSignInHandler = () => {
    const clientId = "com.example.client";
    const redirectURI = "";
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
    <div className="flex flex-col h-screen py-12 bg-bg-color">
      {isPending && <Loader />}
      <Header linkTo="/" title={t("authPages.signIn.headerTitle")} />
      <div className="flex flex-col  mt-12 mx-4">
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
          <div className="flex items-center relative">
            <img
              src={`${GoogleIcon}`}
              alt="google"
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
          <button onClick={appleSignInHandler}>
            <img
              src={`${AppleIcon}`}
              alt="apple"
              onClick={() => onSocialAuth(AuthProvider.Apple)}
            />
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center mt-auto justify-center">
        <p className="text-[14px] text-placholderText font-light mr-1">
          {t("authPages.signIn.bottomText")}
        </p>
        <Link
          to={`/${currentSchoolName}/sign-up`}
          className="text-main text-[16px] font-semibold cursor-pointer"
        >
          {t("authPages.signIn.bottomLinkText")}
        </Link>
      </div>
    </div>
  );
};
