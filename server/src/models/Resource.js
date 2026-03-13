import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    resourceName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['available', 'low', 'critical', 'depleted'],
      default: 'available',
    },
  },
  { timestamps: true }
);

resourceSchema.virtual('name').get(function nameGetter() {
  return this.resourceName;
});

resourceSchema.set('toJSON', { virtuals: true });

const Resource = mongoose.model('Resource', resourceSchema);
export { Resource };
