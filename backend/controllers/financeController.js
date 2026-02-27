import Expense from '../models/Expense.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// @desc    Get all expenses for a user
// @route   GET /api/finance/expenses
// @access  Private
export const getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.find({ user: req.user._id });
        res.json(expenses);
    } catch (error) {
        console.error('getExpenses Error:', error.message);
        next(error);
    }
};

// @desc    Add new expense
// @route   POST /api/finance/expenses
// @access  Private
export const addExpense = async (req, res, next) => {
    try {
        const { title, amount, type, category, date } = req.body;
        console.log(`Adding expense for user: ${req.user._id}`);
        const expense = await Expense.create({
            user: req.user._id,
            title,
            amount,
            type,
            category,
            date,
        });
        console.log(`Expense saved: ${expense._id}`);
        res.status(201).json(expense);
    } catch (error) {
        console.error('addExpense Error:', error.message);
        next(error);
    }
};

// @desc    Delete expense
// @route   DELETE /api/finance/expenses/:id
// @access  Private
export const deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense || expense.user.toString() !== req.user._id.toString()) {
            res.status(404);
            throw new Error('Expense not found');
        }
        await expense.deleteOne();
        res.json({ message: 'Expense removed' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get AI-driven spending insights
// @route   GET /api/finance/insights
// @access  Private
export const getSpendingInsights = async (req, res, next) => {
    try {
        const expenses = await Expense.find({ user: req.user._id });
        const lang = req.user.language || 'en';

        if (expenses.length === 0) {
            return res.json({ tips: [], summary: "Start recording your expenses to get personalized tips!" });
        }

        const summaryData = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

        const prompt = `User Profile: Income ${req.user.familyCondition?.incomeBracket}, Dependents ${req.user.familyCondition?.dependents}
        Spending Data (Category: Amount): ${JSON.stringify(summaryData)}
        
        Task: Provide 3 ultra-short, practical saving tips for this rural household in ${lang}. 
        Focus on: Reducing unnecessary leaks, seasonal saving, or better resource management.
        
        Return ONLY a JSON object: {"summary": "...", "tips": ["Tip 1", "Tip 2", "Tip 3"]}.
        Translate into ${lang}.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return res.json(JSON.parse(jsonMatch[0]));
        }
        res.status(500).json({ message: 'Failed to generate insights' });
    } catch (error) {
        next(error);
    }
};
