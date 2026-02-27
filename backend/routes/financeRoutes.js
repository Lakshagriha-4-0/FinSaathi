import express from 'express';
import { getExpenses, addExpense, deleteExpense, getSpendingInsights } from '../controllers/financeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All finance routes are protected

router.route('/expenses')
    .get(getExpenses)
    .post(addExpense);

router.route('/insights')
    .get(getSpendingInsights);

router.route('/expenses/:id')
    .delete(deleteExpense);

export default router;
