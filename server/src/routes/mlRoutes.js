import express from 'express';
import { predictResourcesAndDemand } from '../controllers/mlController.js';
import { protect } from '../middleware/authMiddleware.js';

const mlRouter = express.Router();

mlRouter.post('/predict-resources', protect, predictResourcesAndDemand);

export { mlRouter };
