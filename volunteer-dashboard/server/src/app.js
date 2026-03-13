import cors from 'cors';
import express from 'express';
import { authRouter } from './routes/authRoutes.js';
import { volunteerRouter } from './routes/volunteerRoutes.js';
import { eventRouter } from './routes/eventRoutes.js';
import { resourceRouter } from './routes/resourceRoutes.js';
import { dashboardRouter } from './routes/dashboardRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/volunteers', volunteerRouter);
app.use('/api/events', eventRouter);
app.use('/api/resources', resourceRouter);
app.use('/api/dashboard', dashboardRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
