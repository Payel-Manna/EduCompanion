// models/feedback.models.js
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["general", "bug", "feature", "ui", "ai", "other"],
      default: "general",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
    adminNotes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying
feedbackSchema.index({ user: 1, createdAt: -1 });
feedbackSchema.index({ category: 1, status: 1 });

export default mongoose.model("Feedback", feedbackSchema);