import express from 'express';
import { getUserRoadmap, getVideoRecs } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/roadmap', getUserRoadmap);
router.get('/videos/:topic', getVideoRecs);

export default router;
