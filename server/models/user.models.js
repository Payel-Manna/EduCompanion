// models/user.models.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    // Gamification fields
    xp: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    badges: {
      type: [String],
      default: [],
    },
    quizzesCompleted: {
      type: Number,
      default: 0,
    },
    quizScores: {
      type: [Number],
      default: [],
    },
    recentActivity: [
      {
        icon: String,
        title: String,
        timestamp: Date,
        xp: Number,
      },
    ],
    // Profile
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for current level
userSchema.virtual("level").get(function () {
  return Math.floor(this.xp / 1000) + 1;
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);