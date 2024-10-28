import { useNavigate } from "react-router-dom";
import HiringIcon from "../../assets/icons/hiring-icon.svg";
import { Button } from "../../components";

export const InitialPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center h-screen justify-center  py-12">
      <img src={`${HiringIcon}`} alt="microphone" className="mt-24" />
      <div className="flex flex-col items-center justify-center mt-auto">
        <Button
          className={`w-[360px] bg-main-red text-white`}
          onClick={() => navigate("/sign-up")}
        >
          Sign up
        </Button>
        <Button
          className={`w-[360px] mt-2 bg-primary text-main-red border-[1px] border-main-red`}
          onClick={() => console.log("sign in clicked")}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
};
