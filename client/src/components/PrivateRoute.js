import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { token } = useSelector((state) => state.auth); // ✅ Get token from Redux

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
