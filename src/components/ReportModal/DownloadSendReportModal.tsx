import toast from 'react-hot-toast';
import { DataForReport } from '../../types/reportData';
import { generateWordDocument } from '../../utils/createDoc';

interface SecondModalProps {
  data: DataForReport;
  onClose: () => void;
}

export const DownloadSendReportModal: React.FC<SecondModalProps> = ({ data, onClose }) => {
  const handleCreateDoc = async () => {
    try {
      await generateWordDocument(data);
      toast.success("Document created successfully");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error creating document");
    }
  }
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-[#00143480] bg-opacity-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-[95%] max-w-md p-4 pt-6 rounded-[32px] shadow-lg">
        <h2 className="text-[24px] font-semibold text-center mb-4 text-[#001434]">
          Second Modal
        </h2>
        <button
          onClick={handleCreateDoc}
          className="w-full bg-red-500 text-white py-2 rounded-full font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};