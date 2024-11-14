import { useContext } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";

import { UsersApiService } from "../../services";

import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { User } from "../../types";

import SchoolNamesContext, { School } from "../../context/SchoolNamesContext";

import { toast } from "react-hot-toast";

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
      natureLanguage?: string;
      foreignLanguage?: string;
    }) =>
      UsersApiService.updateUser(
        data.id,
        data.firstName,
        data.lastName,
        data.role,
        data.foreignLanguage,
        data.natureLanguage,
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
      toast.error("Something went wrong");

      console.error("Update user failed:", error);
    },
  });
};

export const useLogin = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { currentSchoolName } = useContext(SchoolNamesContext);

  return useMutation({
    mutationFn: (credentials: { email: string; password: string, school: School }) =>
      UsersApiService.signIn(credentials),
    onSuccess: async (data) => {
      localStorage.setItem("token", data.accessToken);
      const user: User | null = await UsersApiService.getUser(data.id);

      setUser(user);

      navigate(
        user?.role === "student"
          ? `/${currentSchoolName}/student-assignments`
          : `/${currentSchoolName}/classes`
      );
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error("Login failed:", error);
    },
  });
};

export const useSingUp = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { currentSchoolName } = useContext(SchoolNamesContext);

  return useMutation({
    mutationFn: (data: { email: string; password: string, school: School }) =>
      UsersApiService.signUp(data),
    onSuccess: async (data) => {
      localStorage.setItem("token", data.accessToken);
      const user: User | null = await UsersApiService.getUser(data.id);
      if (user) {
        setUser(user);
        navigate(`/${currentSchoolName}/introducing-with-ai`);
      }
    },
    onError: (error) => {
      toast.error("Something went wrong");

      console.error("Sign up failed:", error);
    },
  });
};
