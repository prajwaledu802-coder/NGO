import express from 'express';
import {
  getEventParticipationAnalytics,
  getResourceUsageAnalytics,
  getVolunteerActivityAnalytics,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const analyticsRouter = express.Router();

analyticsRouter.get('/volunteer-activity', protect, requireAdmin, getVolunteerActivityAnalytics);
analyticsRouter.get('/resource-usage', protect, requireAdmin, getResourceUsageAnalytics);
analyticsRouter.get('/event-participation', protect, requireAdmin, getEventParticipationAnalytics);

export { analyticsRouter };
