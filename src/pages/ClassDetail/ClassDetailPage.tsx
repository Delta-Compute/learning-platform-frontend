import { useLocation, useNavigate, useParams } from "react-router-dom";
import { assignmentsData, classesData, TAssignment } from "../../utils/mock";
import Header from "../../components/ui/header/Header";
import settingsIcon from "../../assets/icons/settings-icon.svg";
import copyIcon from "../../assets/icons/copy-icon.svg";
import filterIcon from "../../assets/icons/filter-icon.svg";
import Assignment from "../../components/ui/assignment/Assisgnment";
import { Class } from '../../types/class';

export const ClassDetailPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { classItem } = state as { classItem: Class };

  console.log(state, 'state');

  const onAssignmentClick = (assignment: TAssignment) => {
    navigate(`/classes/${classItem.id}/assignments/${assignment.id}`);
  };

  return (
    <div className="flex flex-col h-screen py-6 px-2 bg-bg-color">
      <Header title={classItem.name} linkTo="/classes" />
      <div className=" px-4 mt-12">
        <div
          className={`bg-white p-4 rounded-[16px] shadow flex flex-col space-y-2`}
        >
          <div className="bg-gray-200 h-24 rounded-[8px]"></div>
          <h2 className="text-[14px] text-[#362D2E] font-light">
            Upload class learning plan to have more suitable task
            recommendations
          </h2>
          <div className="flex justify-between">
            <span className="text-gray-700 border-[0.5px] border-[#E9ECEF] py-1 px-3 rounded-full text-sm">
              {classItem.studentEmails?.length} Students
            </span>
            <span className="border-[0.5px] border-[#E9ECEF] text-gray-700 py-1 px-3 rounded-full text-sm">
              {classItem.assignmentIds?.length} assignments
            </span>
            <span className="border-[0.5px] border-[#E9ECEF] text-gray-700 py-1 px-1 rounded-full text-sm">
              <img src={settingsIcon} alt="settings" />
            </span>
          </div>
        </div>
        <div
          className={`bg-white p-4 rounded-[16px] shadow flex flex-col space-y-2  mt-2`}
        >
          <h2 className="text-[16px] text-placholderText font-light">
            Class Code
          </h2>
          <div className="flex flex-row flex-1">
            <img src={copyIcon} alt="copy" />
            <span className="text-[24px] text-[#362D2E] font-light ml-1">
              {`vgu6g25`}
            </span>
            <div className="ml-auto items-center border-[0.5px] border-[#E9ECEF] py-1 px-3 rounded-full">
              <span className="text-[16px] text-blueText font-light">
                Invite Student(s)
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-row mt-6">
          <h2 className="text-[18px] text-text-color font-normal">
            Assignments
          </h2>

          <div className="flex flex-row ml-auto items-center">
            <span className="text-[16px] text-brownText font-light">
              Filter
            </span>
            <img src={filterIcon} alt="filter" />
          </div>
        </div>

        {assignmentsData.map((assignment, index) => (
          <Assignment
            key={index}
            assignment={assignment}
            onClick={onAssignmentClick}
          />
        ))}
      </div>
    </div>
  );
};
