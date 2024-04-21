import toast from "react-hot-toast";
const { useState, useEffect } = require("react");

const useAuth = () => {
  const [user, setUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const token = localStorage.getItem("token");

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  const getUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const parseRes = await response.json();
      setUser({ parseRes, ...token });
    } catch (err) {
      console.error("ERROR in /auth/: No user", err.message);
    }
  };

  const isAuth = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const parseRes = await response.json();
      if (response.status === 200 && parseRes === true) {
        setAuth(true);
        getUserInfo();
        setLoading(false);
      } else {
        toast.error(parseRes.error);
        localStorage.clear();
        setAuth(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("ERROR in /auth/is-verify: ", error);
      localStorage.clear();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    isAuth();
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    loading,
    setLoading,
    isLoggingOut,
    setIsLoggingOut,
    user,
    setAuth,
  };
};

export default useAuth;
