import React, { useState } from "react";

type TeacherTask = {
  id: string;
  title: string;
};

interface TeacherConversationsContextTypes {
  teacherConversations: TeacherTask[];
  addTeacherTask: (title: string) => void;
}

const dummyTeacherTasks = [
  {
    id: "1",
    title: "Explain Present Simple in a game",
  },
  {
    id: "2",
    title: "Explain Present Simple in a game",
  },
  {
    id: "3",
    title: "What is Gerund explain like i am 6",
  },
];

const TeacherConversationsContext = React.createContext(
  {} as TeacherConversationsContextTypes
);

export const TeacherConversationsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [teacherConversations, setTeacherConversations] =
    useState<TeacherTask[]>(dummyTeacherTasks);

  const addTeacherTask = (title: string) => {
    setTeacherConversations((prevItems) => {
      return [...prevItems, { id: Math.random().toString(), title }];
    });
  };

  return (
    <TeacherConversationsContext.Provider
      value={{
        teacherConversations,
        addTeacherTask,
      }}
    >
      {children}
    </TeacherConversationsContext.Provider>
  );
};

export default TeacherConversationsContext;
