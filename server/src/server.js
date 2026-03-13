import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { app } from './app.js';
import { connectDb } from './config/db.js';
import { ensureSeedUsers } from './services/seedUsersService.js';
import { setSocketServer } from './services/socketService.js';

const srcDir = path.dirname(fileURLToPath(import.meta.url));
const envLoadResult = dotenv.config({ path: path.resolve(srcDir, '../.env') });
if (envLoadResult.error) {
  dotenv.config();
}

const port = process.env.PORT || 5000;

const bootstrap = async () => {
  await connectDb();
  await ensureSeedUsers();

  const server = http.createServer(app);
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

  server.listen(port, () => {
    console.log(`API running on port ${port}`);
  });
};

bootstrap().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
