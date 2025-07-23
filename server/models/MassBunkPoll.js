import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vote: { type: String, enum: ['yes', 'no'] }
});

const massBunkPollSchema = new mongoose.Schema({
  reason: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  votes: [voteSchema],
  imposters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MassBunkPoll', massBunkPollSchema);
