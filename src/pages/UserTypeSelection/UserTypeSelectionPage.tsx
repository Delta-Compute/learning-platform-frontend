import { useNavigate } from "react-router-dom";
import UserType from "../../assets/icons/user-type-icon.svg";
import { Button, Loader } from "../../components";
import { useContext, useState } from "react";
import { updateUser } from "../../services/api/auth";
import UserContext from "../../context/UserContext";

export const UserTypeSelectionPage = () => {
  const user = useContext(UserContext).user;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onUserTypeSelected = async (userType: string) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await updateUser(user?.id as string, { role: userType });
    } catch (error) {
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center  py-12">
      {isLoading && <Loader />}
      <img src={`${UserType}`} alt="microphone" className="mt-24" />
      <div className="flex flex-col items-center justify-center mt-auto">
        <Button
          className={`w-[360px] bg-main-red text-white`}
          onClick={() => onUserTypeSelected("student")}
        >
          I am a student
        </Button>
        <Button
          className={`w-[360px] mt-2 bg-primary text-main-red border-[1px] border-main-red`}
          onClick={() => onUserTypeSelected("teacher")}
        >
          I am a teacher
        </Button>
      </div>
    </div>
  );
};
