import { useContext, useEffect, useState } from 'react';
import plus from '../../assets/icons/plus-icon.svg';
import BottomNavigation from '../../components/Navigation';
import CreateClassModal from '../../components/CreateClassModal';
import { useGetClassesTeacherId } from '../../hooks/api/classes';
import UserContext from '../../context/UserContext';
import { Class } from '../../types/class';
import { Loader } from '../../components';
import { useNavigate, Link } from "react-router-dom";

const ClassesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(UserContext);
  const { data, isPending, refetch, isRefetching } = useGetClassesTeacherId(user?.id as string);  
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const onRefreshClasses = () => {
    refetch();
  }

  useEffect(() => {
    refetch();
  }, [user?.id])

  return (
    <>
      <div className="p-4">
        {isPending || isRefetching && <Loader />}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-[#524344]">Classes</h1>
          <button className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-[70px]">
            <img className="w-[70%] h-[70%]" src={plus} onClick={openModal} />
          </button>
        </div>

        <div className="space-y-4 pb-[60px]">
          {data?.map((classItem: Class, index) => (
            <div
              key={index}
              className={`bg-white p-4 rounded-[16px] shadow flex flex-col space-y-2 ${index === data.length - 1 ? 'mb-[60px]' : ''
                }`}
            >
              <div className="bg-gray-200 h-24 rounded-[8px]"></div>

              <h2 
                onClick={() => navigate(`/classes/${classItem.id}`, { state: { classItem } })} 
                className="text-[24px] text-[#362D2E] font-semibold"
              >
                {classItem.name}
              </h2>

              <Link to={`/teacher-assignments/${classItem.id}`} className="text-blue-400">Add assignment</Link>

              <div className="flex justify-between">
                <span className="text-gray-700 border-[0.5px] border-[#E9ECEF] py-1 px-3 rounded-full text-sm">
                  {classItem.studentEmails?.length} Students
                </span>
                <span className="border-[0.5px] border-[#E9ECEF] text-gray-700 py-1 px-3 rounded-full text-sm">
                  {classItem.assignmentIds?.length} assignments
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CreateClassModal isOpen={isModalOpen} onClose={closeModal} onRefreshClasses={onRefreshClasses} />
      <BottomNavigation />
    </>
  );
};

export default ClassesPage;
