import Startup from '../models/Startup.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// @desc    Get dynamic startup ideas
// @route   GET /api/startups
// @access  Public
export const getStartups = async (req, res, next) => {
    try {
        const lang = req.query.lang || 'en';

        const prompt = `Task: Generate 4 high-potential small business ideas for a rural/village context in India.
        Include details: title, description (1 sentence), investmentRequired (range in ₹), profitMargin (%), difficulty (Easy/Medium/Hard), and category.
        
        Focus on categories like: Agriculture, Dairy, Eco-friendly, Handicrafts, or Local Services.
        
        Return ONLY a JSON array: 
        [
          {"title": "...", "description": "...", "investmentRequired": "...", "profitMargin": "...", "difficulty": "...", "category": "..."}
        ]
        Translate all text values into ${lang}.
        Return ONLY raw JSON.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const startups = JSON.parse(jsonMatch[0]);
            return res.json(startups);
        }

        // Fallback to DB if AI fails
        const dbStartups = await Startup.find();
        res.json(dbStartups);
    } catch (error) {
        next(error);
    }
};

// @desc    Generate a business blueprint using AI
// @route   POST /api/startups/blueprint
// @access  Private
export const generateBlueprint = async (req, res, next) => {
    try {
        const { title, lang = 'en' } = req.body;

        const prompt = `Generate a 5-step detailed business blueprint for a rural startup called "${title}".
        For each step, provide a short title and a 2-sentence actionable advice.
        Return ONLY a JSON array: [{"step": "...", "advice": "..."}].
        Translate into ${lang}.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return res.json(JSON.parse(jsonMatch[0]));
        }
        res.status(500).json({ message: 'Failed to generate blueprint' });
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
