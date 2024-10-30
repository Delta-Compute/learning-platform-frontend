import React, { useEffect, useState } from "react";
import { User } from '../types';
import { jwtDecode } from 'jwt-decode';
import { useGetUser } from '../hooks';

interface UserContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = React.createContext({} as UserContext);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const { data } = useGetUser(userId || '');

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.sub) {
          setUserId(decoded.sub);
          console.log("Decoded token:", decoded);
          
        } else {
          console.error("Token does not contain 'sub'");
        }
      } catch (error) {
        console.error("Failed to decode JWT token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
