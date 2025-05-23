import { School } from "../context";

export interface Class {
  id?: string;
  name: string;
  teacherId?: string;
  logo?: string;
  studentEmails?: string[];
  assignmentIds?: string[];
  learningPlan?: string;
  verificationCode: string;
  subject: string;
  school?: School;
};