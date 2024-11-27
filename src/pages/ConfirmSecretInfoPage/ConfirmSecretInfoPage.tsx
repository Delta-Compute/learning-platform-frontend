import { useContext, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { Input, Loader } from "../../components";

import UserContext from "../../context/UserContext";
import SchoolNamesContext from "../../context/SchoolNamesContext";

import { useUpdateUser } from '../../hooks';

import { useTranslation } from "react-i18next";

import LeftArrowIcon from "../../assets/icons/left-arrow.svg";


const ConfirmSecretInfoPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  console.log(user);

  const { color, number } = location.state as { color: string, number: number };
  const { mutate, isPending } = useUpdateUser();
  const { currentSchoolName } = useContext(SchoolNamesContext);

  const [favouriteColor, setFavouriteColor] = useState(color);
  const [favouriteNumber, setFavouriteNumber] = useState(number);

  const handleOnSubmit = async () => {
    mutate({
      id: user?.id as string,
      secretWords: {
        color: favouriteColor,
        number: favouriteNumber,
      }
    },
      {
        onSuccess: () => {
          if (user?.role === "teacher") {
            navigate(`/${currentSchoolName}/classes`);
          }

          if (user?.role === "student") {
            navigate(`/${currentSchoolName}/student-assignments`);
          }
        }
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {isPending && <Loader />}
      <div className="fixed z-[1] top-0 w-full bg-white pt-4 pb-[5px] flex justify-center items-center">
        <div className="absolute left-4 top-[22px]">
          <Link to={`/${currentSchoolName}/secret-info-ai`}>
            <img src={LeftArrowIcon} alt="Back" className="w-6 h-6" />
          </Link>
        </div>
        <h2 className="text-center text-[24px] font-semibold text-[#524344] max-w-[190px]">
          {t("authPages.joinYourSchool.headerTitle")}
        </h2>
      </div>

      <div className="flex flex-col flex-grow min-h-0 mt-20 p-4 max-w-md mx-auto w-full space-y-4">
        <div className="flex flex-col flex-grow min-h-0 space-y-4">
          <div>
            <label className="block text-sm font-normal mb-2">
              {t("authPages.joinYourSchool.favouriteColorLabel")}
            </label>
            <Input
              type="text"
              className="w-full"
              placeholder={t("authPages.joinYourSchool.favouriteColorPlaceholder")}
              value={favouriteColor}
              onChange={(e) => setFavouriteColor(e.target.value.trim())}
            />
          </div>

          <div>
            <label className="block text-sm font-normal mb-2">
              {t("authPages.joinYourSchool.favouriteNumberLabel")}
            </label>
            <Input
              type="text"
              className="w-full"
              placeholder={t("authPages.joinYourSchool.favouriteNumberPlaceholder")}
              value={favouriteNumber}
              onChange={(e) => setFavouriteNumber(e.target.value.trim())}
            />
          </div>
        </div>

        <button
          onClick={() => handleOnSubmit()}
          className="w-full bg-main text-white rounded-[40px] font-medium p-[16px] focus:outline-none focus:ring-2"
        >
          {t("authPages.joinYourSchool.submitButton")}
        </button>
      </div>
    </div>
  );
};

export default ConfirmSecretInfoPage;
