import dotenv from 'dotenv';
import { connectDb } from '../config/db.js';
import { ensureSeedUsers } from '../services/seedUsersService.js';

dotenv.config();

const run = async () => {
  await connectDb();
  const result = await ensureSeedUsers();
  console.log(
    `Seed users ensured. created=${result.created}, totalExpected=${result.totalSeedUsers}`
  );
  process.exit(0);
};

run().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
