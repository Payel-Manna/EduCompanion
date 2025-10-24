// controllers/feedback.controller.js
import Feedback from "../models/feedback.models.js";

/**
 * Submit feedback
 */
export const submitFeedback = async (req, res) => {
  try {
    const { category, rating, message } = req.body;
    const userId = req.user._id;

    // Validation
    if (!message || !message.trim()) {
      return res.status(400).json({ 
        error: "Message is required",
        message: "Please provide feedback message"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        error: "Invalid rating",
        message: "Rating must be between 1 and 5"
      });
    }

    const feedback = new Feedback({
      user: userId,
      category: category || "general",
      rating: rating || 5,
      message: message.trim(),
    });

    await feedback.save();

    console.log(`✅ Feedback submitted by user ${userId}`);

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: {
        id: feedback._id,
        category: feedback.category,
        rating: feedback.rating,
      },
    });
  } catch (err) {
    console.error("Submit feedback error:", err);
    res.status(500).json({ 
      error: "Failed to submit feedback",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

/**
 * Get all feedback (admin only)
 */
export const getAllFeedback = async (req, res) => {
  try {
    const { category, rating, limit = 50 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (rating) filter.rating = parseInt(rating);

    const feedbacks = await Feedback.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({ feedbacks, total: feedbacks.length });
  } catch (err) {
    console.error("Get feedback error:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};

/**
 * Get user's own feedback
 */
export const getUserFeedback = async (req, res) => {
  try {
    const userId = req.user._id;

    const feedbacks = await Feedback.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ feedbacks });
  } catch (err) {
    console.error("Get user feedback error:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};