import { Link } from 'react-router-dom';
import LeftArrowIcon from "../../assets/icons/left-arrow.svg";
import arrowDropdown from "../../assets/icons/arrow_dropdown.svg";
import { useRef, useState } from 'react';

const JoinYourSchoolPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('School: choose');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget)) {
      setIsOpen(false);
    }
  };

  const options = ['School 1', 'School 2', 'School 3'];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed z-[1] top-0 w-full bg-white py-4 flex justify-center items-center">
        <div className="absolute left-4 top-[22px]">
          <Link to="/teacher-tasks">
            <img src={LeftArrowIcon} alt="Back" className="w-6 h-6" />
          </Link>
        </div>
        <h2 className="text-center text-[24px] font-semibold text-[#524344]">Join your school</h2>
      </div>

      <div className="flex flex-col flex-grow min-h-0 mt-20 p-4 max-w-md mx-auto w-full space-y-4">
        <div className="flex flex-col flex-grow min-h-0 space-y-4">
          <div>
            <label className="block text-sm font-normal mb-1">Choose your school</label>
            <div className="relative" ref={dropdownRef}>
              <div
                className={`w-full border-[0.5px] rounded-[40px] p-3 bg-white cursor-pointer flex justify-between items-center ${selected === 'School: choose' ? 'text-gray-400' : 'text-gray-700'
                  }`}
                tabIndex={0}
                onClick={() => setIsOpen((prev) => !prev)}
                onBlur={handleBlur}
              >
                {selected}
                <img
                  src={arrowDropdown}
                  className={`w-4 h-4 transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`}
                />
              </div>
              <div
                className={`absolute z-10 mt-2 w-full bg-white border rounded-[10px] shadow-lg overflow-hidden transition-all duration-300 ease-out transform origin-top ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
                  }`}
                style={{ transformOrigin: 'top' }}
              >
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSelected(option);
                      setIsOpen(false);
                    }}
                    tabIndex={0}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-normal mb-1">Your first name</label>
            <input
              type="text"
              placeholder="Enter your first name"
              className="w-full border-[0.5px] rounded-[40px] p-3 text-gray-700 focus:outline-none focus:ring-none"
            />
          </div>

          <div>
            <label className="block text-sm font-normal mb-1">Your second name</label>
            <input
              type="text"
              placeholder="Enter your second name"
              className="w-full border-[0.5px] rounded-[40px] p-3 text-gray-700 focus:outline-none focus:ring-none"
            />
          </div>
        </div>

        <button className="w-full bg-red-600 text-white rounded-[40px] font-medium p-[16px] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
          Submit
        </button>
      </div>
    </div>
  );
}

export default JoinYourSchoolPage;