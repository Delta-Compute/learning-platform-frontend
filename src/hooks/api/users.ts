import { useContext } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";

import { User, UserAuthType } from "../../types";

import { UsersApiService } from "../../services";

import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

import SchoolNamesContext, { School } from "../../context/SchoolNamesContext";

import { toast } from "react-hot-toast";
import { SecretWords } from '../../types/secretWords';

export const useGetUser = (id: string) => {
  return useQuery({
    queryFn: () => UsersApiService.getUser(id),
    queryKey: ["user", id],
    enabled: !!id,
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
      email?: string;
      schoolName?: string;
      secretWords?: {
        color: string;
        number: string;
      };
      userSummary?: string;
    }) =>
      UsersApiService.updateUser(
        data.id,
        data.firstName,
        data.lastName,
        data.role,
        data.foreignLanguage,
        data.natureLanguage,
        data.email,
        data.schoolName,
        data.secretWords,
        data.userSummary,
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
    mutationFn: (credentials: { email: string; password: string, school: School, auth: UserAuthType, secretWords?: SecretWords }) =>
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
    mutationFn: (data: { email: string; password: string, school: School, auth: UserAuthType }) =>
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

export const useGetUsersByEmails = (emails: string[], school: School) => {
  return useQuery({
    queryFn: ({ queryKey }) => {
      const [, emails] = queryKey;
      
      return UsersApiService.getUsersByEmails(emails as string[], school);
    },
    queryKey: ["users", emails],
    staleTime: 5_000_000,
    enabled: emails.length > 0,
  });
};
