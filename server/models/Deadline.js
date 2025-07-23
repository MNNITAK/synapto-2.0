import mongoose from 'mongoose';

const deadlineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  content: String,
  tags: [String],
  deadline: Date,
  remindBeforeDays: Number,
  phoneNumber: String, // saved once from user
  done: { type: Boolean, default: false },
  sent: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Deadline', deadlineSchema);
