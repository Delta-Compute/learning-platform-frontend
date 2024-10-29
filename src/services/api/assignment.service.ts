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

export const AssignmentApiService = {
  addAssignment,
};