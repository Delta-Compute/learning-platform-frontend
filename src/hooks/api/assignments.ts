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