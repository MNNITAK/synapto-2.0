import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return !this.isCommunity; // receiver is only required if NOT a community message
      }
    },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent'
    },
    isImage: {
      type: Boolean,
      default: false,
    },
    isCommunity: {
      type: Boolean,
      default: false
    }    
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;