import ChatBot from "../models/ChatBot.js";
import openRouter from "../utils/openrouter.js";



// Send message and get smart GPT-based reply
export const getBotResponse = async (req, res) => {
  try {
    const userId = req.user._id;
    const userMessage = req.body.message;

    // Reject very long messages early
    if (userMessage.length > 500) {
      return res.status(400).json({ message: "Message too long" });
    }

     let chat = await ChatBot.findOne({ user: userId });
      // add context awareness to remember latest chats 
      // This gives the bot the last 5 messages, so it understands context like follow-ups
      const recentMessages = chat?.messages?.slice(-5).map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      })) || [];
      
      recentMessages.push({ role: "user", content: userMessage });
      
      const response = await openRouter.post('/chat/completions', {
        model: "meta-llama/llama-3-8b-instruct",
        messages: recentMessages,
      
    });

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error("Invalid response from OpenRouter");
    }
    
    const botReplyText =
      response.data.choices[0]?.message?.content?.trim() ||
      "Hmm... I’m not sure how to respond to that.";

    const botReply = { sender: "bot", text: botReplyText };

    const now = new Date();
    if (!chat) {
      chat = new ChatBot({
        user: userId,
        messages: [
          { sender: "user", text: userMessage, time: now },
          { ...botReply, time: new Date() },
        ],
      });      
    } else {
      chat.messages.push(
        { sender: "user", text: userMessage, time: now },
        { ...botReply, time: new Date() }
      );      
    }
    // Limit messages to last 50 to prevent DB overflow
    if (chat.messages.length > 50) {
      chat.messages = chat.messages.slice(-50);
    }

    await chat.save();
    res.status(200).json({ reply: botReply.text });

  } catch (err) {
    console.error("ChatBot error:", err.message);
    res.status(500).json({ message: "Failed to fetch reply from OpenRouter" });
  }
};

// Load previous chat history
export const getChatHistory = async (req, res) => {
  try {
    const chats = await ChatBot.find({ user: req.user.id }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Failed to load chat history" });
  }
};

// Clear all messages in chat document
export const clearChatHistory = async (req, res) => {
  try {
    await ChatBot.findOneAndUpdate(
      { user: req.user._id },
      { $set: { messages: [] } } // Clears only messages, not the document
    );
    res.status(200).json({ message: "Chat history cleared." });
  } catch (err) {
    console.error("Error clearing chat:", err);
    res.status(500).json({ message: "Failed to clear chat history." });
  }
};