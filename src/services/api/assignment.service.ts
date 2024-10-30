import { Assignment } from "../../types/index.ts";

import { apiClient } from "../../vars/axios-var.ts";

export const addAssignment = async (classRoomId: string, description: string) => {
  try {
    await apiClient.post<Assignment>(
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

export const getAssignmentsForStudent = async (email: string): Promise<Assignment[] | null> => {
  try {
    const response = await apiClient.get<Assignment[] | null>(
      `/assignments/find-assignments/${email}`,
    );

    const data = response.data as Assignment[];

    return data;
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const AssignmentApiService = {
  addAssignment,
  getAssignmentsForStudent,
};