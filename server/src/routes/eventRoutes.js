import express from 'express';
import {
	assignVolunteersToEvent,
	createEvent,
	deleteEvent,
	getEvents,
	joinEvent,
	updateEvent,
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const eventRouter = express.Router();

eventRouter.route('/').get(protect, getEvents).post(protect, requireAdmin, createEvent);
eventRouter.route('/:id').put(protect, requireAdmin, updateEvent).delete(protect, requireAdmin, deleteEvent);
eventRouter.post('/:id/assign-volunteers', protect, requireAdmin, assignVolunteersToEvent);
eventRouter.post('/:id/join', protect, joinEvent);

// Architecture alias: POST /api/events/join with { eventId }
eventRouter.post('/join', protect, (req, res, next) => {
	req.params.id = req.body.eventId;
	next();
}, joinEvent);

export { eventRouter };
