import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import { Button, Loader } from "../../components";
import { useContext } from "react";

import UserContext from "../../context/UserContext";
import SchoolNamesContext from "../../context/SchoolNamesContext";

import { useUpdateUser } from "../../hooks/api/users.tsx";

import UserType from "../../assets/icons/user-type-icon.svg";

export const UserTypeSelectionPage = () => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { currentSchoolName } = useContext(SchoolNamesContext);

  const { mutate, isPending } = useUpdateUser();

  const onUserTypeSelected = async (userType: string) => {
    await mutate(
      { id: user?.id as string, role: userType },
      {
        onSuccess: () => {
          navigate(`/${currentSchoolName}/join-your-school`);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center py-12">
      {isPending && <Loader />}
      <img src={`${UserType}`} alt="microphone" className="mt-24" />
      <div className="flex flex-col items-center justify-center mt-auto">
        <Button
          className={`w-[360px] bg-main text-white`}
          onClick={() => onUserTypeSelected("student")}
        >
          {t("authPages.userTypeSelection.iAmStudentButton")}
        </Button>
        <Button
          className={`w-[360px] mt-2 bg-primary text-main border-[1px] border-main`}
          onClick={() => onUserTypeSelected("teacher")}
        >
          {t("authPages.userTypeSelection.iAmTeacherButton")}
        </Button>
      </div>
    </div>
  );
};
