import { useContext, useState, memo } from "react";

import { useTranslation } from "react-i18next";

import SchoolNamesContext from "../../context/SchoolNamesContext";

import { useGetClassesTeacherId } from '../../hooks/api/classes';
import UserContext from '../../context/UserContext';
import { Class } from "../../types/class";

import { Loader, CreateClassModal, BottomNavigation } from "../../components";

import { useNavigate, Link } from "react-router-dom";

import plus from "../../assets/icons/plus-icon.svg";
import Header from '../../components/ui/header/Header';
import settingsIcon from "../../assets/icons/settings-icon.svg";

import { Plus } from "lucide-react";

export const ClassRoomsPage = memo(() => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const { currentSchoolName } = useContext(SchoolNamesContext);
  const { data, isPending, refetch, isRefetching } = useGetClassesTeacherId(user?.id as string);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addClassModal = () => (
    <button className="bg-main text-white w-8 h-8 rounded-full flex items-center justify-center">
      <img className="w-[70%] h-[70%]" src={plus} onClick={openModal} />
    </button>
  );

  return (
    <>
      {(isPending || isRefetching) && <Loader />}
      <Header title={t("teacherPages.classes.headerTitle") as string} linkTo={`/${currentSchoolName}/classes`} modal={addClassModal()} />

      <ul
        className="
          p-4 pb-[60px] mt-[80px] grid
          grid-cols-1 gap-2 sm:grid-cols-2
          md:grid-cols-3 xl:grid-cols-4
          xl:w-[1200px] xl:mx-auto
        "
      >
        {data?.map((classItem) => (
          <li
            key={classItem.id}
            className="
              bg-white p-4 rounded-[16px] shadow flex flex-col
              space-y-2
            "
          >
            <button
              className="absolute right-1 top-2 p-1 bg-white rounded-full"
              onClick={() => navigate(`/${currentSchoolName}/classes/${classItem.id}`, { state: { isGear: true } })}
            >
              <img
                src={settingsIcon}
                alt="settingsIcon"
              />
            </button>
            <div className="bg-gray-200 h-[140px] rounded-[8px] overflow-hidden">
              {classItem.logo !== "" && (
                <img
                  src={classItem.logo}
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <h2
              onClick={() => navigate(`/${currentSchoolName}/classes/${classItem.id}`)}
              className="text-[24px] text-[#362D2E] font-semibold"
            >
              {classItem.name}
            </h2>

            <Link
              to={`/${currentSchoolName}/teacher-assignments/${classItem.id}`}
              className="text-text-light-blue flex items-center gap-1"
            >
              <span>
                <Plus size={15} />
              </span>
              <span>{t("teacherPages.classes.addAssignmentLinkText")}</span>
            </Link>

            <div className="flex justify-between">
              <span className="text-gray-700 border-[0.5px] border-[#E9ECEF] py-1 px-3 rounded-full text-sm">
                {classItem.studentEmails?.length} {t("teacherPages.classes.studentsText")}
              </span>
              <span className="border-[0.5px] border-[#E9ECEF] text-gray-700 py-1 px-3 rounded-full text-sm">
                {classItem.assignmentIds?.length} {t("teacherPages.classes.assignmentsText")}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-[100px]">
        {data?.length === 0 && !isPending && !isRefetching && (
          <p className="text-center text-gray-500">{t("teacherPages.classes.noClassesText")}</p>
        )}
      </div>

      <CreateClassModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onRefreshClasses={refetch}
      />

      <BottomNavigation />
    </>
  );
});