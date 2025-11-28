import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer/dist/index.legacy.cjs.js";
import OverallLayout from "../layouts/Layout";
import Profile from "../components/Profile";
import HomePage from "../components/HomePage";
import Classes from "../components/Classes";
import Pricing from "../components/Pricing";
import Login from "../components/Login";
import Register from "../components/Register";
import VerifyOTP from "../components/VerifyOTP";
import { useUserContext } from "../components/UserContext";
import Class from "../components/Classes/Class";
import AuthenticatedRoute from "./AuthenticatedRoute";
import { confirmAlert } from "react-confirm-alert"; // Import
import toast from "react-hot-toast";
import ContactUs from "../components/ContactUs";
import FAQ from "../components/FAQ";
import AboutUs from "../components/AboutUs";
import LoggedInLayout from "../layouts/LoggedInLayout";
import Partner from "../components/Partner";
import getBaseURL from "../utils/config";

import "mapbox-gl/dist/mapbox-gl.css";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";

export default () => {
  const navigate = useNavigate();
  const { isAuthenticated, setLoading, setAuth } = useUserContext();
  const baseURL = getBaseURL();

  const handleOnIdle = () => {
    if (isAuthenticated) {
      confirmAlert({
        title: "Session Timeout",
        message: "Are you sure to logout?",
        closeOnEscape: true,
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              try {
                const token = localStorage.getItem("token");
                if (token) {
                  await fetch(`${baseURL}/auth/logout`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  });
                }
              } catch (e) {
                console.error("Logout error:", e);
              }
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
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route element={<OverallLayout />}>
          <Route path="/classes" element={<Classes />} />
          <Route path="/class/:classId" element={<Class />} />
          <Route path="/partner/:partnerId" element={<Partner />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/partner-contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login />
              ) : (
                <Navigate replace to="/profile" state={"account"} />
              )
            }
          ></Route>
          <Route
            path="/register"
            element={
              !isAuthenticated ? (
                <Register />
              ) : (
                <Navigate replace to="/profile" state={"account"} />
              )
            }
          ></Route>
          <Route path="/verify-otp" element={<VerifyOTP />} />

          <Route element={<AuthenticatedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};
