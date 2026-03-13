import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Available', 'Low', 'Critical'], default: 'Available' },
  },
  { timestamps: true }
);

const Resource = mongoose.model('Resource', resourceSchema);
export { Resource };
