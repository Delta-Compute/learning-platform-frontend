import { useTranslation } from "react-i18next";

import { useContext, useEffect, useState } from "react";

import SchoolNamesContext from "../../context/SchoolNamesContext";

import plus from '../../assets/icons/plus-icon.svg';
import BottomNavigation from '../../components/Navigation/Navigation.tsx';
import { useGetClassesTeacherId } from '../../hooks/api/classes';
import UserContext from '../../context/UserContext';
import { Class } from "../../types/class";

import { Loader, CreateClassModal } from "../../components";

import { useNavigate, Link } from "react-router-dom";

const ClassesPage = () => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const { currentSchoolName } = useContext(SchoolNamesContext);
  const { data, isPending, refetch, isRefetching } = useGetClassesTeacherId(user?.id as string);  
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    refetch();
  }, [user?.id, refetch]);

  return (
    <>
      <div className="p-4">
        {(isPending || isRefetching) && <Loader />}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-[#524344]">{t("teacherPages.classes.headerTitle")}</h1>
          <button className="bg-main text-white w-8 h-8 rounded-full flex items-center justify-center mr-[70px]">
            <img className="w-[70%] h-[70%]" src={plus} onClick={openModal} />
          </button>
        </div>

        <ul className="space-y-4 pb-[60px]">
          {data?.map((classItem: Class, index) => (
            <li
              key={index}
              className={`bg-white p-4 rounded-[16px] shadow flex flex-col space-y-2 ${index === data.length - 1 ? 'mb-[60px]' : ''
                }`}
            >
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
                onClick={() => navigate(`/${currentSchoolName}/classes/${classItem.id}`, { state: { classItem } })}
                className="text-[24px] text-[#362D2E] font-semibold"
              >
                {classItem.name}
              </h2>

              <Link to={`/${currentSchoolName}/teacher-assignments/${classItem.id}`} className="text-blue-400">{t("teacherPages.classes.addAssignmentLinkText")}</Link>

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
          {data?.length === 0 && !isPending && !isRefetching && <p className="text-center text-gray-500">{t("teacherPages.classes.noClassesText")}</p>}
        </div>
      </div>

      <CreateClassModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onRefreshClasses={refetch}
      />

      <BottomNavigation classRoomId={data && data.length > 0 ? data[0].id : undefined} />
    </>
  );
};

export default ClassesPage;
