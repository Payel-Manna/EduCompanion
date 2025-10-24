import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authApi from "../apicalls/authApi";

// Signup
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, thunkAPI) => {
    try {
      const data = await authApi.signup(formData);
      return data; // { user, token }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, thunkAPI) => {
    try {
      const data = await authApi.login(formData);
      return data; // { user, token }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      const data = await authApi.logout();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Signup
      .addCase(signupUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token; // store token
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Signup failed";
      })
      // Login
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token; // store token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      // Logout
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.token = null;
      });
  },
});

export default authSlice.reducer;
