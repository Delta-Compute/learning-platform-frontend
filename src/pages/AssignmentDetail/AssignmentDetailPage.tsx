import { useParams } from "react-router-dom";
import Header from "../../components/ui/header/Header";
import { assignmentsData, classesData, TAssignment } from "../../utils/mock";

export const AssignmentDetailPage = () => {
  const { classId, id } = useParams();
  const classItem = classesData.find((item) => item.name === classId);
  const assignment = assignmentsData.find(
    (item) => item.id === id
  ) as TAssignment;

  return (
    <div className="flex flex-col h-screen py-6 px-2 bg-bg-color">
      <Header
        title={assignment?.title ?? ""}
        linkTo={`/classes/${classItem?.id}`}
      />
    </div>
  );
};
