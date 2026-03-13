import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  message: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'alert'],
    default: 'info',
  },
  readStatus: { type: Boolean, default: false, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
});

const Notification = mongoose.model('Notification', notificationSchema);

export { Notification };
