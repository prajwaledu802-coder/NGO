import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { app } from './app.js';
import { connectDb } from './config/db.js';
import { ensureSeedUsers } from './services/seedUsersService.js';
import { setSocketServer } from './services/socketService.js';

dotenv.config();

// Validate required env vars
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  console.error('Please set these in your .env file or deployment environment.');
  process.exit(1);
}

const port = process.env.PORT || 10000;

const bootstrap = async () => {
  await connectDb();
  await ensureSeedUsers();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: (process.env.CLIENT_URLS || 'http://localhost:5173,http://localhost:5174,http://localhost:5175').split(',').map(u => u.trim()),
      credentials: true,
    },
  });

  setSocketServer(io);

  io.on('connection', (socket) => {
    socket.emit('system:welcome', { message: 'Connected to HelpHive realtime channel' });

    socket.on('disconnect', () => {
      // no-op
    });
  });

  server.listen(port, () => {
    console.log(`API running on port ${port}`);
  });
};

bootstrap().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
