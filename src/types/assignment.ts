export interface IAssignment {
  id?: string;
  description: string;
  classRoomId: string;
  topic: string;
  title: string;
  deadline: number;
  createdAt?: number;
  status?: string;
  summary?: string;
}