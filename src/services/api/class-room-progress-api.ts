import { IClassRoomProgress } from "../../types/classRoomProgres";

import { apiClient } from "../../vars/axios-var";

export const getClassRoomProgress = async (classRoomId: string, assignmentId: string): Promise<IClassRoomProgress | null> => {
  try {
    const response = await apiClient.get<IClassRoomProgress>(
      `/class-room-progress/${classRoomId}/${assignmentId}`,
    );

    const data = response.data as IClassRoomProgress;

    return data;
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const updateClassRoomProgress = async (classRoomId: string, assignmentId: string, studentEmail: string, feedback: string) => {
  try {
    const response = await apiClient.patch<IClassRoomProgress[]>(
      `/class-room-progress/update-progress/${classRoomId}/${assignmentId}`,
      {
        studentEmail,
        feedback,
      }
    );

    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export const getStudentsProgress = async (classRoomId: string, assignmentId: string): Promise<string> => {
  try {
    const response = await apiClient.get(`/class-room-progress/students-progress/find-progress/${classRoomId}/${assignmentId}`);

    return response.data as string;
  } catch(error) {
    console.log(error);
  }

  return "";
};

export const ClassRoomProgressApiService = {
  getClassRoomProgress,
  updateClassRoomProgress,
  getStudentsProgress,
};