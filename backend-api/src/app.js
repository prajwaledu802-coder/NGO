import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import { aiRouter } from './routes/aiRoutes.js';
import { activityRouter } from './routes/activityRoutes.js';
import { analyticsRouter } from './routes/analyticsRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { getVolunteerAiInsights } from './controllers/aiController.js';
import { helpRequestRouter } from './routes/helpRequestRoutes.js';
import { leaderboardRouter } from './routes/leaderboardRoutes.js';
import { locationRouter } from './routes/locationRoutes.js';
import { mlRouter } from './routes/mlRoutes.js';
import { notificationRouter } from './routes/notificationRoutes.js';
import { disasterRouter } from './routes/disasterRoutes.js';
import { taskRouter } from './routes/taskRoutes.js';
import { protect } from './middleware/authMiddleware.js';
import { volunteerRouter } from './routes/volunteerRoutes.js';
import { volunteerDashboardRouter } from './routes/volunteerDashboardRoutes.js';
import { eventRouter } from './routes/eventRoutes.js';
import { resourceRouter } from './routes/resourceRoutes.js';
import { dashboardRouter } from './routes/dashboardRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

app.use(
  cors({
    origin: (process.env.CLIENT_URLS || 'http://localhost:5173,http://localhost:5174,http://localhost:5175').split(',').map(u => u.trim()),
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
app.use('/api/analytics', analyticsRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/locations', locationRouter);
app.use('/api/ai', aiRouter);
app.use('/api/ml', mlRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/activity', activityRouter);
app.use('/api/volunteer-activity', activityRouter);
app.use('/api/help-requests', helpRequestRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/disaster', disasterRouter);
app.use('/api/volunteer', volunteerDashboardRouter);
app.post('/api/ai-insights', protect, getVolunteerAiInsights);

app.use(notFound);
app.use(errorHandler);

export { app };
