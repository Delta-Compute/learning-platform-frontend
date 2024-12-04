import { useMutation, useQuery } from "@tanstack/react-query";
import { ClassesApiService, ClassRoomApiService } from "../../services";
import { Class } from "../../types/class";

import { School } from "../../context";

export const useCreateClass = () => {
  return useMutation({
    mutationFn: (data: Omit<Class, "verificationCode">) =>
      ClassesApiService.createClass(data),
    onSuccess: (data: Class) => {
      console.log("Class created:", data);
    },
    onError: (error) => {
      console.error("Create class failed:", error);
    },
  });
};

export const useGetClassesTeacherId = (teacherId: string) => {
  return useQuery({
    queryFn: () => ClassesApiService.getClassesTeacherId(teacherId),
    queryKey: ["classes"],
    staleTime: 5_000_000,
  });
};

export const useClassById = (id: string) => {
  return useQuery({
    queryFn: () => ClassesApiService.getClassById(id),
    queryKey: ["class", id],
    enabled: !!id,
    staleTime: 5_000_000,
  });
};

export const useUpdateClass = (id: string) => {
  return useMutation({
    mutationFn: (data: Omit<Class, "verificationCode">) =>
      ClassesApiService.updateClass(id, data),
    onSuccess: (data: Class) => {
      console.log("Class updated:", data);
    },
    onError: (error) => {
      console.error("Update class failed:", error);
    },
  });
};

export const useFindStudentInClass = (email: string, school: School) => {
  return useQuery({
    queryFn: () => ClassRoomApiService.findStudentInClassRoom(email, school),
    queryKey: [],
    enabled: !!email,
    staleTime: 5_000_000,
  });
};

export const useDeleteClassRoom = () => {
  return useMutation({
    mutationFn: (classRoomId: string) =>
      ClassRoomApiService.deleteClassRoom(classRoomId),
    onError: (error) => {
      console.error("Delete class room failed:", error);
    },
  });
};
