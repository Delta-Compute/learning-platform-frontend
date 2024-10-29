import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/header/Header";
import Input from "../../components/ui/input/Input";
import { Button, Loader } from "../../components";
import { useState } from "react";
import GoogleIcon from "../../assets/icons/google-icon.svg";
import FacebookIcon from "../../assets/icons/fb-icon.svg";
import AppleIcon from "../../assets/icons/apple-icon.svg";
import { AuthProvider } from "../api/types";
import { useLogin } from "../../hooks/api/users"


type UserInfo = {
  email: string;
  password: string;
};

export const SignInPage = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { isPending, mutate, isSuccess } = useLogin();

  const onSocialAuth = (provider: AuthProvider) => {
    alert(`Sign in with ${provider} is not implemented yet`);
  };

  const onSignUpClick = () => {
    navigate("/sign-up");
  };

  const handleLogin = async () => {
    await mutate({
      email: userInfo.email,
      password: userInfo.password,
    });

    if(isSuccess) {
      navigate("/user-type-selection");
    }
  };

  return (
    <div className="flex flex-col h-screen py-12 bg-bg-color">
      {isPending && <Loader />}
      <Header linkTo="/" title="Sign In" />
      <div className="flex flex-col  mt-12 mx-4">
        <h3 className="text-[16px] text-text-color mt-2">E-mail</h3>
        <Input
          placeholder="Email"
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, email: e.target.value }))
          }
          type="email"
          value={userInfo.email}
          additionalClasses="mt-1 text-text-color"
        />
        <h3 className="text-[16px] text-text-color mt-2">Password</h3>
        <Input
          placeholder="Create a password"
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, password: e.target.value }))
          }
          type="password"
          value={userInfo.password}
          additionalClasses="mt-1 text-text-color"
        />
        <Button
          className={`mt-10 bg-primary bg-main-red text-white`}
          onClick={() => handleLogin()}
        >
          Sign in
        </Button>
        <div className="flex flex-row mt-4 items-center justify-between">
          <div className="h-[1px] w-5/12 bg-border"></div>
          <p className="text-placholderText text-[14px] font-light">or</p>
          <div className="h-[1px] w-5/12 bg-border"></div>
        </div>
        <p className="text-placholderText text-[14px] font-light text-center">
          sign in through
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
          Don't have an account?
        </p>
        <p
          className="text-main-red text-[16px] font-light cursor-pointer"
          onClick={onSignUpClick}
        >
          Sign up
        </p>
      </div>
    </div>
  );
};
