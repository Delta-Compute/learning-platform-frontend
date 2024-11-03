export interface IAssignment {
  id?: string;
  description: string;
  classRoomId: string;
  title: string;
  topic: string;
  deadline: string;
  createdAt?: number;
  status?: string;
}