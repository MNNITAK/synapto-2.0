import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

const extractText = async (file) => {
  try {
    let buffer;

    // Handle both memory storage (buffer) and disk storage (path)
    if (file.buffer) {
      // Memory storage - file is already in buffer
      console.log("Using file buffer, size:", file.buffer.length);
      buffer = file.buffer;
    } else if (file.path) {
      // Disk storage - read file from path
      const filePath = path.resolve(file.path);
      console.log("Reading file from path:", filePath);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error("File not found on server.");
      }

      buffer = fs.readFileSync(filePath);
      console.log("Buffer length:", buffer.length);
    } else {
      throw new Error("No file buffer or path available");
    }

    // Validate buffer
    if (!buffer || buffer.length === 0) {
      throw new Error("File buffer is empty");
    }

    // Parse PDF
    console.log("Parsing PDF...");
    const data = await pdfParse(buffer);
    console.log("PDF parsed successfully, text length:", data.text?.length || 0);

    // Extract and limit text
    const text = data.text?.slice(0, 1500) || "No readable text found.";
    console.log("Extracted text preview:", text.substring(0, 100) + "...");

    return text;

  } catch (error) {
    console.error("Extract text error:", error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
};

export default extractText;