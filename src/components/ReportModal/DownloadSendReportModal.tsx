import toast from 'react-hot-toast';
import { DataForReport } from '../../types/reportData';
import { generateWordDocument } from '../../utils/createDoc';
import SchoolNamesContext from '../../context/SchoolNamesContext';
import { useContext, useState } from 'react';
import { SCHOOL_LOGOS } from '../../utils/schoolLogo';
import { User } from '../../types';
import { sendReport } from '../../services/api/email.service';
import UserContext from '../../context/UserContext';
import { Loader } from '../ui/loader/Loader';

interface BaseData {
  student: string | User;
  range: {
    from: number;
    to: number;
  };
  className: string;
}

interface SecondModalProps {
  data: DataForReport;
  onClose: () => void;
  baseData: BaseData;
}

export const DownloadSendReportModal: React.FC<SecondModalProps> = ({ data, onClose, baseData }) => {
  const { currentSchoolName: schoolNameForLogo } = useContext(SchoolNamesContext);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const { className, student, range } = baseData;
  const { user } = useContext(UserContext);

  const schoolLogo = SCHOOL_LOGOS[schoolNameForLogo];

  const handleCreateDoc = async () => {
    try {
      await generateWordDocument(data, schoolLogo);
      toast.success("Document created successfully");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error creating document");
    }
  }

  const handleSendEmail = async () => {
    setIsEmailSending(true);
    try {
      const file = await generateWordDocument(data, schoolLogo, true);
      if (file && user) {
        const blob = new Blob([file], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        const fileForEmail = new File([blob], "report.docx", { type: blob.type });
        sendReport(fileForEmail, user.email, `${user.firstName} ${user.lastName}`);
        toast.success("Document sent successfully");
      } else {
        toast.error("Error generating document for email");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error sending document");
    } finally {
      setIsEmailSending(false);
    }
  }
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-[#00143480] bg-opacity-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {isEmailSending && <Loader />}
      <div className="bg-white w-[95%] max-w-md p-2 pt-4 rounded-2xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-[20px] p-[5px] hover:text-gray-700"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-[24px] font-semibold text-center mb-4 text-[#001434]">
          Report
        </h2>

        <div className="text-sm text-[#001434] space-y-2">
          <p>
            <span className="text-[16px]">Class:</span>{" "}
            <span className="font-medium text-[#001434] text-[16px]">{className}</span>
          </p>
          <p>
            <span className="text-[16px]">Student:</span>{" "}
            <span className="font-medium text-[#001434] text-[16px]">{typeof student === "string" ? student : `${student.firstName} ${student.lastName}`}</span>
          </p>
          <p>
            <span className="text-[16px]">Period:</span>{" "}
            <span className="font-medium text-[#001434] text-[16px]">{`${new Date(range.from).toLocaleDateString()} - ${new Date(range.to).toLocaleDateString()}`}</span>
          </p>
        </div>

        <div className="flex justify-around mt-6">
          <button onClick={handleSendEmail} className="flex items-center gap-2 px-4 py-[12px] border-[#E9ECEF] border rounded-full text-gray-700 hover:bg-gray-200">
            Send
          </button>
          <button className="flex items-center gap-2 px-4 py-[12px] border-[#E9ECEF] border rounded-full text-gray-700 hover:bg-gray-200">
            View
          </button>
          <button
            onClick={handleCreateDoc}
            className="flex items-center gap-2 px-4 py-[12px] border-[#CC1316] border rounded-full hover:bg-red-600"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};