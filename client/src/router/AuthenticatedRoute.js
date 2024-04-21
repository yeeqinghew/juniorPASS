import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../utils/Spinner";
import toast from "react-hot-toast";

const AuthenticatedRoute = ({
  isAuthenticated,
  loading,
  isLoggingOut,
  ...props
}) => {
  if (!isAuthenticated && !loading && !isLoggingOut) {
    toast.error("You have not logged in");
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <Spinner />;
  }

  return <Outlet {...props} />;
};
export default AuthenticatedRoute;
