import { School } from "../context";

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
  school: School;
  nativeLanguage?: string;
  foreignLanguage?: string;
};