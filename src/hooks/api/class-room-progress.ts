import { useQuery } from "@tanstack/react-query";

import { ClassRoomProgressApiService } from "../../services";

export const useGetClassRoomProgress = (classRoomId: string, assignmentId: string) => {
  const { ...rest } = useQuery({
    queryFn: () => ClassRoomProgressApiService.getClassRoomProgress(classRoomId, assignmentId),
    queryKey: ["classRoomProgress"],
    staleTime: 5_000_000,
  });

  return {
    ...rest,
  };
};

export const useGetStudentsProgress = (classRoomId: string, assignmentId: string) => {
  const { ...rest } = useQuery({
    queryFn: () => ClassRoomProgressApiService.getStudentsProgress(classRoomId, assignmentId),
    queryKey: ["studentsRoomProgress"],
    staleTime: 5_000_000,
  });

  return {
    ...rest,
  };
};