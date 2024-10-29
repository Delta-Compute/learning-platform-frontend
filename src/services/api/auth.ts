import axios from "axios";
import { SignUpDto, SignUpResponse, UpdateUserDto, User } from "./types";
import { API_URL } from "./constants";

export const signUp = async (data: SignUpDto): Promise<SignUpResponse> => {
  const resp = await axios.post<SignUpResponse>(`${API_URL}/auth/sign-up`, {
    ...data,
  });

  return resp.data;
};

export const signIn = async (
  data: Pick<SignUpDto, "email" | "password">
): Promise<User> => {
  const resp = await axios.post<User>(`${API_URL}/auth/sign-in`, {
    ...data,
  });

  return resp.data;
};

export const updateUser = async (id: string, data: UpdateUserDto) => {
  const resp = await axios.patch(`${API_URL}/users/${id}`, {
    ...data,
  });

  return resp.data.data;
};
