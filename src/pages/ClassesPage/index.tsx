import { useState } from 'react';
import plus from '../../assets/icons/plus-icon.svg';
import BottomNavigation from '../../components/Navigation';
import CreateClassModal from '../../components/CreateClassModal';

const classesData = [
  { name: 'English, Class 5B', students: 24, assignments: 4 },
  { name: 'English, Class 10A', students: 21, assignments: 6 },
  { name: 'English, Class 7A', students: 18, assignments: 5 },
];

const ClassesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-[#524344]">Classes</h1>
          <button className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
            <img className="w-[70%] h-[70%]" src={plus} onClick={openModal}/>
          </button>
        </div>

        <div className="space-y-4 pb-[60px]">
          {classesData.map((classItem, index) => (
            <div
              key={index}
              className={`bg-white p-4 rounded-[16px] shadow flex flex-col space-y-2 ${index === classesData.length - 1 ? 'mb-[60px]' : ''
                }`}
            >
              <div className="bg-gray-200 h-24 rounded-[8px]"></div>

              <h2 className="text-[24px] text-[#362D2E] font-semibold">{classItem.name}</h2>

              <div className="flex justify-between">
                <span className="text-gray-700 border-[0.5px] border-[#E9ECEF] py-1 px-3 rounded-full text-sm">
                  {classItem.students} Students
                </span>
                <span className="border-[0.5px] border-[#E9ECEF] text-gray-700 py-1 px-3 rounded-full text-sm">
                  {classItem.assignments} assignments
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
      <CreateClassModal isOpen={isModalOpen} onClose={closeModal} />
      <BottomNavigation />
    </>
  );
};

export default ClassesPage;