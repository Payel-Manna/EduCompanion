// src/components/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * Wrap your protected pages with this component.
 * Redirects users to /login if they are not authenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
