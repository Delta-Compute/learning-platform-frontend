export interface IAssignment {
  id?: string;
  description: string;
  classRoomId: string;
  topic: string;
  title: string;
  deadline: string;
  createdAt?: number;
  status?: string;
}