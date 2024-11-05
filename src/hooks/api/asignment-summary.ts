import { useQuery } from '@tanstack/react-query';
import { AssignmentProgressSummaryService } from '../../services/api/assignment-progres.service';

export const useGetAssigmentSummary = (classRoomId: string, assignmentId: string) => {
  const { ...rest } = useQuery({
    queryFn: () => AssignmentProgressSummaryService.getAssignmentSummary(classRoomId, assignmentId),
    queryKey: ["classRoomProgressSummary"],
    staleTime: 5_000_000,
  });

  return {
    ...rest,
  };
}