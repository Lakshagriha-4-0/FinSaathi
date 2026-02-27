import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// @desc    Chat with AI Mentor
// @route   POST /api/mentorship/chat
// @access  Private
export const chatWithMentor = async (req, res, next) => {
    try {
        const { message, history, lang = 'en' } = req.body;
        const user = req.user;

        const systemPrompt = `You are "Saathi AI", a patient and wise financial mentor for rural Indian users.
        Your goal is to help users understand money, banking, loans, and business in a very simple, encouraging way.
        
        User Profile:
        - Name: ${user.name}
        - Language: ${lang}
        - Income Bracket: ${user.familyCondition?.incomeBracket || 'low'}
        
        Rules:
        1. Keep answers short and practical (max 3-4 sentences).
        2. Use a friendly, helpful tone like a village elder or a helpful friend.
        3. If the user asks in Hindi, reply in simple, clear Hindi.
        4. Focus on safety (avoiding scams) and growth (savings/micro-business).
        5. Never give specific legal or investment advice, just general guidance.
        6. If the user asks about specific app features (Roadmap, Schemes, Loans), guide them where to find it.`;

        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}`;
        const result = await chat.sendMessage(fullPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        if (error.message.includes('429') || error.message.includes('Quota exceeded')) {
            return res.status(429).json({ reply: 'Saathi AI is taking a short break. Please try again in a minute!' });
        }
        next(error);
    }
};

export default { chatWithMentor };
