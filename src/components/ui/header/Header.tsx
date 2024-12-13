import { Link } from "react-router-dom";
import LeftArrowIcon from "../../../assets/icons/left-arrow.svg";
import { FC } from "react";
import { cn } from '../../../utils';

type Props = {
  linkTo: string;
  title: string;
  modal?: JSX.Element;
  noBackButton?: boolean;
};

const Header: FC<Props> = ({ linkTo, title, modal, noBackButton }) => {
  return (
    <div className="p-5 fixed z-30 top-0 w-full bg-white border-b">
      {!noBackButton && (
        <div className="absolute top-[26px] left-p-5">
          <Link to={linkTo}>
            <img src={`${LeftArrowIcon}`} />
          </Link>
        </div>
      )}
      <div className={cn("flex justify-between", modal ? "max-w-custom" : "w-full")}>
        <h2 className="text-left ml-8 text-[24px] text-text-color truncate max-w-custom">{title} </h2>
        {modal ? modal : null}
      </div>
    </div>
  );
};

export default Header;
