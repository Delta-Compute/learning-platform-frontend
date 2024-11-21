import { ReportData } from '../../types/reportData';

interface SecondModalProps {
  data: ReportData;
  onClose: () => void;
}

export const DownloadSendReportModal: React.FC<SecondModalProps> = ({ data, onClose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-[#00143480] bg-opacity-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-[95%] max-w-md p-4 pt-6 rounded-[32px] shadow-lg">
        <h2 className="text-[24px] font-semibold text-center mb-4 text-[#001434]">
          Second Modal
        </h2>
        <p>{`Selected Class: ${data.classId || "None"}`}</p>
        <p>{`Selected Student: ${
          typeof data.studentEmail === "string" ? data.studentEmail : data.range
        }`}</p>
        <p>{`Selected Range: ${JSON.stringify(data.range)}`}</p>
        <button
          onClick={onClose}
          className="w-full bg-red-500 text-white py-2 rounded-full font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};