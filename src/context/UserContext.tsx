import React, { useEffect, useState } from "react";

import { User } from "../types";
import { jwtDecode } from "jwt-decode";
import { useGetUser } from "../hooks";

interface UserContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userId: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  accessToken: string | null;
  isUserRefetching: boolean;
  isUserPending: boolean;
  logout: () => void;
};

const UserContext = React.createContext({} as UserContext);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("token") || "");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    setAccessToken(null);
    setUser(null);
  };

  const { 
    data: userData, 
    refetch: refetchUser,
    isRefetching: isUserRefetching, 
    isPending: isUserPending,
  } = useGetUser(userId);

  const getUserId = async () => {
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
  };

  useEffect(() => {
    if (accessToken) {
      (async () => await getUserId())();
    }
  }, [accessToken]);

  useEffect(() => {
    if (userId !== "") {
      refetchUser();
    }
  }, [userId, refetchUser]);

  useEffect(() => {
    if (userData && !isUserRefetching) {
      setUser(userData);
    }
  }, [userData, isUserRefetching]);

  useEffect(() => {
    if (accessToken) {
      const expirationTime = Number(localStorage.getItem("expirationTime")) * 1000;
      const timer = setTimeout(logout, expirationTime);

      return () => clearTimeout(timer);
    }
  }, [accessToken, logout]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userId,
        setAccessToken,
        accessToken,
        isUserRefetching,
        isUserPending,
        logout,
        // refetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
