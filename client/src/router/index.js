import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer/dist/index.legacy.cjs.js";
import "mapbox-gl/dist/mapbox-gl.css";
import OverallLayout from "../layouts/Layout";
import Profile from "../components/Profile";
import HomePage from "../components/HomePage";
import Classes from "../components/Classes";
import Pricing from "../components/Pricing";
import Login from "../components/Login";
import Register from "../components/Register";
import UserContext from "../components/UserContext";
import Class from "../components/Classes/Class";
import AuthenticatedRoute from "./AuthenticatedRoute";
import NotFound from "../utils/404";
import { confirmAlert } from "react-confirm-alert"; // Import
import toast, { Toaster } from "react-hot-toast";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import useAuth from "../hooks/useAuth";
import ContactUs from "../components/ContactUs";
import FAQ from "../components/FAQ";
import AboutUs from "../components/AboutUs";
import LoggedInLayout from "../layouts/LoggedInLayout";
import Account from "../components/Profile/Account";
import Partner from "../components/Partner";

export default () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    loading,
    setLoading,
    isLoggingOut,
    setIsLoggingOut,
    user,
    setAuth,
  } = useAuth();

  const handleOnIdle = () => {
    if (isAuthenticated) {
      confirmAlert({
        title: "Session Timeout",
        message: "Are you sure to logout?",
        closeOnEscape: true,
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              localStorage.removeItem("token");
              localStorage.clear();
              setAuth(false);
              setLoading(false);
              toast.success("You have been logged out");
              navigate("/login");
            },
          },
          {
            label: "No",
            onClick: () => {
              return;
            },
          },
        ],
      });
    }
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 7200000, // 2hr
    // timeout: 1000,
    onIdle: handleOnIdle,
  });

  return (
    <UserContext.Provider value={{ user }}>
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
      <Toaster />
      <Routes>
        <Route
          element={
            <OverallLayout
              isAuthenticated={isAuthenticated}
              setAuth={setAuth}
              setLoading={setLoading}
              setIsLoggingOut={setIsLoggingOut}
            />
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/class/:classId" element={<Class />} />
          <Route path="/partner/:partnerId" element={<Partner />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/partner-contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login setAuth={setAuth} />
              ) : (
                <Navigate replace to="/profile" state={"account"} />
              )
            }
          ></Route>
          <Route
            path="/register"
            element={
              !isAuthenticated ? (
                <Register setAuth={setAuth} />
              ) : (
                <Navigate replace to="/profile" state={"account"} />
              )
            }
          ></Route>
        </Route>

        {/*******************
         ******* User *******
         *******************/}
        <Route
          element={
            <LoggedInLayout
              isAuthenticated={isAuthenticated}
              setAuth={setAuth}
              setLoading={setLoading}
              setIsLoggingOut={setIsLoggingOut}
            />
          }
        >
          <Route
            element={
              <AuthenticatedRoute
                isAuthenticated={isAuthenticated}
                loading={loading}
                isLoggingOut={isLoggingOut}
              />
            }
          >
            <Route path="/profile" element={<Profile />} />
            <Route path="/account" element={<Account />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};
