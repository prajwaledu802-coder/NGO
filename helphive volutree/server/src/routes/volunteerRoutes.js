import express from 'express';
import {
  createVolunteer,
  getVolunteerById,
  getVolunteers,
} from '../controllers/volunteerController.js';
import { protect } from '../middleware/authMiddleware.js';

const volunteerRouter = express.Router();

volunteerRouter.route('/').get(protect, getVolunteers).post(protect, createVolunteer);
volunteerRouter.get('/:id', protect, getVolunteerById);

export { volunteerRouter };
