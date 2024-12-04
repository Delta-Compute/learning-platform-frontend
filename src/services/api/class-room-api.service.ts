import { ClassRoom } from "../../types";

import { apiClient } from "../../vars/axios-var";

import { School } from "../../context";

export const getClassRoom = async (id: string): Promise<ClassRoom | null> => {
  try {
    const response = await apiClient.get<ClassRoom>(`/class-room/${id}`);

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
      "/class-room/class-rooms/find-all"
    );

    const data = response.data as ClassRoom[];

    return data;
  } catch (error) {
    console.log(error);
  }

  return null;
};

// update class room fields
export const updateClassRoom = async (classRoomId: string, data: FormData) => {
  try {
    await apiClient.patch(`/class-room/${classRoomId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.log("classroom updating error", error);
  }
};

export const verifyClassRoomCodeAndAddEmail = async (
  verificationCode: string,
  email: string
) => {
  try {
    await apiClient.patch(
      `/class-room/verification-code/${verificationCode}/${email}`
    );
  } catch (error) {
    console.log(error);
  }
};

export const findStudentInClassRoom = async (email: string, school: School) => {
  try {
    const response = await apiClient.get(
      `/class-room/find-class-room/for-student/${email}/${school}`
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getClassRoomReport = async (
  classRoomId: string,
  students: string[],
  from: number,
  to: number
) => {
  try {
    const response = await apiClient.get(`/class-room/report/${classRoomId}`, {
      params: {
        students,
        from,
        to,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching classroom report:", error);
    throw error;
  }
};

export const deleteClassRoom = async (classRoomId: string) => {
  try {
    await apiClient.delete(`/class-room/${classRoomId}`);
  } catch (error) {
    console.log("classroom deleting error", error);
  }
};

export const ClassRoomApiService = {
  getClassRoom,
  getAllClassRooms,
  updateClassRoom,
  verifyClassRoomCodeAndAddEmail,
  findStudentInClassRoom,
  getClassRoomReport,
  deleteClassRoom,
};
