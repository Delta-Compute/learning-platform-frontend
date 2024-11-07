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