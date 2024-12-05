import { useTranslation } from "react-i18next";

import { useContext, useEffect, useState } from "react";

import SchoolNamesContext from "../../context/SchoolNamesContext";

import { useDeleteClassRoom, useGetClassesTeacherId } from '../../hooks/api/classes';
import UserContext from '../../context/UserContext';
import { Class } from "../../types/class";

import { Loader, CreateClassModal, BottomNavigation, DropdownMenu } from "../../components";

import { useNavigate, Link } from "react-router-dom";

import plus from "../../assets/icons/plus-icon.svg";
import Header from '../../components/ui/header/Header';
import menuIcon from "../../assets/icons/threeDots.svg";

const ClassesPage = () => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const { currentSchoolName } = useContext(SchoolNamesContext);
  const { data, isPending, refetch, isRefetching } = useGetClassesTeacherId(user?.id as string);
  const { mutate, isPending: isClassDeleting } = useDeleteClassRoom();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    refetch();
  }, [user?.id, refetch]);

  const addClassModal = () => (
    <button className="bg-main text-white w-8 h-8 rounded-full flex items-center justify-center">
      <img className="w-[70%] h-[70%]" src={plus} onClick={openModal} />
    </button>
  );

  const handleDeleteClass = (classId: string) => {
    mutate(classId, {
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        console.error("Помилка видалення класу:", error);
      },
    });
  };

  return (
    <>
      {(isPending || isRefetching || isClassDeleting) && <Loader />}
      <Header title={t("teacherPages.classes.headerTitle") as string} linkTo={`/${currentSchoolName}/classes`} modal={addClassModal()} />
      <ul className="space-y-4 p-4 pb-[60px] mt-[80px]">
        {data?.map((classItem: Class, index) => (
          <li
            key={index}
            className={`relative bg-white p-4 rounded-[16px] shadow flex flex-col space-y-2 ${index === data.length - 1 ? 'mb-[60px]' : ''
              }`}
          >
            <div className='absolute right-1 top-2'>
              <DropdownMenu
                menuItems={[{ title: "Delete" }]}
                onClick={() => classItem.id && handleDeleteClass(classItem.id)}
              >
                <>
                  <img src={menuIcon} alt="menu" className="w-[20px]" />
                </>
              </DropdownMenu>
            </div>
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

            <Link to={`/${currentSchoolName}/teacher-assignments/${classItem.id}`} className="text-text-light-blue">{t("teacherPages.classes.addAssignmentLinkText")}</Link>

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
