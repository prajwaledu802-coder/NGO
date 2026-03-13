import express from 'express';
import {
  createResource,
  getResources,
} from '../controllers/resourceController.js';
import { protect } from '../middleware/authMiddleware.js';

const resourceRouter = express.Router();

resourceRouter.route('/').get(protect, getResources).post(protect, createResource);

export { resourceRouter };
