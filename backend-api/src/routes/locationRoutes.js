import express from 'express';
import { createLocation, getLocations } from '../controllers/locationController.js';
import { protect } from '../middleware/authMiddleware.js';

const locationRouter = express.Router();

locationRouter.route('/').get(protect, getLocations).post(protect, createLocation);

export { locationRouter };
