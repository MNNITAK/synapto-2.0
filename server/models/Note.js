import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  color: String,
  liked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);