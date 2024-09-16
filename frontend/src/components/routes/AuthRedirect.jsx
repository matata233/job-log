import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRedirect = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.userInfo) !== null;

  const from = location.state?.from?.pathname || "/dashboard";
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  return children;
};

export default AuthRedirect;
