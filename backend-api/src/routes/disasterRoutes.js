import express from 'express';
import { createDisaster, getDisasters } from '../controllers/disasterController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const disasterRouter = express.Router();

disasterRouter.route('/').get(protect, getDisasters).post(protect, requireAdmin, createDisaster);

export { disasterRouter };