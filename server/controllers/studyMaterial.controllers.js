// controllers/studyMaterial.controllers.js
import { createEmbedding } from "../config/embeddingHelper.js";
import StudyMaterial from "../models/studyMaterials.models.js";

// Import awardXP function - make it optional so it doesn't break if file doesn't exist
let awardXP;
try {
  const gamification = await import("./gamification.controllers.js");
  awardXP = gamification.awardXP;
} catch (err) {
  console.warn("⚠️ Gamification module not found, XP awarding disabled");
  awardXP = async () => {}; // Dummy function
}

/**
 * Add new study material with embedding
 */
export const addMaterial = async (req, res) => {
  try {
    const { title, topic, content, type, difficulty, url } = req.body;
    const userId = req.user._id; // Assuming your isAuth middleware sets req.user

    // Validation
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    console.log(`📝 Adding material: "${title}" for user ${userId}`);

    // Generate embedding from content
    console.log("🔄 Generating embedding...");
    const embedding = await createEmbedding(content);
    console.log(`✅ Embedding generated (${embedding.length} dimensions)`);

    // Create and save material
    const newMaterial = new StudyMaterial({
      title: title.trim(),
      topic: topic.trim(),
      content: content.trim(),
      type: type || "notes",
      difficulty: difficulty || "beginner",
      url: url || undefined,
      summary: content.substring(0, 200) + (content.length > 200 ? "..." : ""),
      embedding,
      createdBy: userId,
    });

    await newMaterial.save();

    // Award XP for adding material
    await awardXP(userId, 20, {
      icon: "📚",
      title: `Added study material: ${title}`,
    });

    console.log(`✅ Material saved with ID: ${newMaterial._id}`);

    res.status(201).json({
      message: "Material added successfully",
      xpAwarded: 20,
      material: {
        id: newMaterial._id,
        title: newMaterial.title,
        topic: newMaterial.topic,
        type: newMaterial.type,
        difficulty: newMaterial.difficulty,
        createdAt: newMaterial.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Add Material Error:", error);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: "Validation failed", 
        details: errors 
      });
    }

    res.status(500).json({ 
      error: "Failed to add material",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

/**
 * Get all materials with optional filters
 */
export const getAllMaterials = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, difficulty, type, search, limit = 50, skip = 0 } = req.query;

    console.log("📚 Fetching materials for user:", userId);

    // Build filter
    const filter = { createdBy: userId };

    if (topic) {
      filter.topic = { $regex: new RegExp(topic, "i") };
    }
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    
    if (type) {
      filter.type = type;
    }

    // Text search
    if (search) {
      filter.$or = [
        { title: { $regex: new RegExp(search, "i") } },
        { content: { $regex: new RegExp(search, "i") } },
        { topic: { $regex: new RegExp(search, "i") } },
      ];
    }

    const materials = await StudyMaterial.find(filter)
      .select("-embedding") // Don't send embeddings to frontend
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await StudyMaterial.countDocuments(filter);

    console.log(`✅ Found ${materials.length} materials (${total} total)`);

    // Return materials directly (not nested in 'materials' property)
    res.status(200).json(materials);
  } catch (err) {
    console.error("❌ Get All Materials Error:", err);
    res.status(500).json({ error: "Failed to fetch materials" });
  }
};

/**
 * Get material by ID
 */
export const getMaterialById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const material = await StudyMaterial.findOne({
      _id: id,
      createdBy: userId,
    }).select("-embedding");

    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    res.status(200).json(material);
  } catch (err) {
    console.error("❌ Get Material By ID Error:", err);
    res.status(500).json({ error: "Failed to fetch material" });
  }
};

/**
 * Update material
 */
export const updateMaterial = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, topic, content, type, difficulty, url } = req.body;

    const material = await StudyMaterial.findOne({
      _id: id,
      createdBy: userId,
    });

    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    // Update fields
    if (title) material.title = title.trim();
    if (topic) material.topic = topic.trim();
    if (type) material.type = type;
    if (difficulty) material.difficulty = difficulty;
    if (url !== undefined) material.url = url;

    // If content changed, regenerate embedding
    if (content && content !== material.content) {
      console.log("🔄 Content changed, regenerating embedding...");
      material.content = content.trim();
      material.embedding = await createEmbedding(content);
      material.summary = content.substring(0, 200) + (content.length > 200 ? "..." : "");
      console.log("✅ Embedding regenerated");
    }

    await material.save();

    console.log(`✅ Material ${id} updated`);

    res.status(200).json({
      message: "Material updated successfully",
      material: {
        id: material._id,
        title: material.title,
        topic: material.topic,
        type: material.type,
        difficulty: material.difficulty,
      },
    });
  } catch (err) {
    console.error("❌ Update Material Error:", err);
    res.status(500).json({ error: "Failed to update material" });
  }
};

/**
 * Delete material
 */
export const deleteMaterial = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const result = await StudyMaterial.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });

    if (!result) {
      return res.status(404).json({ error: "Material not found" });
    }

    console.log(`✅ Material ${id} deleted`);

    res.status(200).json({ message: "Material deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Material Error:", err);
    res.status(500).json({ error: "Failed to delete material" });
  }
};

/**
 * Get topics list (for dropdown)
 */
export const getTopics = async (req, res) => {
  try {
    const userId = req.user._id;

    const topics = await StudyMaterial.distinct("topic", {
      createdBy: userId,
    });

    res.status(200).json({ topics: topics.sort() });
  } catch (err) {
    console.error("❌ Get Topics Error:", err);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
};

/**
 * Get statistics
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [total, byTopic, byType, byDifficulty] = await Promise.all([
      StudyMaterial.countDocuments({ createdBy: userId }),
      StudyMaterial.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: "$topic", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      StudyMaterial.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]),
      StudyMaterial.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: "$difficulty", count: { $sum: 1 } } },
      ]),
    ]);

    res.status(200).json({
      total,
      byTopic,
      byType,
      byDifficulty,
    });
  } catch (err) {
    console.error("❌ Get Stats Error:", err);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};