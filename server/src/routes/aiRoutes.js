import express from 'express';
import {
  chatWithAi,
  getResourcePrediction,
  getVolunteerAiInsights,
  getVolunteerRecommendations,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const aiRouter = express.Router();

aiRouter.post('/chat', protect, chatWithAi);
aiRouter.post('/recommend-volunteers', protect, requireAdmin, getVolunteerRecommendations);
aiRouter.get('/resource-prediction', protect, requireAdmin, getResourcePrediction);

// Alias endpoints aligned with architecture docs
aiRouter.post('/chatbot', protect, chatWithAi);
aiRouter.post('/match-volunteers', protect, requireAdmin, getVolunteerRecommendations);
aiRouter.post('/predict-resources', protect, requireAdmin, getResourcePrediction);
aiRouter.post('/insights', protect, getVolunteerAiInsights);

export { aiRouter };
