import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

export enum School {
  MapleBear = "maple-bear",
  AdeliaCosta = "adelia-costa",
  SB = "sb",
  Educare = "educare",
  Beka = "beka"
};

interface SchoolNamesContextType {
  currentSchoolName: School;
};

const SchoolNamesContext = React.createContext({} as SchoolNamesContextType);

export const SchoolNamesContextProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const storedSchoolName = localStorage.getItem("school-name");
  const initialSchoolName = storedSchoolName ? JSON.parse(storedSchoolName) : School.MapleBear;
  const [currentSchoolName, setCurrentSchoolName] = useState<School>(initialSchoolName);

  useEffect(() => {
    if (localStorage.getItem("school-name")) {
      setCurrentSchoolName(JSON.parse(localStorage.getItem("school-name") || ""));
    }
  }, [location]);

  return (
    <SchoolNamesContext.Provider
      value={{
        currentSchoolName,
      }}
    >
      {children}
    </SchoolNamesContext.Provider>
  );
};

export default SchoolNamesContext;