import mongoose from 'mongoose';

const volunteerActivitySchema = new mongoose.Schema({
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  hoursContributed: { type: Number, default: 0, min: 0 },
  impactScore: { type: Number, default: 0, min: 0 },
  completionStatus: {
    type: String,
    enum: ['joined', 'in-progress', 'completed'],
    default: 'joined',
    index: true,
  },
  timestamp: { type: Date, default: Date.now, index: true },
});

const VolunteerActivity = mongoose.model('VolunteerActivity', volunteerActivitySchema);

export { VolunteerActivity };
