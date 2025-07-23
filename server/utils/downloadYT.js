// import ytdl from "ytdl-core";
// import ffmpeg from "fluent-ffmpeg";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// export const downloadYouTubeAudio = (url) => {
//   return new Promise((resolve, reject) => {
//     const outputPath = path.join(__dirname, "../temp/audio.mp3");

//     ffmpeg(ytdl(url, { quality: "highestaudio" }))
//       .audioBitrate(128)
//       .save(outputPath)
//       .on("end", () => resolve(outputPath))
//       .on("error", reject);
//   });
// };
