import express from 'express';
import { getStartups, addStartup, generateBlueprint } from '../controllers/startupController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getStartups);
router.post('/', protect, addStartup);
router.post('/blueprint', optionalAuth, generateBlueprint);

export default router;
