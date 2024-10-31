import { ClassRoom } from "../../types";
import { IClassRoomProgress } from '../../types/classRoomProgres.ts';

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
}

export const ClassRoomApiService = {
  getClassRoom,
  getAllClassRooms,
  updateClassRoomProgress,
  getClassRoomProgress,
};