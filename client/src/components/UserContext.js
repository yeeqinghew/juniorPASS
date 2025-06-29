import React, { createContext, useContext, useEffect, useState } from "react";
import getBaseURL from "../utils/config";
import toast from "react-hot-toast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const baseURL = getBaseURL();
  const [user, setUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  const getUserInfo = async () => {
    try {
      const response = await fetch(`${baseURL}/auth/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const parseRes = await response.json();
      setUser({ ...parseRes, token });
    } catch (err) {
      console.error("ERROR in /auth/: No user", err.message);
    }
  };

  const isAuth = async () => {
    try {
      const response = await fetch(`${baseURL}/auth/is-verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const parseRes = await response.json();
      if (response.status === 200 && parseRes === true) {
        setAuth(true);
        await getUserInfo();
      } else {
        toast.error(parseRes.error);
        localStorage.clear();
        setAuth(false);
      }
    } catch (error) {
      console.error("ERROR in /auth/is-verify: ", error);
      setAuth(false);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false); // If no token, stop loading immediately
      return;
    }

    isAuth();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        setAuth,
        setLoading,
        setUser,
        refreshUser: getUserInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
