import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [chatMessageSchema],
    aiPersona: { type: String, default: "default_mentor" },
  },
  { timestamps: true }
);

export default mongoose.model("ChatSession", chatSessionSchema);
