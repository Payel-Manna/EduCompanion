import { groq } from "./groqClient.js";

async function testGroq() {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are EduCompanion AI assistant." },
      { role: "user", content: "Explain quantum computing in one line." },
    ],
  });
  console.log("✅ Groq response:", response.choices[0].message.content);
}

testGroq().catch(console.error);
