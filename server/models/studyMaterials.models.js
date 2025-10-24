// models/studyMaterials.models.js
import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    topic: { type: String, required: true },
    content: { type: String, required: true },
    difficulty: { 
      type: String, 
      enum: ["beginner", "intermediate", "advanced"], 
      default: "beginner" 
    },
    type: { 
      type: String, 
      enum: ["video", "article", "quiz", "summary", "notes"], 
      default: "notes" 
    },
    url: { type: String },
    embedding: { type: [Number], required: true },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
  },
  { timestamps: true }
);

// Create index for vector search
studyMaterialSchema.index({ embedding: "vector" });

export default mongoose.model("StudyMaterial", studyMaterialSchema);