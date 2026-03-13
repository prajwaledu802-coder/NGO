import express from 'express';
import {
  assignHelpRequestVolunteers,
  createHelpRequest,
  getHelpRequests,
  updateHelpRequestStatus,
} from '../controllers/helpRequestController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const helpRequestRouter = express.Router();

helpRequestRouter.route('/').get(protect, getHelpRequests).post(protect, createHelpRequest);
helpRequestRouter.put('/:id/assign-volunteers', protect, requireAdmin, assignHelpRequestVolunteers);
helpRequestRouter.put('/:id/status', protect, requireAdmin, updateHelpRequestStatus);

export { helpRequestRouter };
