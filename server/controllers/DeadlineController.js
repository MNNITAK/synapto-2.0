import Deadline from '../models/Deadline.js';
import User from '../models/User.js';
// import { sendWhatsApp } from './whatsappController.js';

export const savePhoneNumber = async (req, res) => {
  const { userId, phoneNumber } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { phoneNumber }, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addDeadline = async (req, res) => {
  const { userId, title, content, tags, deadline, remindBeforeDays } = req.body;
  try {
    const user = await User.findById(userId);
    const newDeadline = await Deadline.create({
      userId,
      title,
      content,
      tags,
      deadline,
      remindBeforeDays,
      phoneNumber: user.phoneNumber,
    });
    res.status(201).json(newDeadline);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markDeadlineDone = async (req, res) => {
  const { deadlineId } = req.params;
  try {
    const deadline = await Deadline.findByIdAndUpdate(deadlineId, { done: true }, { new: true });
    res.json(deadline);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDeadlines = async (req, res) => {
  const { userId } = req.query;
  try {
    const deadlines = await Deadline.find({ userId });
    res.json(deadlines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};