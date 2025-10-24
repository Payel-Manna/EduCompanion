// src/apicalls/authApi.js
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000"; // Backend URL
axios.defaults.withCredentials = true; // Allow cookies

export const signup = async (formData) => {
  try {
    const res = await axios.post("/api/auth/signup", formData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Signup failed" };
  }
};

export const login = async (formData) => {
  try {
    const res = await axios.post("/api/auth/login", formData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

export const logout = async () => {
  try {
    const res = await axios.post("/api/auth/signout");
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Logout failed" };
  }
};
