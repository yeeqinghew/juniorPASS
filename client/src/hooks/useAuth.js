// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { useLocalStorage } from "./useLocalStorage";
// import { useNavigate } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";
// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();

//   // call this function when you want to authenticate the user
//   const login = async (values) => {
//     try {
//       const response = await fetch("http://localhost:5000/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(values),
//       });

//       const parseRes = await response.json();
//       if (parseRes.token) {
//         localStorage.setItem("user", JSON.stringify({ token: parseRes.token }));
//         setAuth(true);
//         // TODO: setUser
//         toast.success("Login successfully");
//       } else {
//         setAuth(false);
//         setUser(null);
//         toast.error("Wrong credential");
//       }
//     } catch (error) {
//       console.error(error.message);
//       toast.error(error.message);
//     }
//     setUser(values);
//     navigate("/profile");
//   };

//   // call this function to sign out logged in user
//   const logout = () => {
//     localStorage.removeItem("user");
//     setAuth(false);
//     // logout of Google account
//     toast.success("Logout successfully");
//     setUser(null);
//     navigate("/", { replace: true });
//   };

//   const value = useMemo(
//     () => ({
//       user,
//       isAuthenticated,
//       setUser,
//       setAuth,
//       login,
//       logout,
//     }),
//     [user]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };
