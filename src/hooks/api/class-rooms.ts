import { useQuery } from "@tanstack/react-query";

import { ClassRoomApiService } from "../../services";

export const useGetAllClassRooms = () => {
  const { ...rest } = useQuery({
    queryFn: () => ClassRoomApiService.getAllClassRooms(),
    queryKey: ["class-rooms"],
    staleTime: 5_000_000,
  });

  return {
    ...rest,
  };
};

export const useClassRoomReport = (classRoomId: string, students: string[], from: number, to: number) => {
  return useQuery({
    queryKey: ['classRoomReport', classRoomId, students, from, to],
    queryFn: () => ClassRoomApiService.getClassRoomReport(classRoomId, students, from, to),
    enabled: !!classRoomId && students.length > 0 && from < to,
  });
};