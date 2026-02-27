import Loan from '../models/Loan.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// @desc    Get all loans with AI best-match suggestion
// @route   GET /api/loans/compare
// @access  Private
export const getLoanComparison = async (req, res, next) => {
    try {
        const lang = req.user.language || 'en';

        // Real-time Market Snapshot (Research Data) - India 2024-25
        const marketData = `
        Latest Rural Loan Market Context:
        - Kisan Credit Card (KCC): 7% p.a. (SBI/BoB). Effective 4% with timely repayment subvention. 
        - Agri Gold Loans: 8.75% - 9.15% (SBI/BoB). No processing fee up to 3L.
        - Women SHG Loans: concession rates around 7% for loans up to 3L (DAY-NRLM).
        - NABARD Refinance: Starts at 8.5% for RRBs.
        `;

        // Gemini Dynamic Generation
        let suggestion = null;
        let dynamicLoans = [];

        try {
            const userProfile = {
                name: req.user.name,
                income: req.user.familyCondition?.incomeBracket || '< 2L',
                dependents: req.user.familyCondition?.dependents || 0,
                isRural: req.user.familyCondition?.isRulerArea ?? true
            };

            const prompt = `Context (Current Real-time Rates): ${marketData}
            User Profile: ${JSON.stringify(userProfile)}
            
            Task:
            1. Generate a "Real-time Suggested Loans" list (3-4 items). 
            2. Use official names (SBI, Bank of Baroda, NABARD).
            3. Ensure interest rates match the Context.
            4. Suggest the 'bestMatch' loan.
            5. Provide 'dynamicAdvice' (personalized market outlook).
            6. Provide 3 'tips'.
            
            Return ONLY JSON:
            {
                "loans": [
                    {"title": "...", "provider": "...", "interestRate": 7, "description": "...", "benefits": ["...", "..."], "category": "Crop|Gold|SHG|Personal"},
                    ...
                ],
                "suggestion": {
                    "bestMatchTitle": "GeneratedTitle", 
                    "reason": "...", 
                    "advice": "...",
                    "dynamicAdvice": "...",
                    "tips": ["Tip 1", "Tip 2", "Tip 3"]
                }
            }
            
            Values must be in ${lang}. No markdown.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/```json|```/g, '').trim();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                dynamicLoans = parsed.loans || [];
                suggestion = parsed.suggestion || null;
            }
        } catch (e) {
            console.error('Gemini Dynamic Generation Error:', e);
            // Fallback to DB
            dynamicLoans = await Loan.find({ language: lang });
            if (dynamicLoans.length === 0) dynamicLoans = await Loan.find({ language: 'en' });
        }

        res.json({ loans: dynamicLoans, suggestion });
    } catch (error) {
        next(error);
    }
};

// @desc    Generate a step-by-step application guide
// @route   POST /api/loans/guide
// @access  Private
export const generateApplyGuide = async (req, res, next) => {
    try {
        const { title, provider, lang = 'en' } = req.body;

        const prompt = `Task: Create a simple 4-step application guide for a rural user applying for the "${title}" from "${provider}".
        Include:
        1. Document Checklist (Aadhaar, Land records, etc.)
        2. Where to visit (Branch/BC Point)
        3. Form details
        4. Processing time
        
        Return ONLY a JSON array: [{"step": "...", "action": "..."}].
        Translate into ${lang}.`;

        const result = await model.generateContent(prompt);
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
