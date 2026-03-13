import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    skills: [{ type: String }],
    volunteerRole: { type: String, default: 'Field Volunteer' },
    hoursContributed: { type: Number, default: 0 },
    impactScore: { type: Number, default: 0 },
    eventsParticipated: { type: Number, default: 0 },
    avatar: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    },
    coordinates: {
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.209 },
    },
  },
  { timestamps: true }
);

const Volunteer = mongoose.model('Volunteer', volunteerSchema);
export { Volunteer };
