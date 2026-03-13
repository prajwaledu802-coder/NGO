import mongoose from 'mongoose';

const resourceRequiredSchema = new mongoose.Schema(
  {
    resourceName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    volunteersRequired: { type: Number, default: 0, min: 0 },
    resourcesRequired: [resourceRequiredSchema],
    assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: ['planned', 'active', 'completed', 'cancelled'],
      default: 'planned',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    coordinates: {
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.209 },
    },
  },
  { timestamps: true }
);

eventSchema.virtual('name').get(function nameGetter() {
  return this.title;
});

eventSchema.virtual('volunteersAssigned').get(function volunteersAssignedGetter() {
  return this.assignedVolunteers?.length || 0;
});

eventSchema.set('toJSON', { virtuals: true });

const Event = mongoose.model('Event', eventSchema);
export { Event };
