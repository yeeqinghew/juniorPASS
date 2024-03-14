import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import OverallLayout from "../layouts/Layout";
import PartnerLogin from "../components/Partner/Login";
import Profile from "../components/Profile";
import HomePage from "../components/HomePage";
import Classes from "../components/Classes";
import Plans from "../components/Plans";
import Login from "../components/Login";
import Register from "../components/Register";
import UserContext from "../components/UserContext";
import Class from "../components/Classes/Class";
import AuthenticatedRoute from "./AuthenticatedRoute";
import PartnerLayout from "../layouts/PartnerLayout";
import NotFound from "../utils/404";

export default () => {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  //   const token = useLocalStorage("token");

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  const getUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/", {
        method: "GET",
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      const parseRes = await response.json();
      setUser(parseRes);
    } catch (err) {
      console.error("ERROR: No user");
    }
  };

  const isAuth = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      const parseRes = await response.json();
      parseRes === true ? setAuth(true) : setAuth(false);
      getUser();
      setLoading(false);
    } catch (error) {
      console.error("ERRROROROROR", error.message);
    }
  };

  useEffect(() => {
    isAuth();
  }, []);

  //   const handleOnIdle = () => {
  //     if (isAuthenticated) {
  //       return confirmAlert({
  //         title: "Session Timeout",
  //         message: "Are you sure to logout ?",
  //         closeOnEscape: true,

  //         buttons: [
  //           {
  //             label: "Yes",
  //             onClick: () => {
  //               localStorage.removeItem("token");
  //               localStorage.clear();
  //               //   toast.info("You have been logged out");
  //               navigate("/login");
  //             },
  //           },
  //           {
  //             label: "No",
  //             onClick: () => {
  //               return;
  //             },
  //           },
  //         ],
  //       });
  //     }
  //   };

  //   const { getRemainingTime, getLastActiveTime } = useIdleTimer({
  //     timeout: 900000,
  //     //timeout: 1000,
  //     onIdle: handleOnIdle,
  //     // onActive: handleOnActive,
  //     // onAction: handleOnAction,
  //     debounce: 1000,
  //   });

  //   useEffect(() => {
  //     isAuth();
  //   }, [isAuthenticated]);

  return (
    <UserContext.Provider value={{ user }}>
      <BrowserRouter>
        <script src="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.js"></script>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css"
          rel="stylesheet"
        />
        <script src="path-to-the-file/splide.min.js"></script>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap')
        </style>
        <link
          href="http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.css"
          rel="stylesheet"
          type="text/css"
        ></link>
        <Routes>
          <Route
            element={
              <OverallLayout
                isAuthenticated={isAuthenticated}
                setAuth={setAuth}
                setLoading={setLoading}
              />
            }
          >
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/classes" element={<Classes />}></Route>
            <Route path="/class/:classId" element={<Class />}></Route>
            <Route path="/plans" element={<Plans />}></Route>
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <Login setAuth={setAuth} />
                ) : (
                  <Navigate replace to="/profile" />
                )
              }
            ></Route>
            <Route
              path="/register"
              element={
                !isAuthenticated ? (
                  <Register setAuth={setAuth} />
                ) : (
                  <Navigate replace to="/profile" />
                )
              }
            ></Route>
            {/*******************
             ******* User *******
             *******************/}
            <Route
              element={
                <AuthenticatedRoute
                  isAuthenticated={isAuthenticated}
                  loading={loading}
                />
              }
            >
              <Route path="/profile" element={<Profile />}></Route>
            </Route>
            <Route path="*" element={<NotFound />}></Route>
          </Route>
          {/*******************
           *****  Partner *****
           *******************/}
          <Route element={<PartnerLayout />}>
            <Route path="/partner/login" element={<PartnerLogin />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};
