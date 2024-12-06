import { School } from "../context";

export enum UserRole {
  Teacher = "teacher",
  Student = "student",
};

export enum UserAuthType {
  Email = "email",
  Google = "google",
  AI = "ai"
}

export type User = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: UserRole;
  school: School;
  natureLanguage?: string;
  foreignLanguage?: string;
  auth: UserAuthType;
  schoolName?: string;
};