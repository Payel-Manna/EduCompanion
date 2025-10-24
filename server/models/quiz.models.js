// models/quiz.models.js
import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: String, required: true },
        explanation: { type: String },
      },
    ],
    generatedBy: { type: String, enum: ["system", "ai"], default: "ai" },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);