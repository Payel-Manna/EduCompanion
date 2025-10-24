// src/redux/quizSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchQuiz = createAsyncThunk(
  "quiz/fetchQuiz",
  async ({ topic, token, difficulty = "intermediate", numQuestions = 5 }, thunkAPI) => {
    try {
      console.log('Fetching quiz with:', { topic, difficulty, numQuestions });
      const res = await axios.post(
        "/api/quiz",
        { topic, difficulty, numQuestions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Quiz response:', res.data);
      return { quiz: res.data.quiz, numQuestions };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { error: "Failed to generate quiz" }
      );
    }
  }
);

const initialState = {
  quiz: [],
  current: 0,
  score: 0,
  answers: [], // Track user answers
  loading: false,
  error: null,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    answerQuestion: (state, action) => {
      const currentQuestion = state.quiz[state.current];
      const isCorrect = currentQuestion?.correctAnswer === action.payload;
      
      // Store answer
      state.answers.push({
        question: currentQuestion?.question,
        selectedAnswer: action.payload,
        correctAnswer: currentQuestion?.correctAnswer,
        isCorrect,
      });
      
      if (isCorrect) {
        state.score += 1;
      }
      
      state.current += 1;
    },
    resetQuiz: (state) => {
      state.current = 0;
      state.score = 0;
      state.quiz = [];
      state.answers = [];
      state.error = null;
    },
    previousQuestion: (state) => {
      if (state.current > 0) {
        state.current -= 1;
        // Remove last answer
        state.answers.pop();
        // Recalculate score
        state.score = state.answers.filter(a => a.isCorrect).length;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quiz = action.payload.quiz;
        state.current = 0;
        state.score = 0;
        state.answers = [];
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to generate quiz";
      });
  },
});

export const { answerQuestion, resetQuiz, previousQuestion } = quizSlice.actions;
export default quizSlice.reducer;