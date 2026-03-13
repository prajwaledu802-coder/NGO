import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    location: { type: String, required: true, trim: true },
    peopleAffected: { type: Number, default: 1, min: 1 },
    urgency: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'cancelled'],
      default: 'open',
    },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);

export { HelpRequest };
