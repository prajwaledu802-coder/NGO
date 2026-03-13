import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    volunteersAssigned: { type: Number, default: 0 },
    resourcesUsed: { type: Number, default: 0 },
    successRate: { type: Number, default: 80 },
    coordinates: {
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.209 },
    },
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);
export { Event };
