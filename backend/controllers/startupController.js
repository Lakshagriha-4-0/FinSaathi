import Startup from '../models/Startup.js';
import Expense from '../models/Expense.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// @desc    Get dynamic startup ideas
// @route   GET /api/startups
// @access  Public (Personalized if user logged in)
export const getStartups = async (req, res, next) => {
    try {
        const lang = req.query.lang || 'en';
        let contextText = "for a rural/village context in India.";

        if (req.user) {
            const expenses = await Expense.find({ user: req.user._id });
            const income = expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
            const expenseTotal = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
            const savings = income - expenseTotal;

            const incomeBracket = req.user.familyCondition?.incomeBracket || 'unspecified';
            const area = req.user.familyCondition?.isRulerArea ? 'rural/village' : 'semi-urban';

            contextText = `for a real user living in a ${area} area. 
            User's family income bracket: ${incomeBracket}.
            User's estimated current savings/working capital: ₹${savings >= 0 ? savings : 0}.
            Suggest business ideas that are REALISTIC within this budget and highly profitable.`;
        }

        const prompt = `Task: Generate 4 high-potential small business ideas ${contextText}
        Include details: title, description (1 sentence), investmentRequired (realistic range in ₹ based on their capital), profitMargin (%), difficulty (Easy/Medium/Hard), and category.
        
        Focus on categories like: Agriculture, Dairy, Eco-friendly, Handicrafts, or Local Services.
        
        Return ONLY a JSON array: 
        [
          {"title": "...", "description": "...", "investmentRequired": "...", "profitMargin": "...", "difficulty": "...", "category": "..."}
        ]
        Translate all text values into ${lang}.
        Return ONLY raw JSON.`;

        let text = "";
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            text = response.text();

            const cleanText = text.replace(/```json|```/g, '').trim();
            const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const startups = JSON.parse(jsonMatch[0]);
                return res.json(startups);
            }
        } catch (aiError) {
            console.error("AI Generation missing or failed:", aiError.message);
        }

        // Fallback to DB if AI fails or formatting is wrong
        const dbStartups = await Startup.find();
        res.json(dbStartups);
    } catch (error) {
        next(error);
    }
};

// @desc    Generate a business blueprint using AI
// @route   POST /api/startups/blueprint
// @access  Public (Personalized if user logged in)
export const generateBlueprint = async (req, res, next) => {
    try {
        const { title, lang = 'en' } = req.body;
        let contextText = "for a rural startup";

        if (req.user) {
            const expenses = await Expense.find({ user: req.user._id });
            const income = expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
            const expenseTotal = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
            const savings = income - expenseTotal;

            const area = req.user.familyCondition?.isRulerArea ? 'rural/village' : 'semi-urban';

            contextText = `for a ${area} startup, tailored for a user with approximately ₹${savings >= 0 ? savings : 0} in available capital`;
        }

        const prompt = `Generate a 5-step detailed business blueprint ${contextText} called "${title}".
        For each step, provide a short title and a 2-sentence actionable advice on how they can practically start it in their local context.
        Return ONLY a JSON array: [{"step": "...", "advice": "..."}].
        Translate all content into ${lang}.`;

        let text = "";
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            text = response.text();

            const cleanText = text.replace(/```json|```/g, '').trim();
            const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return res.json(JSON.parse(jsonMatch[0]));
            }
        } catch (aiError) {
            console.error("Blueprint AI failed:", aiError.message);
        }

        // Fallback Blueprint
        return res.json([
            { step: "Research & Planning", advice: "Understand local market gaps and determine your exact target audience in the village/town." },
            { step: "Secure Funding", advice: "Gather necessary capital from savings or apply for local government micro-finance schemes." },
            { step: "Procure Resources", advice: "Source raw materials and necessary equipment from reliable, cost-effective vendors." },
            { step: "Launch Operations", advice: "Set up your workspace and start offering your product or service to close contacts." },
            { step: "Marketing & Scaling", advice: "Use word-of-mouth and local promotion to get more customers and slowly expand." }
        ]);
    } catch (error) {
        next(error);
    }
};

// @desc    Add a startup model
// @route   POST /api/startups
// @access  Private
export const addStartup = async (req, res, next) => {
    try {
        const startup = await Startup.create(req.body);
        res.status(201).json(startup);
    } catch (error) {
        next(error);
    }
};
