import dotenv from 'dotenv';
import { app } from './app.js';
import { connectDb } from './config/db.js';

dotenv.config();

const port = process.env.PORT || 5000;

const bootstrap = async () => {
  await connectDb();
  app.listen(port, () => {
    console.log(`API running on port ${port}`);
  });
};

bootstrap().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
