import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { User } from "../types";
import { jwtDecode } from "jwt-decode";
import { useGetUser } from "../hooks";

interface UserContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userId: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  accessToken: string;
  isUserRefetching: boolean;
  userPending: boolean;
  logout: () => void;
}

const UserContext = React.createContext({} as UserContext);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>(localStorage.getItem("token") || "");

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const { 
    data: userData, 
    refetch: refetchUser, 
    isRefetching: isUserRefetching, 
    isPending: userPending,
  } = useGetUser(userId);

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
    if (userId !== "") {
      refetchUser();
    }
  }, [userId, refetchUser]);

  useEffect(() => {
    if (userData && !isUserRefetching) {
      setUser(userData);
    }
  }, [userData, isUserRefetching]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userId,
        setAccessToken,
        accessToken,
        isUserRefetching,
        userPending,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
