import express from 'express';
import { getDashboardOverview } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/', protect, getDashboardOverview);
dashboardRouter.get('/overview', protect, getDashboardOverview);

export { dashboardRouter };
