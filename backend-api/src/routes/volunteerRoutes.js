import express from 'express';
import {
  approveVolunteer,
  createVolunteer,
  deleteVolunteer,
  getVolunteerActivity,
  getVolunteerById,
  getVolunteers,
  updateDutyStatus,
  updateVolunteer,
} from '../controllers/volunteerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const volunteerRouter = express.Router();

volunteerRouter
  .route('/')
  .get(protect, getVolunteers)
  .post(protect, requireAdmin, createVolunteer);

// Architecture alias: volunteer self-registration
volunteerRouter.post('/register', createVolunteer);

// Architecture alias: generic approve endpoint
volunteerRouter.put('/approve', protect, requireAdmin, (req, res, next) => {
  req.params.id = req.body.volunteerId;
  next();
}, approveVolunteer);

volunteerRouter.post('/approve', protect, requireAdmin, (req, res, next) => {
  req.params.id = req.body.volunteerId;
  next();
}, approveVolunteer);

volunteerRouter.route('/:id').get(protect, getVolunteerById).put(protect, updateVolunteer).delete(protect, requireAdmin, deleteVolunteer);

volunteerRouter.put('/:id/approve', protect, requireAdmin, approveVolunteer);
volunteerRouter.put('/:id/duty-status', protect, updateDutyStatus);
volunteerRouter.get('/:id/activity', protect, getVolunteerActivity);

export { volunteerRouter };
