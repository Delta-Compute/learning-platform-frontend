import { useTranslation } from "react-i18next";

import UserType from "../../assets/icons/user-type-icon.svg";
import { Button, Loader } from "../../components";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import { useUpdateUser } from "../../hooks/api/users";
import { useNavigate } from 'react-router-dom';

export const UserTypeSelectionPage = () => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const { mutate, isPending } = useUpdateUser();

  const onUserTypeSelected = async (userType: string) => {
    await mutate(
      { id: user?.id as string, role: userType },
      {
        onSuccess: () => {
          navigate('/join-your-school');
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
          className={`w-[360px] bg-main-red text-white`}
          onClick={() => onUserTypeSelected("student")}
        >
          {t("authPages.userTypeSelection.iAmStudentButton")}
        </Button>
        <Button
          className={`w-[360px] mt-2 bg-primary text-main-red border-[1px] border-main-red`}
          onClick={() => onUserTypeSelected("teacher")}
        >
          {t("authPages.userTypeSelection.iAmTeacherButton")}
        </Button>
      </div>
    </div>
  );
};
