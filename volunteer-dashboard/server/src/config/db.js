import mongoose from 'mongoose';

export const connectDb = async () => {
  const uri = (process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL || '').trim();
  if (!uri) {
    throw new Error('MongoDB URI is not configured (set MONGO_URI, MONGODB_URI, or DATABASE_URL)');
  }
  if (/^mongodb\+srv:\/\/[^/:\s]+:$/.test(uri)) {
    throw new Error('MongoDB URI is incomplete. Use the full Atlas connection string including password, host, and database');
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected');
};
