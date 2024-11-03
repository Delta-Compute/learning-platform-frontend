import { useMutation, useQuery } from "@tanstack/react-query";

import { UsersApiService } from "../../services";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { User } from "../../types";

export const useGetUser = (id: string) => {
  return useQuery({
    queryFn: () => UsersApiService.getUser(id),
    queryKey: ["user", id],
    enabled: !!id,
    staleTime: 5_000_000,
  });
};

export const useUpdateUser = () => {
  const { setUser } = useContext(UserContext);
  return useMutation({
    mutationFn: (data: {
      id: string;
      firstName?: string;
      lastName?: string;
      role?: string;
    }) =>
      UsersApiService.updateUser(
        data.id,
        data.firstName,
        data.lastName,
        data.role
      ),
    onSuccess: async (data) => {
      const user: User | null = await UsersApiService.getUser(
        data.id as string
      );

      if (user) {
        setUser(user);
      }
    },
    onError: (error) => {
      console.error("Update user failed:", error);
    },
  });
};

export const useLogin = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      UsersApiService.signIn(credentials),
    onSuccess: async (data) => {
      localStorage.setItem("token", data.accessToken);
      const user: User | null = await UsersApiService.getUser(data.id);
      setUser(user);
      navigate(user?.role === "student" ? "/student-assignments" : "/classes");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useSingUp = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      UsersApiService.signUp(data),
    onSuccess: async (data) => {
      localStorage.setItem("token", data.accessToken);
      const user: User | null = await UsersApiService.getUser(data.id);
      if (user) {
        setUser(user);
        navigate("/user-type-selection");
      }
    },
    onError: (error) => {
      console.error("Sign up failed:", error);
    },
  });
};
