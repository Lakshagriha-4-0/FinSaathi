import express from 'express';
import { chatWithMentor } from '../controllers/mentorshipController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', protect, chatWithMentor);

export default router;
