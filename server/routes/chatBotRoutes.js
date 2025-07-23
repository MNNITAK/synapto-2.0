import express from "express";
import { getBotResponse, getChatHistory, clearChatHistory } from "../controllers/chatBotController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, getBotResponse);
router.get("/", protect, getChatHistory);
router.delete("/", protect, clearChatHistory);

export default router;