import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/header/Header";
import { Button, Loader } from "../../components";
import { useState } from "react";
import GoogleIcon from "../../assets/icons/google-icon.svg";
import FacebookIcon from "../../assets/icons/fb-icon.svg";
import AppleIcon from "../../assets/icons/apple-icon.svg";
import { AuthProvider } from "../api/types";
import { useSingUp } from '../../hooks';

type UserInfo = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const SignUpPage = () => {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { isPending, mutate } = useSingUp();

  const onSocialAuth = (provider: AuthProvider) => {
    alert(`Sign up with ${provider} is not implemented yet`);
  };

  const onSignUp = async () => {
    await mutate({
      email: userInfo.email,
      password: userInfo.password,
    });
  };

  const onSignInClick = () => {
    navigate("/sign-in");
  };

  return (
    <div className="flex flex-col h-screen py-12 bg-bg-color">
      {isPending && <Loader />}
      <Header linkTo="/" title={t("authPages.signUp.headerTitle")} />
      <div className="flex flex-col  mt-12 mx-4">
        <h3 className="text-[16px] text-text-color mt-2">{t("authPages.signUp.emailLabel")}</h3>
        <input
          className="border border-border rounded-full p-2 w-full h-14 px-4 mt-1 text-text-color"
          placeholder={t("authPages.signUp.emailInputPlaceholder")}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, email: e.target.value }))
          }
          type="email"
          value={userInfo.email}
        />
        <h3 className="text-[16px] text-text-color mt-2">{t("authPages.signUp.passwordLabel")}</h3>
        <input
          className="border border-border rounded-full p-2 w-full h-14 px-4 mt-1 text-text-color"
          placeholder={t("authPages.signUp.passwordInputPlaceholder")}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, password: e.target.value }))
          }
          type="password"
          value={userInfo.password}
        />
        <h3 className="text-[16px] text-text-color mt-2">{t("authPages.signUp.confirmPasswordLabel")}</h3>
        <input
          className="border border-border rounded-full p-2 w-full h-14 px-4 mt-1 text-text-color"
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
          className={`mt-10 bg-primary bg-main-red text-white`}
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

        <div className="flex flex-row justify-center mt-4">
          <img
            src={`${GoogleIcon}`}
            alt="google"
            className="mr-4"
            onClick={() => onSocialAuth(AuthProvider.Google)}
          />
          <img
            src={`${FacebookIcon}`}
            alt="facebook"
            className="mr-4"
            onClick={() => onSocialAuth(AuthProvider.Facebook)}
          />
          <img
            src={`${AppleIcon}`}
            alt="apple"
            className="mr-4"
            onClick={() => onSocialAuth(AuthProvider.Apple)}
          />
        </div>
      </div>
      <div className="flex flex-row items-center mt-auto justify-center">
        <p className="text-[14px] text-placholderText font-light mr-1">
          {t("authPages.signUp.bottomText")}
        </p>
        <p
          className="text-main-red text-[16px] font-light cursor-pointer"
          onClick={onSignInClick}
        >
          {t("authPages.signUp.bottomLinkText")}
        </p>
      </div>
    </div>
  );
};
