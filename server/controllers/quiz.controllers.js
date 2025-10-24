// controllers/quiz.controllers.js
import StudyMaterial from "../models/studyMaterials.models.js";
import Quiz from "../models/quiz.models.js";
import { createEmbedding } from "../config/embeddingHelper.js";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateQuiz(req, res) {
  try {
    const { topic, difficulty = "intermediate", numQuestions = 5 } = req.body;
    const userId = req.userId;

    if (!topic) {
      return res.status(400).json({ error: "Topic required" });
    }

    // 1️⃣ Fetch relevant study materials
    const materials = await StudyMaterial.find({
      createdBy: userId,
      topic: { $regex: topic, $options: "i" }
    }).limit(10);

    if (materials.length === 0) {
      return res.status(404).json({ error: "No study materials found for this topic" });
    }

    // 2️⃣ Combine content
    const context = materials
      .map(m => `Title: ${m.title}\n${m.content}`)
      .join("\n\n---\n\n");

    // 3️⃣ Generate quiz using Groq
    const prompt = `Based on the following study materials, generate ${numQuestions} multiple-choice questions at ${difficulty} difficulty level.

Study Materials:
${context}

Format your response as a JSON array with this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Brief explanation of why this is correct"
  }
]

Make sure questions test understanding, not just memorization. Include varied difficulty and cover different aspects of the material.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a quiz generator. Always respond with valid JSON only." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 2048,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    // Parse JSON response
    let quizQuestions;
    try {
      // Extract JSON if wrapped in markdown code blocks
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                       responseText.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : responseText;
      quizQuestions = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse quiz JSON:", responseText);
      return res.status(500).json({ error: "Failed to generate valid quiz format" });
    }

    // 4️⃣ Save quiz to database (optional)
    const quiz = new Quiz({
      topic,
      questions: quizQuestions,
      generatedBy: "ai",
      createdBy: userId
    });
    await quiz.save();

    // 5️⃣ Return quiz
    res.status(200).json({ 
      quiz: quizQuestions,
      quizId: quiz._id,
      topic 
    });

  } catch (err) {
    console.error("Quiz generation error:", err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
}