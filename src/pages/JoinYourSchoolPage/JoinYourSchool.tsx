import { useContext, useEffect, useRef, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { Input, Loader, SchoolSearchAutocomplete } from "../../components";

import UserContext from "../../context/UserContext";
import SchoolNamesContext from "../../context/SchoolNamesContext";

import { useUpdateUser } from '../../hooks';

import { useTranslation } from "react-i18next";

import LeftArrowIcon from "../../assets/icons/left-arrow.svg";

import { School } from "../../components";

const JoinYourSchoolPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  const { firstName, lastName, natureLanguage, foreingLanguage, role } = location.state as { firstName: string, lastName: string, natureLanguage: string, foreingLanguage: string, role: string };
  const { mutate, isPending } = useUpdateUser();
  const { currentSchoolName } = useContext(SchoolNamesContext);

  const [natureLanguageUpdate, setNatureLanguageUpdate] = useState(natureLanguage);
  const [foreignLanguageUpdate, setForeignLanguageUpdate] = useState(foreingLanguage);
  const [selectedRole, setSelectedRole] = useState(role === "Teacher" || role === "Student" ? role : "Student");
  const [firstNameUpdate, setFirstNameUpdate] = useState(firstName);
  const [lastNameUpdate, setLastNameUpdate] = useState(lastName);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOnSubmit = async () => {
    await mutate({
      id: user?.id as string,
      firstName: firstNameUpdate,
      lastName: lastNameUpdate,
      role: selectedRole.toLowerCase(),
      natureLanguage: natureLanguageUpdate,
      foreignLanguage: foreignLanguageUpdate,
      schoolName: selectedSchool?.name ?? "",
    },
      {
        onSuccess: () => {
          navigate(`/${currentSchoolName}/secret-info-ai`);
        }
      });
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {isPending && <Loader />}
      <div className="fixed z-[1] top-0 w-full bg-white pt-4 pb-[5px] flex justify-center items-center">
        <div className="absolute left-4 top-[22px]">
          <Link to={`/${currentSchoolName}/teacher-tasks`}>
            <img src={LeftArrowIcon} alt="Back" className="w-6 h-6" />
          </Link>
        </div>
        <h2 className="text-center text-[24px] font-semibold text-[#524344] max-w-[200px] text-wrap">
          {t("authPages.joinYourSchool.headerTitle")}
        </h2>
      </div>

      <div className="flex flex-col flex-grow min-h-0 mt-20 p-4 max-w-md mx-auto w-full space-y-4">
        <div className="flex flex-col flex-grow min-h-0 space-y-4">
          <div className=''>
            <label>{t("authPages.joinYourSchool.selectSchoolLabel")}</label>

            <SchoolSearchAutocomplete
              schoolName={schoolName}
              setSchoolName={setSchoolName}
              onSelectSchool={(value) => setSelectedSchool(value)}
            />
          </div>

          <div>
            <label className="block text-sm font-normal mb-2">
              {t("authPages.joinYourSchool.firstNameLabel")}
            </label>
            <Input
              type="text"
              className="w-full"
              placeholder={t("authPages.joinYourSchool.firstNameInputPlaceholder")}
              value={firstNameUpdate}
              onChange={(e) => setFirstNameUpdate(e.target.value.trim())}
            />
          </div>

          <div>
            <label className="block text-sm font-normal mb-2">
              {t("authPages.joinYourSchool.lastNameLabel")}
            </label>
            <Input
              type="text"
              className="w-full"
              placeholder={t("authPages.joinYourSchool.lastNameInputPlaceholder")}
              value={lastNameUpdate}
              onChange={(e) => setLastNameUpdate(e.target.value.trim())}
            />
          </div>

          <div>
            <label className="block text-sm font-normal mb-2">
              {t("authPages.joinYourSchool.natureLanguageLabel")}
            </label>
            <Input
              type="text"
              className="w-full"
              placeholder={t("authPages.joinYourSchool.natureLanguagePlaceholder")}
              value={natureLanguageUpdate}
              onChange={(e) => setNatureLanguageUpdate(e.target.value.trim())}
            />
          </div>

          <div>
            <label className="block text-sm font-normal mb-2">
              {t("authPages.joinYourSchool.foreingLanguageLabel")}
            </label>
            <Input
              type="text"
              className="w-full"
              placeholder={t("authPages.joinYourSchool.foreingLanguagePlaceholder")}
              value={foreignLanguageUpdate}
              onChange={(e) => setForeignLanguageUpdate(e.target.value.trim())}
            />
          </div>

          <div>
            <label
              htmlFor="roleDropdown"
              className="block text-sm font-normal mb-2"
            >
              {t("authPages.joinYourSchool.roleLabel")}
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                id="roleDropdown"
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex justify-start border-[1px] px-4 py-3 rounded-full focus:border-main w-full"
              >
                {selectedRole || t("authPages.joinYourSchool.rolePlaceholder")}
              </button>

              {isDropdownOpen && (
                <ul className="absolute z-10 w-full bg-white border-[0.5px] rounded-[16px] mt-2 shadow-lg">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-[8px]"
                    onClick={() => handleRoleChange("Student")}
                  >
                    Student
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-[8px]"
                    onClick={() => handleRoleChange("Teacher")}
                  >
                    Teacher
                  </li>
                </ul>
              )}
            </div>
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

export default JoinYourSchoolPage;
