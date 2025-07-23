import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["user", "bot"],
      required: true,
    },
    time: {
        type: Date,
        default: Date.now, 
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const chatBotSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true, // Ensures one document per user
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const ChatBot = mongoose.model("ChatBot", chatBotSchema);

export default ChatBot;