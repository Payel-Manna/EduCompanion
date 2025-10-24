import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  role: { 
    type: String, 
    enum: ["user", "assistant"], 
    required: true 
  },
  content: { 
    type: String, 
    required: true,
    maxlength: [10000, "Message content too long"]
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
});

const chatSessionSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true,
      unique: true // One session per user
    },
    messages: {
      type: [chatMessageSchema],
      validate: {
        validator: function(v) {
          return Array.isArray(v) && v.length <= 100;
        },
        message: "Cannot store more than 100 messages"
      }
    },
    aiPersona: { 
      type: String, 
      default: "study_assistant",
      enum: ["study_assistant", "tutor", "mentor"]
    },
  },
  { 
    timestamps: true 
  }
);

// Virtual for message count
chatSessionSchema.virtual("messageCount").get(function() {
  return this.messages.length;
});

export default mongoose.model("ChatSession", chatSessionSchema);