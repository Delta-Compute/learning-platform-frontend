import { apiClient } from "../../vars/axios-var.ts";

export const getAssignmentSummary = async (classRoomId: string, assignmentId: string): Promise<string | null> => {
  try {
    const response = await apiClient.get<string | null>(
      `/class-room-progress/students-progress/find-progress/${classRoomId}/${assignmentId}`,
    );

    const data = response.data as string;

    return data;
  } catch (error) {
    console.log(error);
  }

  return null;
}

export const AssignmentProgressSummaryService = {
  getAssignmentSummary,
};