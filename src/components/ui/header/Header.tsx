import { Link } from "react-router-dom";
import LeftArrowIcon from "../../../assets/icons/left-arrow.svg";
import { FC } from "react";

type Props = {
  linkTo: string;
  title: string;
};

const Header: FC<Props> = ({ linkTo, title }) => {
  return (
    <div className="p-5 fixed z-30 top-0 w-full bg-[#FBF9F9]">
      <div className="absolute top-[26px] left-p-5">
        <Link to={linkTo}>
          <img src={`${LeftArrowIcon}`} />
        </Link>
      </div>
      <h2 className="text-center text-[24px] text-text-color text-wrap">{title} </h2>
    </div>
  );
};

export default Header;
