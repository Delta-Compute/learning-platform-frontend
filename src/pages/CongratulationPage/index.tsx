import { Link } from 'react-router-dom';

import LeftArrowIcon from "../../assets/icons/left-arrow.svg";
import congratulations from "../../assets/icons/congratulations_img.svg";

const CongratulationPage = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className="fixed z-[1] top-0 w-full bg-white py-4 flex justify-center items-center">
        <div className="absolute left-4 top-[22px]">
          <Link to="/teacher-tasks">
            <img src={LeftArrowIcon} alt="Back" className="w-6 h-6" />
          </Link>
        </div>
        <h2 className="text-center text-[24px] font-semibold text-[#524344]">Congratulations!</h2>
      </div>

      <div className="flex flex-col flex-grow min-h-0 mt-28 p-4 max-w-md mx-auto w-full space-y-4 justify-between al">
        <div className='flex flex-col justify-center items-center gap-6'>
          <img src={congratulations} alt="congratulations" />
          <p className='text-[18px] font-normal text-[#001434] text-center'>Your personal xyz is ready for you</p>
        </div>

        <button className="w-full bg-red-600 text-white rounded-[40px] font-medium p-[16px] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
          Start teaching
        </button>
      </div>
    </div>
  );
}

export default CongratulationPage;
