import { useQuery } from "@tanstack/react-query";

import { AssignmentApiService } from "../../services";

export const useGetStudentAssignments = (studentEmail: string) => {
  const { ...rest } = useQuery({
    queryFn: () => AssignmentApiService.getAssignmentsForStudent(studentEmail),
    queryKey: ["assignments"],
    staleTime: 5_000_000,
  });

  return {
    ...rest,
  };
};

export const useGetRoomsAssignments = (classRoomId: string) => {
  const { ...rest } = useQuery({
    queryFn: () => AssignmentApiService.getAssigmentsByClassRoomId(classRoomId),
    queryKey: ["assignments"],
    staleTime: 5_000_000,
  });

  return {
    ...rest,
  };
}

export const useGetAssigmentById = (id: string) => {
  const { ...rest } = useQuery({
    queryFn: () => AssignmentApiService.getAssignmentById(id),
    queryKey: ["assignments"],
    staleTime: 5_000_000,
  });

  return {
    ...rest,
  };
}