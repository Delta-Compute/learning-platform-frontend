export type SignUpDto = {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  role?: string;
};

export enum AuthProvider {
  Google = "google",
  Facebook = "facebook",
  Apple = "apple",
}

export type UpdateUserDto = {
  refreshToken?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
};

export type SignUpResponse = {
  email: string;
  id: string;
  accessToken: string;
  refreshToken: string;
};
