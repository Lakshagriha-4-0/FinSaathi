import Scheme from '../models/Scheme.js';
import Alert from '../models/Alert.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// @desc    Get schemes based on user family condition
// @route   GET /api/info/schemes
// @access  Private
export const getRecommendedSchemes = async (req, res, next) => {
    try {
        const { incomeBracket, dependents } = req.user.familyCondition;
        const language = req.user.language || 'en';

        // Map income bracket string to numeric value for filtering
        const incomeMap = {
            '< 2L': 200000,
            '2L - 5L': 500000,
            '5L - 10L': 1000000,
            '> 10L': 9999999
        };

        const userMaxIncome = incomeMap[incomeBracket] || 200000;

        const schemes = await Scheme.find({
            language: language,
            'eligibility.incomeLimit': { $gte: userMaxIncome },
            'eligibility.minDependents': { $lte: dependents || 0 }
        });

        if (schemes.length === 0) {
            return res.json({ schemes: [], aiAnalysis: null });
        }

        // Gemini Analysis
        const context = JSON.stringify({
            userName: req.user.name,
            income: incomeBracket,
            dependents: dependents,
            schemes: schemes.map(s => ({ title: s.title, benefit: s.benefit }))
        });

        const prompt = `User Profile: ${context}
        Language: ${language}
        
        Analyze the listed government schemes and explain why they are specifically beneficial for this user.
        Make the tone helpful and encouraging for a rural user.
        
        Return ONLY a JSON object: {"summary": "A short 2-3 sentence overview", "recommendations": [{"scheme": "Title", "why": "reasoning"}]}.
        Translate everything into ${language}.
        Return ONLY the JSON. No markdown.`;

        let aiAnalysis = null;
        try {
            const result = await aiModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/```json|```/g, '').trim();
            aiAnalysis = JSON.parse(text);
        } catch (e) {
            console.error('Gemini Schemes Analysis Error:', e);
        }

        res.json({ schemes, aiAnalysis });
    } catch (error) {
        next(error);
    }
};

// @desc    Get live scam alerts
// @route   GET /api/alerts
// @access  Public
export const getLiveAlerts = async (req, res, next) => {
    try {
        const alerts = await Alert.find({ isLive: true }).sort('-createdAt');
        res.json(alerts);
    } catch (error) {
        next(error);
    }
};
// @desc    Generate a step-by-step application guide for schemes
// @route   POST /api/info/schemes/guide
// @access  Private
export const generateSchemeGuide = async (req, res, next) => {
    try {
        const { title, lang = 'en' } = req.body;

        const prompt = `Task: Create a simple 4-step application guide for a rural user for the government scheme "${title}".
        Include:
        1. Eligibility checklist
        2. Documents required
        3. Application portal or office to visit
        4. Expected processing time
        
        Return ONLY a JSON array: [{"step": "...", "action": "..."}].
        Translate into ${lang}.`;

        const result = await aiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return res.json(JSON.parse(jsonMatch[0]));
        }
        res.status(500).json({ message: 'Failed to generate guide' });
    } catch (error) {
        next(error);
    }
};
// @desc    Generate a deep-dive explanation for a scam alert
// @route   POST /api/info/alerts/explain
// @access  Private
export const generateAlertExplanation = async (req, res, next) => {
    try {
        const { title, description, lang = 'en' } = req.body;

        const prompt = `Task: Explain the scam "${title}" to a beginner rural user. 
        Current description: ${description}
        
        Explain:
        1. How it happens (Step-by-step logic)
        2. How to identify the trap
        3. 3 specific YouTube search terms to learn more about this specific scam in ${lang}.
        
        Return ONLY a JSON object: {
            "explanation": "2-3 paragraphs of clear reasoning in ${lang}",
            "videoQueries": ["Term 1", "Term 2", "Term 3"]
        }.
        No markdown.`;

        const result = await aiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return res.json(JSON.parse(jsonMatch[0]));
        }
        res.status(500).json({ message: 'Failed to generate explanation' });
    } catch (error) {
        if (error.message.includes('429') || error.message.includes('Quota exceeded')) {
            return res.status(429).json({ message: 'AI limit reached. Try again in 1 minute.' });
        }
        next(error);
    }
};

export default { getRecommendedSchemes, getLiveAlerts, generateSchemeGuide, generateAlertExplanation };
