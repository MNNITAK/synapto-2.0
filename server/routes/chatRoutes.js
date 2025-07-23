import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import {
  getAllUsers,
  getCurrentUser,
  sendMessage,
  getMessagesWithUser,
  uploadImage,
  getCommunityMessages
} from '../controllers/chatController.js';
import multer from 'multer';
import { chatStorage } from '../utils/cloudinary.js';

const router = express.Router();

// Get all users except self
router.get('/users', protect, getAllUsers);
// Get current logged-in user's data
router.get('/me', protect, getCurrentUser);
// Send a message
router.post('/message', protect, sendMessage);

// community route
router.get('/messages/community', protect, getCommunityMessages);

// Get messages with a user
router.get('/messages/:userId', protect, getMessagesWithUser);

const upload = multer({ storage: chatStorage });
router.post('/upload-image', upload.single('image'), uploadImage);


export default router;