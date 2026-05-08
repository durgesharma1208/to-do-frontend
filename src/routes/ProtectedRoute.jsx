import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../context/authStore";
import Spinner from "../components/Spinner";

const ProtectedRoute = ({ children }) => {
  const { token, user } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
