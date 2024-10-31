interface IStudentProgress {
  studentEmail: string;
  progress: boolean;
  feedback: string;
}

export interface IClassRoomProgress {
  id?: string;
  classRoomId: string;
  assignmentId: string;
  studentsProgress: IStudentProgress[];
}