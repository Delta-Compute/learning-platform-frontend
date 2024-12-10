import React, { useContext, useState } from "react";

import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import { UsersApiService } from "../../services";

import { Button, Input, Loader } from "../../components";
import Header from "../../components/ui/header/Header";

import SchoolNamesContext from "../../context/SchoolNamesContext";

export const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const { currentSchoolName } = useContext(SchoolNamesContext);

  const [formData, setFormData] = useState({
    email: "",
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
  });

  const changeInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const name = event.target.name;

    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    updatePasswordMutation({ ...formData });
  };

  return (
    <div>
      {isResetPasswordPending && <Loader />}
      <Header linkTo={`/${currentSchoolName}/sign-in`} title={t("authPages.resetPassword.headerTitle")} />
      <div className="px-5 py-[80px] h-[100dvh] bg-bg-color">
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-2"
        >
          <div>
            <label htmlFor="email">{t("authPages.resetPassword.form.emailLabel")}</label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder={t("authPages.resetPassword.form.emailInputPlaceholder")}
              value={formData.email}
              onChange={changeInputHandler}
            />
          </div>
          <div>
            <label htmlFor="newPassword">{t("authPages.resetPassword.form.newPasswordLabel")}</label>
            <Input
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder={t("authPages.resetPassword.form.newPasswordInputPlaceholder")}
              value={formData.newPassword}
              onChange={changeInputHandler}
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

        <Link className="mt-4 block text-main" to={`/${currentSchoolName}/sign-in`}>{t("authPages.resetPassword.returnToSignInLinkText")}</Link>
      </div>
    </div>
  );
};