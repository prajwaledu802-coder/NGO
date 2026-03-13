import express from 'express';
import { createEvent, getEvents } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const eventRouter = express.Router();

eventRouter.route('/').get(protect, getEvents).post(protect, createEvent);

export { eventRouter };
