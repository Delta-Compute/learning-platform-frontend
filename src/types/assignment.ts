export interface IAssignment {
  id?: string;
  description: string;
  classRoomId: string;
  topic: string;
  title: string;
<<<<<<< Updated upstream
  topic: string;
  deadline: string;
  createdAt?: number;
=======
  deadline: number;
  createdAt?: string;
>>>>>>> Stashed changes
  status?: string;
}