// src/components/SignupForm.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signupUser } from "../redux/authSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result=await dispatch(signupUser({ name, userName, email, password }));
    setLoading(false);
    if (result.meta.requestStatus === "fulfilled") { navigate("/dashboard"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <motion.div
        className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.02 }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
