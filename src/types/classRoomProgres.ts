interface IStudentProgress {
  email: string;
  progress: boolean;
  feedback: string;
  firstName: string;
  lastName: string;
}

export interface IClassRoomProgress {
  id?: string;
  classRoomId: string;
  assignmentId: string;
  studentsProgress: IStudentProgress[];
}