import dotenv from "dotenv";
import File from "../models/File.js";
import { CohereClientV2 } from "cohere-ai";

dotenv.config();

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

export const generateQuiz = async (req, res) => {
  try {
    const { fileId } = req.body;
    const file = await File.findById(fileId);

    if (!file || !file.textContent) {
      return res
        .status(404)
        .json({ success: false, message: "File text not found" });
    }

    const prompt = `
Generate 5 multiple choice questions from the following academic content.
Each question should:
1. Be clearly worded and based on the text.
2. Have 4 options labeled A, B, C, D.
3. Include the correct answer letter as "answer".

Respond ONLY in valid JSON like this:
[
  {
    "question": "What is the capital of India?",
    "options": ["A. Mumbai", "B. New Delhi", "C. Kolkata", "D. Chennai"],
    "answer": "B"
  }
]

Text:
"""
${file.textContent.substring(0, 3000)}
"""
`;

    const raw = await cohere.chat({
      model: 'command-a-03-2025',
      messages: [
        { role: 'user', content: prompt },
      ],
    });

    const rawText = raw?.message?.content?.[0]?.text || "";
    const match = rawText.match(/\[\s*{[\s\S]*?}\s*\]/);

    let quiz = [];
    if (match) {
      try {
        quiz = JSON.parse(match[0]);
      } catch (e) {
        console.error("Quiz JSON parse error:", e.message);
      }
    } else {
      console.error("No valid JSON array found in model output.");
    }

    return res.status(200).json({ success: true, quiz });

  } catch (err) {
    console.error("Quiz Generation Error:", err.message);
    return res.status(500).json({ success: false, message: "Quiz generation failed." });
  }
};
