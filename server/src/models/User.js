import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'volunteer'], default: 'volunteer' },
    location: { type: String, default: '' },
    skills: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'inactive'],
      default: 'pending',
    },
    dutyStatus: {
      type: String,
      enum: ['on-duty', 'off-duty'],
      default: 'off-duty',
    },
    coordinates: {
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.209 },
    },
    availability: { type: Boolean, default: true },
    hoursContributed: { type: Number, default: 0, min: 0 },
    impactScore: { type: Number, default: 0, min: 0 },
    eventsJoined: { type: Number, default: 0, min: 0 },
    achievements: [
      {
        title: { type: String, required: true, trim: true },
        issuedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

userSchema.virtual('fullName').get(function fullNameGetter() {
  return this.name;
});

userSchema.virtual('id').get(function idGetter() {
  return this._id.toString();
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

userSchema.pre('save', async function onSave(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function matchPassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', userSchema);
export { User };
