import express from 'express';
import MassBunkPoll from '../models/MassBunkPoll.js';
import mongoose from 'mongoose';
import User from '../models/User.js';


const router = express.Router();

router.get('/polls', async (req, res) => {
  try {
    const polls = await MassBunkPoll.find()
      .populate('votes.userId', 'name')
      .populate('createdBy', 'name')
      .populate('imposters', 'name');

    // Optional: Remove votes with missing users
    const cleanPolls = polls.map(p => ({
      ...p.toObject(),
      votes: p.votes.filter(v => v.userId), // remove undefined users
    }));

    res.json(cleanPolls);
  } catch (err) {
    console.error('Polls fetch error:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/create', async (req, res) => {
  const { reason, localuser } = req.body;

  const poll = await MassBunkPoll.create({
    reason,
    createdBy: new mongoose.Types.ObjectId(localuser.id),
  });

  res.status(201).json(poll);
});

router.post('/vote', async (req, res) => {
  const { pollId, vote, localuser } = req.body;

  const poll = await MassBunkPoll.findById(pollId);
  const userId = new mongoose.Types.ObjectId(localuser.id);

  const existingVote = poll.votes.find(v => v.userId.toString() === userId.toString());

  if (existingVote) {
    existingVote.vote = vote;
  } else {
    poll.votes.push({ userId, vote });
  }

  await poll.save();
  res.sendStatus(200);
});


router.post('/close', async (req, res) => {
  const { pollId, localuser } = req.body;
  const poll = await MassBunkPoll.findById(pollId);

  if (poll.createdBy.toString() !== localuser.id.toString()) {
    return res.status(403).send('Unauthorized');
  }

  poll.status = 'closed';
  await poll.save();
  res.sendStatus(200);
});
router.post('/mark-imposter', async (req, res) => {
  const { pollId, userId, localuser } = req.body;
  const poll = await MassBunkPoll.findById(pollId);
  if (poll.createdBy.toString() !== localuser?.id.toString()) return res.status(403).send('Unauthorized');

  if (!poll.imposters.includes(userId)) {
    poll.imposters.push(userId);
    await poll.save();
  }
  res.sendStatus(200);
});

export default router;