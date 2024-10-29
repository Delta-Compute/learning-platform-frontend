import { ClassRoom } from "../../types/index.ts";

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

export const ClassRoomApiService = {
  getClassRoom,
};