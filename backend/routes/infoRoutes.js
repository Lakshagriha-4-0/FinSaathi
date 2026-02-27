import express from 'express';
import { getRecommendedSchemes, getLiveAlerts, generateSchemeGuide, generateAlertExplanation } from '../controllers/infoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/schemes', protect, getRecommendedSchemes);
router.post('/schemes/guide', protect, generateSchemeGuide);
router.get('/alerts', getLiveAlerts); // Public alerts
router.post('/alerts/explain', protect, generateAlertExplanation);

export default router;
