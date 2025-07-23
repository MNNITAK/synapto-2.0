import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  fileName: String,
  title: String,
  subject: String,
  fileUrl: String,
  textContent: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("File", fileSchema);
