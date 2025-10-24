// components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-blue-600">EduCompanion</Link>
      <div className="flex items-center gap-4">
        <Link to="/login" className="px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800">Login</Link>
        <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sign Up</Link>
        <DarkModeToggle />
      </div>
    </nav>
  );
}
