import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    materials: [{ type: mongoose.Schema.Types.ObjectId, ref: "StudyMaterial" }],
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    duration: { type: Number }, // in minutes
    focusLevel: { type: Number, min: 1, max: 10 },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("StudySession", studySessionSchema);
