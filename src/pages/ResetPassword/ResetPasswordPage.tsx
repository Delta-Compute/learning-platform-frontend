import React, { useContext, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import { UsersApiService } from "../../services";

import { Button, Input, Loader } from "../../components";
import Header from "../../components/ui/header/Header";

import SchoolNamesContext from "../../context/SchoolNamesContext";

import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

export const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const { currentSchoolName } = useContext(SchoolNamesContext);

  const navigate = useNavigate();
  const location = useLocation();
  const recoveryEmail = location.state?.recoveryEmail || null;

  let resendEmailCounter = 10; 

  useEffect(() => {
    if (!recoveryEmail) navigate(`/${currentSchoolName}/initial`);
  }, [recoveryEmail]);

  const [formData, setFormData] = useState({
    newPassword: "",
    code: "",
  });

  const { mutate: updatePasswordMutation, isPending: isResetPasswordPending } = useMutation({
    mutationFn: (data: { email: string, newPassword: string, code: string }) => UsersApiService.resetPassword(
      data.email,
      data.newPassword,
      data.code,
      currentSchoolName,
    ),
    onSuccess: () => {
      navigate(`/${currentSchoolName}/sign-in`);
      toast.success(t("authPages.resetPassword.form.successText"));
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";

      toast.error(errorMessage);
    }
  });

  // const { mutate: sendEmailForVerificationCode, isPending } = useMutation({
  //   mutationFn: (email: string) => UsersApiService.sendResetVerificationCode(email, currentSchoolName),
  //   onSuccess: () => {

  //   }
  // });

  const changeInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const name = event.target.name;

    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    updatePasswordMutation({ ...formData, email: recoveryEmail });
  };

  return (
    <div>
      {isResetPasswordPending && <Loader />}

      <Header linkTo={`/${currentSchoolName}/sign-in`} title={t("authPages.resetPassword.headerTitle")} />

      <div className="px-5 py-[80px] h-[100dvh] bg-bg-color sm:w-[500px] sm:mx-auto sm:mt-10">
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-2"
        >
          <div>
            <label htmlFor="newPassword">{t("authPages.resetPassword.form.newPasswordLabel")}</label>
            <Input
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder={t("authPages.resetPassword.form.newPasswordInputPlaceholder")}
              value={formData.newPassword}
              onChange={changeInputHandler}
              isPassword={true}
            />
          </div>
          <div>
            <label htmlFor="code">{t("authPages.resetPassword.form.codeLabel")}</label>
            <Input
              id="code"
              type="text"
              name="code"
              placeholder={t("authPages.resetPassword.form.codeInputPlaceholder")}
              value={formData.code}
              onChange={changeInputHandler}
            />
          </div>
          <Button className="bg-main text-white mt-2">{t("authPages.resetPassword.form.submitButton")}</Button>
        </form>

        <div className="mt-4">
          <Button
            disabled={resendEmailCounter === 0}
            className="w-full bg-white disabled:opacity-70"
          >
            <span>Resend verification code</span>
          </Button>
          {resendEmailCounter !== 0 && <p className="text-sm mt-2 text-gray-500">You can get other code after: {resendEmailCounter}s</p>}
        </div>

        <Link 
          className="mt-4 flex items-center gap-1 text-main" 
          to={`/${currentSchoolName}/sign-in`}
        >
          <span>
            <ChevronLeft size={16} />
          </span>
          <span>{t("authPages.resetPassword.returnToSignInLinkText")}</span>
        </Link>
      </div>
    </div>
  );
};