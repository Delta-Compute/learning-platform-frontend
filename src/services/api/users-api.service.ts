import { User } from "../../types";
import { UserResponse } from "../../types/userResponse.ts";

import { apiClient } from "../../vars/axios-var.ts";

export const getUser = async (id: string): Promise<User | null> => {
  try {
    const response = await apiClient.get<User | null>(`/users/${id}`);

    const data = response.data as User;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateUser = async (
  id: string,
  firstName?: string,
  lastName?: string,
  role?: string,
  foreignLanguage?: string,
  natureLanguage?: string
) => {
  try {
    
    const response = await apiClient.patch(`/users/${id}`, {
      firstName,
      lastName,
      role,
      natureLanguage,
      foreignLanguage,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const signIn = async (credentials: {
  email: string;
  password: string;
}): Promise<UserResponse> => {
  try {
    const response = await apiClient.post("/auth/sign-in", credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const signUp = async (data: {
  email: string;
  password: string;
}): Promise<UserResponse> => {
  try {
    const response = await apiClient.post("/auth/sign-up", data);
    return response.data;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

export const UsersApiService = {
  getUser,
  updateUser,
  signIn,
  signUp,
};
