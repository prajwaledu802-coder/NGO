import express from 'express';
import {
  createNotification,
  getNotifications,
  markNotificationRead,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const notificationRouter = express.Router();

notificationRouter.get('/', protect, getNotifications);
notificationRouter.post('/', protect, createNotification);
notificationRouter.put('/:id/read', protect, markNotificationRead);

export { notificationRouter };
