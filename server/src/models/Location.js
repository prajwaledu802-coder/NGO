import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  accuracy: { type: Number, default: null },
  timestamp: { type: Date, default: Date.now, index: true },
});

locationSchema.index({ volunteerId: 1, timestamp: -1 });

const Location = mongoose.model('Location', locationSchema);

export { Location };
