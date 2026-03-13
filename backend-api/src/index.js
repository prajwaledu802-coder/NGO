import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { app } from './app.js';
import { connectDb } from './config/db.js';
import { ensureSeedUsers } from './services/seedUsersService.js';
import { setSocketServer } from './services/socketService.js';

dotenv.config();

const PORT = process.env.PORT || 10000;

const bootstrap = async () => {
  await connectDb();
  await ensureSeedUsers();

  const server = app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
};

bootstrap().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
