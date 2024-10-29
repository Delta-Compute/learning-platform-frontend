import { User } from "../../types";

import { apiClient } from "../../vars/axios-var.ts";

export const getUser = async (id: string): Promise<User | null> => {
  try {
    const response = await apiClient.get<User>(
      `/users/${id}`,
    );

    const data = response.data as User;

    return data;
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const updateUser = async (id: string, firstName?: string, lastName?: string, role?: string) => {
  try {
    await apiClient.patch(
      `/users/${id}`,
      {
        firstName,
        lastName,
        role,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const UsersApiService = {
  getUser,
  updateUser,
};