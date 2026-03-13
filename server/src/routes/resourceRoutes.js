import express from 'express';
import {
  createResource,
  deleteResource,
  getResources,
  updateResource,
} from '../controllers/resourceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const resourceRouter = express.Router();

resourceRouter.route('/').get(protect, getResources).post(protect, requireAdmin, createResource);
resourceRouter.route('/:id').put(protect, requireAdmin, updateResource).delete(protect, requireAdmin, deleteResource);

export { resourceRouter };
