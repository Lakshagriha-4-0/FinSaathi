import express from 'express';
import { getStartups, addStartup, generateBlueprint } from '../controllers/startupController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getStartups);
router.post('/', protect, addStartup);
router.post('/blueprint', protect, generateBlueprint);

export default router;
