import { ClassRoom } from "../../types";

import { apiClient } from "../../vars/axios-var.ts";

export const getClassRoom = async (id: string): Promise<ClassRoom | null> => {
  try {
    const response = await apiClient.get<ClassRoom>(
      `/class-room/${id}`,
    );

    const data = response.data as ClassRoom;

    return data;
  } catch (error) {
    console.log(error);
  }

  return null;
};

// add pagination
export const getAllClassRooms = async (): Promise<ClassRoom[] | null> => {
  try {
    const response = await apiClient.get<ClassRoom[]>(
      "/class-room/class-rooms/find-all",
    );

    const data = response.data as ClassRoom[];

    return data;
  } catch (error) {
    console.log(error);
  }

  return null;
};

// update class room fields 
export const updateClassRoom = async (classRoomId: string, learningPlan: string, studentEmails?: string) => {
  try {
    const response = await apiClient.patch<ClassRoom[]>(
      `/class-room/${classRoomId}`,
      {
        learningPlan,
        studentEmails,
      }
    );

    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export const ClassRoomApiService = {
  getClassRoom,
  getAllClassRooms,
  updateClassRoom,
};