import { useQuery } from "@tanstack/react-query";

import { UsersApiService } from "../../services";

export const useGetUser = (id: string) => {
  const { ...rest} = useQuery({
    queryFn: () => UsersApiService.getUser(id),
    queryKey: ["users"],
    staleTime: 5_000_000,
  });

  return {
    ...rest,
  };
};