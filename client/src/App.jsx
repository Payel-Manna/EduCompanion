// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * Redirects logged-in users away from login/signup pages
 */
const AuthRedirect = ({ children }) => {
  const { token } = useSelector(state => state.auth);
  return token ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Root redirects to landing */}
        <Route path="/" element={<Navigate to="/landing" replace />} />

        {/* Login & Signup with redirect if already logged in */}
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRedirect>
              <Signup />
            </AuthRedirect>
          }
        />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
