import express from 'express';
import {
  createNote,
  getUserNotes,
  updateNote,
  deleteNote,
  likeNote
} from '../controllers/noteController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getUserNotes)
  .post(protect, createNote);

router.route('/:id')
  .put(protect, updateNote)
  .delete(protect, deleteNote);

router.patch("/like/:id", protect, likeNote);

export default router;