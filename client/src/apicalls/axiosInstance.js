// File: client/src/api/axiosInstance.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://educompanion-tzz1.onrender.com/api";

console.log("API URL:", API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token attached to request:", config.url);
    } else {
      console.warn("No token found for request:", config.url);
    }
    
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized (401) - Clearing token and redirecting to login");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      
      // Redirect to login page
      if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
        window.location.href = "/login";
      }
    }
    
    if (error.response?.status === 404) {
      console.error("Not Found (404):", error.config.url);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;