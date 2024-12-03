import { useMutation, useQuery } from "@tanstack/react-query";

import { AssignmentApiService } from "../../services";

export const useGetStudentAssignments = (studentEmail: string) => {
  const { ...rest } = useQuery({
    queryFn: () => AssignmentApiService.getAssignmentsForStudent(studentEmail),
    queryKey: ["assignments"],
    staleTime: 5_000_000,
    enabled: !!studentEmail,
  });

  return {
    ...rest,
  };
};

export const useGetRoomsAssignments = (classRoomId: string) => {
  const { ...rest } = useQuery({
    queryFn: () => AssignmentApiService.getAssignmentsByClassRoomId(classRoomId),
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

export const useUpdateAssignment = () => {
  return useMutation({
    mutationFn: ({ assignmentId, summary }: { assignmentId: string, summary: string }) => AssignmentApiService.updateAssignment(assignmentId, { summary: summary }),
    onSuccess: (data) => {
      console.log("Assignment updated:", data);
    },
    onError: (error) => {
      console.error("Update assignment failed:", error);
    },
  });
}

export const useDeleteAssignment = () => {
  return useMutation({
    mutationFn: ({ assignmentId, classRoomId }: { assignmentId: string, classRoomId: string }) => AssignmentApiService.deleteAssignment(assignmentId, classRoomId),
    onError: (error) => {
      console.error("Delete assignment failed:", error);
    },
  });
}

