import express from 'express';
import { getLeaderboard } from '../controllers/leaderboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const leaderboardRouter = express.Router();

leaderboardRouter.get('/', protect, getLeaderboard);

export { leaderboardRouter };
