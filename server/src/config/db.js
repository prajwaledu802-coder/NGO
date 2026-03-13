import mongoose from 'mongoose';

export const connectDb = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      'MONGO_URI is not configured. ' +
      'Set the MONGO_URI environment variable to a valid MongoDB connection string. ' +
      'On Render, go to your service → Environment tab and add MONGO_URI.'
    );
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected');
};
