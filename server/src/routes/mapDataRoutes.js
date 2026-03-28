import express from 'express';
import { getMapData } from '../controllers/mapDataController.js';
import { protect } from '../middleware/authMiddleware.js';

const mapDataRouter = express.Router();
mapDataRouter.get('/', protect, getMapData);
export { mapDataRouter };
