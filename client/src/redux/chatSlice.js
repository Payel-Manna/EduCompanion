// src/redux/chatSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../apicalls/axiosInstance";

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ query, token }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        "/api/chat",
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { query, ...res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { error: "Failed to send message" }
      );
    }
  }
);

// Load chat history on mount
export const loadChatHistory = createAsyncThunk(
  "/apichat/loadHistory",
  async ({ token }, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/chat/history", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.messages || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { error: "Failed to load history" }
      );
    }
  }
);

const initialState = {
  messages: [],
  sources: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChat: (state) => {
      state.messages = [];
      state.sources = [];
      state.error = null;
    },
    addUserMessage: (state, action) => {
      state.messages.push({
        role: "user",
        content: action.payload,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Add user message immediately
        if (action.meta.arg.query) {
          state.messages.push({
            role: "user",
            content: action.meta.arg.query,
          });
        }
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        // Add AI response
        state.messages.push({
          role: "ai",
          content: action.payload.answer,
        });
        // Update sources
        state.sources = action.payload.sources || [];
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Something went wrong";
        // Remove the pending user message on error
        if (state.messages[state.messages.length - 1]?.role === "user") {
          state.messages.pop();
        }
      });
  },
});

export const { clearChat, addUserMessage } = chatSlice.actions;
export default chatSlice.reducer;
