import { useNavigate } from "react-router-dom";
import UserType from "../../assets/icons/user-type-icon.svg";
import { Button, Loader } from "../../components";
import { useContext, useState } from "react";
import UserContext from "../../context/UserContext";
import { useUpdateUser } from "../../hooks/api/users";

export const UserTypeSelectionPage = () => {
  const { user } = useContext(UserContext);
  console.log("user", user);
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate, isPending } = useUpdateUser();

  const onUserTypeSelected = async (userType: string) => {
    await mutate({ id: user?.id as string, role: userType });
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
