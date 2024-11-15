import React from "react";

interface AssignmentSummaryConversationProps {
  classRoomProgress: string;
  onClose: () => void;
};

export const AssignmentSummaryConversation: React.FC<AssignmentSummaryConversationProps> = ({
  classRoomProgress,
  onClose,
}) => {
  return (
    <div>{classRoomProgress} conversation about summary</div>
  );
};