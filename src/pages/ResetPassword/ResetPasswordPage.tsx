import React, { useContext, useState } from "react";

import { Link } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import { UsersApiService } from "../../services";

import { Button, Input, Loader } from "../../components";
import Header from "../../components/ui/header/Header";

import SchoolNamesContext from "../../context/SchoolNamesContext";

export const ResetPasswordPage = () => {
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
      <Header linkTo={`/${currentSchoolName}/sign-in`} title="Password " />
      <div className="px-5 py-[80px] h-[100dvh] bg-bg-color">
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-2"
        >
          <div>
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={changeInputHandler}
            />
          </div>
          <div>
            <label htmlFor="newPassword">New password</label>
            <Input
              id="newPassword"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={changeInputHandler}
            />
          </div>
          <div>
            <label htmlFor="code">Verification code</label>
            <Input
              id="code"
              type="text"
              name="code"
              value={formData.code}
              onChange={changeInputHandler}
            />
          </div>
          <Button className="bg-main text-white mt-2">Save</Button>
        </form>

        <Link className="mt-4 block text-main" to={`/${currentSchoolName}/sign-in`}>Return to sign in</Link>
      </div>
    </div>
  );
};