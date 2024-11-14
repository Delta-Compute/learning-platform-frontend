import { Class } from "../../types/class.ts";

import { apiClient } from "../../vars/axios-var.ts";

export const getClassesTeacherId = async (teacherId: string): Promise<Class[]> => {
  try {
    const response = await apiClient.get<Class[]>("/class-room", { params: { teacherId } });

    return response.data as Class[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createClass = async (
  data: {
    name?: string,
    teacherId?: string,
    logo?: string,
    studentEmails?: string[],
    assignmentIds?: string[],
    learningPlan?: string,
}): Promise<Class> => {
  try {
    const response = await apiClient.post(
      "/class-room",
      {
        ...data,
      }
    );

    return response.data
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getClassById = async (id: string): Promise<Class> => {
  try {
    const response = await apiClient.get<Class>(`/class-room/${id}`);

    return response.data as Class;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const ClassesApiService = {
  getClassesTeacherId,
  createClass,
  getClassById,
};