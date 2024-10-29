export type ClassRoom = {
  id?: string;
  name: string;
  teacherId: string;
  logo: string;
  studentEmails: string[];
  assignmentIds: string[];
  learningPlan: string;
  createdAt: number;
};