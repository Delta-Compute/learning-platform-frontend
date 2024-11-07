import { IAssignment } from "../../types/assignment.ts";

import { apiClient } from "../../vars/axios-var.ts";

export const addAssignment = async (classRoomId: string, description: string, topic: string, title: string, deadline: number, timeToDiscuss: number): Promise<IAssignment | null> => {
  try {
    const response = await apiClient.post<IAssignment>(
      "/assignments",
      {
        description,
        classRoomId,
        topic,
        title,
        deadline,
        timeToDiscuss,
      }
    );

    return response.data as IAssignment;
  } catch (error) {
    console.log(error);
  }

  return null;
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

export const getAssignmentsByClassRoomId = async (classRoomId: string): Promise<IAssignment[] | null> => {
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
};

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
};

export const updateAssignment = async (id: string, assignment: { summary?: string }) => {
  try {
    await apiClient.patch(
      `/assignments/${id}`,
      {
        summary: assignment.summary,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const AssignmentApiService = {
  addAssignment,
  getAssignmentsForStudent,
  getAssignmentsByClassRoomId,
  getAssignmentById,
  updateAssignment,
};