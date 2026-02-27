import express from 'express';
import { getLoanComparison, generateApplyGuide } from '../controllers/loanController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/compare', protect, getLoanComparison);
router.post('/guide', protect, generateApplyGuide);

export default router;
