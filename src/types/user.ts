import { School } from "../context";

export enum UserRole {
  Teacher = "teacher",
  Student = "student",
};

export enum UserAuthType {
  Email = "email",
  Google = "google",
}

export type User = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: UserRole;
  school: School;
  nativeLanguage?: string;
  foreignLanguage?: string;
  auth: UserAuthType;
  schoolName?: string;
};