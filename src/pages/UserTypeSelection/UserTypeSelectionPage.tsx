import { useNavigate } from "react-router-dom";
import UserType from "../../assets/icons/user-type-icon.svg";
import { Button } from "../../components";

export const UserTypeSelectionPage = () => {
  const navigate = useNavigate();

  const onUserTypeSelected = (userType: string) => {
    alert(`User type selected: ${userType}`);
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center  py-12">
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
