import {User, UserAuthType} from "../../types";
import { UserResponse } from "../../types/userResponse.ts";

import { apiClient } from "../../vars/axios-var.ts";

import { School } from "../../context";

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

export const getUsersByEmails = async (emails: string[], school: School): Promise<User[] | null> => {
  try {
    const response = await apiClient.get<User[]>(`/users/find-users/find-all/${school}`, {
      params: { email: emails.join(",") },
    });

    const data = response.data as User[];

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const updateUser = async (
  id: string,
  firstName?: string,
  lastName?: string,
  role?: string,
  foreignLanguage?: string,
  natureLanguage?: string,
  email?: string,
  schoolName?: string,
  secretWords?: {
    color: string;
    number: string;
  },
  userSummary?: string
) => {
  try {
    const response = await apiClient.patch(`/users/${id}`, {
      firstName,
      lastName,
      role,
      natureLanguage,
      foreignLanguage,
      email,
      schoolName,
      secretWords,
      userSummary,
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
  secretWords?: {
    color: string;
    number: string;
  };
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

const findUserByEmail = async (email: string, schoolName: School, authType: UserAuthType): Promise<User[]> => {
  try {
    const response = await apiClient.get(`/users/find-by-email/${email}/${schoolName}/${authType}`);

    return response.data as User[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const sendResetVerificationCode = async (email: string, school: School) => {
  try {
    await apiClient.post("/auth/send-reset-code", {
      email,
      school,
    });
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Something went wrong.");
    }

    throw new Error("Server connection error");
  }
};

const resetPassword = async (email: string, newPassword: string, code: string, school: School) => {
  try {
    await apiClient.post("/auth/verify-reset-code", {
      email,
      newPassword,
      code,
      school,
    });
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Something went wrong.");
    }

    throw new Error("Server connection error");
  }
};

const deleteUserAccount = async (userId: string) => {
  try {
    await apiClient.delete(`/users/${userId}`);
  } catch(error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Something went wrong.");
    }

    throw new Error("Server connection error");
  }
};

export const UsersApiService = {
  getUser,
  updateUser,
  signIn,
  signUp,
  getUsersByEmails,
  findUserByEmail,
  sendResetVerificationCode,
  resetPassword,
  deleteUserAccount,
};
