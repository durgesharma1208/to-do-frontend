import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../context/authStore";
import Spinner from "../components/Spinner";

const ProtectedRoute = ({ children }) => {
  const { token, user, isLoading, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  if (isLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
