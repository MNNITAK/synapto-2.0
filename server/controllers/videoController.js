// import { downloadYouTubeAudio } from "../utils/downloadYT.js";
// import { transcribeAudio } from "../utils/transcribeAudio.js";
// import { OpenAI } from "openai";
// import fs from "fs";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export const processYouTubeVideo = async (req, res) => {
//   try {
//     const { videoUrl } = req.body;

//     const audioPath = await downloadYouTubeAudio(videoUrl);
//     const transcript = await transcribeAudio(audioPath);

//     const summaryResponse = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         { role: "system", content: "Summarize this YouTube transcript:" },
//         { role: "user", content: transcript },
//       ],
//     });

//     fs.unlinkSync(audioPath); // Clean up

//     res.json({ summary: summaryResponse.choices[0].message.content });
//   } catch (err) {
//     console.error("Summarization error:", err);
//     res.status(500).json({ error: "Failed to summarize video" });
//   }
// };


