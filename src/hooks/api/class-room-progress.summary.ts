import { useQuery } from '@tanstack/react-query';
import { ClassRoomProgressSummaryService } from '../../services/api/class-room-progres.service';

export const useGetClassRoomProgressSummary = (classRoomId: string, assignmentId: string) => {
  const { ...rest } = useQuery({
    queryFn: () => ClassRoomProgressSummaryService.getClassRoomProgressForSummary(classRoomId, assignmentId),
    queryKey: ["classRoomProgressSummary"],
    staleTime: 5_000_000,
  });

  return {
    ...rest,
  };
}