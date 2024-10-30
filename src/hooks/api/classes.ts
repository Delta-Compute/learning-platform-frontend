import { useMutation, useQuery } from "@tanstack/react-query";
import { ClassesApiService } from "../../services/api/classes-api.service";
import { Class } from "../../types/class.ts";

export const useCreateClass = () => {
    return useMutation({
        mutationFn: (data: Class) => ClassesApiService.createClass(data),
        onSuccess: (data: Class) => {
            console.log("Class created:", data);
        },
        onError: (error) => {
            console.error("Create class failed:", error);
        },
    });
}

export const useGetClassesTeacherId = (teacherId: string) => {
    return useQuery({
        queryFn: () => ClassesApiService.getClassesTeacherId(teacherId),
        queryKey: ["classes"],
        staleTime: 5_000_000,
    });
}