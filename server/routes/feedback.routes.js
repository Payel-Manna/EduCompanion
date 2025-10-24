// routes/feedback.routes.js
import express from "express";
import {
  submitFeedback,
  getAllFeedback,
  getUserFeedback,
} from "../controllers/feedback.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const feedbackRouter = express.Router();

// Submit feedback
feedbackRouter.post("/", isAuth, submitFeedback);

// Get user's own feedback
feedbackRouter.get("/my-feedback", isAuth, getUserFeedback);

// Get all feedback (for admin - add admin middleware later)
feedbackRouter.get("/all", isAuth, getAllFeedback);

export default feedbackRouter;