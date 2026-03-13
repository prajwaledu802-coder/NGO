import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDb } from '../config/db.js';
import { ensureSeedUsers } from '../services/seedUsersService.js';

dotenv.config();

const run = async () => {
  await connectDb();
  const result = await ensureSeedUsers();
  console.log(
    `Seed users ensured. created=${result.created}, totalExpected=${result.totalSeedUsers}`
  );
  await mongoose.connection.close();
  process.exit(0);
};

run().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.connection.close();
  } catch {
    // no-op
  }
  process.exit(1);
});