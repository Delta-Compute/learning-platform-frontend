export enum UserRole {
  Teacher = "teacher",
  Student = "student",
};

export type User = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: UserRole;
};