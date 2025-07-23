import express from 'express';
import {
  addDeadline,
  getDeadlines,
  markDeadlineDone,
  savePhoneNumber
} from '../controllers/DeadlineController.js';

const router = express.Router();

router.post('/save-phone', savePhoneNumber);
router.post('/', addDeadline);
router.get('/', getDeadlines);
router.put('/:deadlineId/done', markDeadlineDone);

export default router;
