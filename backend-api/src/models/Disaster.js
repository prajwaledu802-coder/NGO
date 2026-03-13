import mongoose from 'mongoose';

const disasterSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    detectedAt: { type: Date, default: Date.now, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active',
      index: true,
    },
  },
  { timestamps: true }
);

const Disaster = mongoose.model('Disaster', disasterSchema);

export { Disaster };