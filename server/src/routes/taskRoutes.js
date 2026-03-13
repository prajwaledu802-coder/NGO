import express from 'express';
import { acceptTask, createTask, getTasks, rejectTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const taskRouter = express.Router();

taskRouter.route('/').get(protect, getTasks).post(protect, requireAdmin, createTask);
taskRouter.post('/accept', protect, acceptTask);
taskRouter.post('/reject', protect, rejectTask);
taskRouter.post('/:id/accept', protect, acceptTask);
taskRouter.post('/:id/reject', protect, rejectTask);

export { taskRouter };