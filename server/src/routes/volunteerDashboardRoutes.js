import express from 'express';
import { getVolunteerDashboard } from '../controllers/volunteerDashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const volunteerDashboardRouter = express.Router();

volunteerDashboardRouter.get('/dashboard', protect, getVolunteerDashboard);

export { volunteerDashboardRouter };
