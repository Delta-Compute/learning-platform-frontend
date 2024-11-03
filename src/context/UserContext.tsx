import React, { useEffect, useState } from "react";
import { User } from '../types';
import { jwtDecode } from 'jwt-decode';
import { useGetUser } from '../hooks';

interface UserContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userId: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  accessToken: string;
}

const UserContext = React.createContext({} as UserContext);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>(localStorage.getItem("token") || '');

  const { data } = useGetUser(userId);

  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        if (decoded?.sub) {
          setUserId(decoded.sub);
        } else {
          console.error("Token does not contain 'sub'");
        }
      } catch (error) {
        console.error("Failed to decode JWT token:", error);
      }
    }
  }, [accessToken, userId]);

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
        userId,
        setAccessToken,
        accessToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
