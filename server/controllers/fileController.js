
import File from "../models/File.js";
import {cloudinary} from "../utils/cloudinary.js";
import extractText from "../utils/extractText.js";

export const uploadFile = async (req, res) => {
  try {
    const { title, subject } = req.body;

    // Ping test (optional)
    try {
      const pingResult = await cloudinary.api.ping();
      console.log("Cloudinary ping successful:", pingResult);
    } catch (pingError) {
      console.error("Cloudinary ping failed:", pingError);
    }
    
    console.log("File received:", req.file.originalname, "Size:", req.file.size);
console.log("file in buffer",req.file.buffer);
    // Fixed Cloudinary upload - removed format parameter and used auto resource_type
    const uploaded = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", // Changed from "raw" to "auto"
          folder: "study_files",
          // Removed format: "pdf" - let Cloudinary auto-detect
          public_id: `${Date.now()}-${req.file.originalname.replace(/\.[^/.]+$/, "")}`, // Optional: custom public_id
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload result:", result);
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    console.log("Cloudinary upload successful:", uploaded.secure_url);

    // Extract text
   
    const text = await extractText(req.file);

    // Save to DB
    const saved = await File.create({
      fileName: req.file.originalname,
      title,
      subject,
      fileUrl: uploaded.secure_url,
      textContent: text,
      publicId: uploaded.public_id, // Store public_id for future operations
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ 
      message: "File upload failed.", 
      error: err.message 
    });
  }
};

export const getFiles = async (req, res) => {
  try {
    const files = await File.find({ subject: req.query.subject });
    res.json(files);
  } catch (err) {
    console.error("Get files error:", err);
    res.status(500).json({ 
      message: "Failed to retrieve files.", 
      error: err.message 
    });
  }
};