import axiosInstance from "./axiosInstance";

export const signup = async (formData) => {
  try {
    const res = await axiosInstance.post("/api/auth/signup", formData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Signup failed" };
  }
};

export const login = async (formData) => {
  try {
    const res = await axiosInstance.post("/api/auth/login", formData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

export const logout = async () => {
  try {
    const res = await axiosInstance.post("/api/auth/signout");
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Logout failed" };
  }
};
