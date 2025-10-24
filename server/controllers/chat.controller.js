// controllers/chat.controllers.js
import dotenv from "dotenv";
dotenv.config();
import StudyMaterial from "../models/studyMaterials.models.js";
import ChatSession from "../models/chatSession.models.js";
import { createEmbedding } from "../config/embeddingHelper.js";
import Groq from "groq-sdk";
import mongoose from "mongoose";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chatWithNotes(req, res) {
  try {
    const { query } = req.body;
    const userId = req.userId;

    if (!query?.trim()) {
      return res.status(400).json({ error: "Query required" });
    }

    console.log("🔍 Processing query:", query);
    console.log("👤 User ID:", userId);

    // 1️⃣ Generate embedding for the query
    const queryEmbeddingResult = await createEmbedding(query);
    
    // Convert to flat array
    let queryEmbedding;
    if (queryEmbeddingResult?.data) {
      queryEmbedding = Array.from(queryEmbeddingResult.data);
    } else if (Array.isArray(queryEmbeddingResult)) {
      queryEmbedding = queryEmbeddingResult.flat(Infinity);
    } else {
      return res.status(500).json({ error: "Failed to generate query embedding" });
    }

    console.log("✅ Query embedding generated, dimensions:", queryEmbedding.length);

    // 2️⃣ Perform vector search using $vectorSearch
    const relevantNotes = await StudyMaterial.aggregate([
      {
        $vectorSearch: {
          index: "vector_index_notes",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 5,
        },
      },
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $project: {
          title: 1,
          content: 1,
          topic: 1,
          type: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    console.log(`📚 Found ${relevantNotes.length} relevant notes`);

    // 3️⃣ Build context from retrieved notes
    let context;
    let contextInfo;

    if (relevantNotes.length > 0) {
      context = relevantNotes
        .map((note, idx) => 
          `[Source ${idx + 1}] Title: ${note.title}\nTopic: ${note.topic}\n\n${note.content}`
        )
        .join("\n\n---\n\n");
      
      contextInfo = `Using ${relevantNotes.length} relevant study materials.`;
    } else {
      context = "No relevant study materials found in your notes.";
      contextInfo = "No materials found. Answering from general knowledge.";
    }

    // 4️⃣ Generate AI response using Groq
    const systemPrompt = `You are an intelligent AI study assistant. Your role is to help students learn by answering their questions based on their study materials.

Instructions:
- Use the provided study materials to answer questions accurately
- If materials are relevant, cite them naturally in your response
- If materials don't contain the answer, acknowledge this and provide helpful general guidance
- Be encouraging and educational in your tone
- Break down complex topics into understandable explanations

Available Study Materials:
${context}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
    });

    const aiResponse = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    console.log("🤖 AI response generated");

    // 5️⃣ Save chat session
    try {
      let chatSession = await ChatSession.findOne({ user: userId });
      if (!chatSession) {
        chatSession = new ChatSession({ 
          user: userId, 
          messages: [],
          aiPersona: "study_assistant"
        });
      }
      
      chatSession.messages.push(
        { role: "user", content: query, timestamp: new Date() },
        { role: "assistant", content: aiResponse, timestamp: new Date() }
      );
      
      // Keep only last 50 messages to prevent bloat
      if (chatSession.messages.length > 50) {
        chatSession.messages = chatSession.messages.slice(-50);
      }
      
      await chatSession.save();
      console.log("💾 Chat session saved");
    } catch (saveError) {
      console.error("⚠️ Failed to save chat session:", saveError);
      // Continue anyway - don't fail the request
    }

    // 6️⃣ Return response with sources
    res.status(200).json({
      answer: aiResponse,
      sources: relevantNotes.map(n => ({
        id: n._id,
        title: n.title,
        topic: n.topic,
        type: n.type,
        relevanceScore: Math.round(n.score * 100) / 100
      })),
      contextInfo,
      hasRelevantMaterials: relevantNotes.length > 0
    });

  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ 
      error: "Failed to process chat request",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

// Optional: Get chat history
export async function getChatHistory(req, res) {
  try {
    const userId = req.user._id;
    
    let chatSession = await ChatSession.findOne({ user: userId });
    
    if (!chatSession) {
      // Create empty session if doesn't exist
      chatSession = new ChatSession({
        user: userId,
        messages: [],
        aiPersona: "study_assistant"
      });
      await chatSession.save();
    }
    
    res.status(200).json({ 
      messages: chatSession.messages || []
    });
  } catch (err) {
    console.error("Get chat history error:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
}

// Optional: Clear chat history
export async function clearChatHistory(req, res) {
  try {
    const userId = req.userId;
    await ChatSession.findOneAndUpdate(
      { user: userId },
      { messages: [] }
    );
    
    res.status(200).json({ message: "Chat history cleared" });
  } catch (err) {
    console.error("Clear chat history error:", err);
    res.status(500).json({ error: "Failed to clear chat history" });
  }
}