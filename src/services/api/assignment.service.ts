import { IAssignment } from "../../types/assignment.ts";

import { apiClient } from "../../vars/axios-var.ts";

export const addAssignment = async (classRoomId: string, description: string) => {
  try {
    await apiClient.post<IAssignment>(
      "/assignments",
      {
        description,
        classRoomId,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const getAssignmentsForStudent = async (email: string): Promise<IAssignment[] | null> => {
  try {
    const response = await apiClient.get<IAssignment[] | null>(
      `/assignments/find-assignments/${email}`,
    );

    const data = response.data as IAssignment[];

    return data;
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const getAssigmentsByClassRoomId = async (classRoomId: string): Promise<IAssignment[] | null> => {
  try {
    const response = await apiClient.get<IAssignment[] | null>(
      `/assignments/${classRoomId}`,
    );

    const data = response.data as IAssignment[];

    return data;
  } catch (error) {
    console.log(error);
  }

  return null;
}

export const getAssignmentById = async (id: string): Promise<IAssignment | null> => {
  try {
    const response = await apiClient.get<IAssignment | null>(
      `/assignments/${id}`,
    );

    const data = response.data as IAssignment;

    return data;
  } catch (error) {
    console.log(error);
  }

  return null;
}

export const AssignmentApiService = {
  addAssignment,
  getAssignmentsForStudent,
  getAssigmentsByClassRoomId,
  getAssignmentById,
};