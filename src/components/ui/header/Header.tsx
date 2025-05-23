import { Link } from "react-router-dom";
import LeftArrowIcon from "../../../assets/icons/left-arrow.svg";
import { FC } from "react";

type Props = {
  linkTo: string;
  title: string;
  modal?: JSX.Element;
  noBackButton?: boolean;
};

const Header: FC<Props> = ({ linkTo, title, modal, noBackButton }) => {
  return (
    <div className="p-5 fixed z-30 top-0 w-full bg-bg-color">
      {!noBackButton && (
        <div className="absolute top-[26px] left-p-5">
          <Link to={linkTo}>
            <img src={`${LeftArrowIcon}`} />
          </Link>
        </div>
      )}
      <div className="flex justify-between">
        <h2 className={`${!noBackButton && "ml-8"} text-[24px] truncate max-w-custom`}>{title} </h2>
        {modal ? modal : null}
      </div>
    </div>
  );
};

export default Header;
