import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
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
import { mapDataRouter } from './routes/mapDataRoutes.js';
import { getImpact, getCertificate } from './controllers/volunteerSelfController.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use('/api', apiLimiter);

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
app.use('/api/map-data', mapDataRouter);
app.get('/api/volunteer/impact', protect, getImpact);
app.get('/api/volunteer/certificate', protect, getCertificate);
app.post('/api/ai-insights', protect, getVolunteerAiInsights);

app.use(notFound);
app.use(errorHandler);

export { app };
