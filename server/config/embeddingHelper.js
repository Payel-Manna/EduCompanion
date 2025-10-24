// config/embeddingHelper.js
import { pipeline } from "@xenova/transformers";

let embedPipeline = null;

/**
 * Initialize the embedding model
 * This should be called once when the server starts
 */
export async function initEmbedding() {
  if (!embedPipeline) {
    console.log("🔄 Loading embedding model...");
    try {
      embedPipeline = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
      console.log("✅ Embedding model loaded successfully");
    } catch (error) {
      console.error("❌ Failed to load embedding model:", error);
      throw error;
    }
  }
  return embedPipeline;
}

/**
 * Create embedding for a text string
 * @param {string} text - The text to embed
 * @returns {Promise<number[]>} - Array of 384 numbers (embedding vector)
 */
export async function createEmbedding(text) {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("Invalid text input for embedding");
    }

    // Ensure model is loaded
    const model = await initEmbedding();

    // Generate embedding
    const result = await model(text, {
      pooling: "mean",
      normalize: true,
    });

    // Convert to regular JavaScript array
    let embedding;
    if (result.data) {
      // Xenova transformer returns a tensor with .data property
      embedding = Array.from(result.data);
    } else if (Array.isArray(result)) {
      // If it's already an array, flatten it
      embedding = result.flat(Infinity);
    } else {
      throw new Error("Unexpected embedding format");
    }

    // Verify embedding dimensions (should be 384 for all-MiniLM-L6-v2)
    if (embedding.length !== 384) {
      console.warn(
        `⚠️ Unexpected embedding dimensions: ${embedding.length} (expected 384)`
      );
    }

    return embedding;
  } catch (error) {
    console.error("❌ Error creating embedding:", error);
    throw new Error(`Failed to create embedding: ${error.message}`);
  }
}

/**
 * Batch create embeddings for multiple texts
 * @param {string[]} texts - Array of texts to embed
 * @returns {Promise<number[][]>} - Array of embedding vectors
 */
export async function createBatchEmbeddings(texts) {
  try {
    if (!Array.isArray(texts) || texts.length === 0) {
      throw new Error("Invalid texts array for batch embedding");
    }

    const embeddings = await Promise.all(
      texts.map(text => createEmbedding(text))
    );

    return embeddings;
  } catch (error) {
    console.error("❌ Error creating batch embeddings:", error);
    throw new Error(`Failed to create batch embeddings: ${error.message}`);
  }
}