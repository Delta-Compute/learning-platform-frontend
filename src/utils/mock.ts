export const classesData = [
  { name: "English, Class 5B", students: 24, assignments: 4, id: "1" },
  { name: "English, Class 10A", students: 21, assignments: 6, id: "2" },
  { name: "English, Class 7A", students: 18, assignments: 5, id: "3" },
];

export type TAssignment = {
  title: string;
  deadline: string;
  status: string;
  id: string;
};

export const assignmentsData: TAssignment[] = [
  {
    title: "HM Assignment",
    deadline: "12/12/2021",
    status: "In progress",
    id: "1",
  },
  {
    title: "Assignment 2",
    deadline: "12/12/2021",
    status: "In progress",
    id: "2",
  },
  {
    title: "Assignment 3",
    deadline: "12/12/2021",
    status: "Completed",
    id: "3",
  },
];


