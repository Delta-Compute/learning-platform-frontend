import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/header/Header";
import FollowLinkIcon from "../../assets/icons/follow-link-icon.svg";

export const FollowLinkPage = () => {
  const navigate = useNavigate();

  // TODO: get user email from the store
  const userEmail = "something@email.com";

  const onSendAgain = () => {
    alert("Send again is not implemented yet");
  };

  return (
    <div className="flex flex-col h-screen py-12 bg-bg-color px-4">
      <Header linkTo="/" title="Follow the link" />
      <p className="text-[18px] text-placholderText font-light mt-12 text-center">
        A message with a link to confirm registration has been sent to your
        email address: {userEmail}
      </p>
      <img src={`${FollowLinkIcon}`} alt="microphone" className="mt-8" />
      <p
        className="text-[16px] text-main-red font-light  text-center"
        onClick={onSendAgain}
      >
        Send again
      </p>
    </div>
  );
};
