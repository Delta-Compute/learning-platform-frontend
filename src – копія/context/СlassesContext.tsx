import React, { useState } from 'react';
import { Class } from '../types/class';

interface ClassesContext {
  classes: Class[] | null;
  setClasses: React.Dispatch<React.SetStateAction<Class[] | null>>;
}

const ClassesContext = React.createContext({} as ClassesContext);

export const ClassesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [classes, setClasses] = useState<Class[] | null>(null);

  return (
    <ClassesContext.Provider
      value={{
        classes,
        setClasses,
      }}
    >
      {children}
    </ClassesContext.Provider>
  );
};

export default ClassesContext;