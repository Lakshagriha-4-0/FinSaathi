import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        // Some versions don't have listModels on genAI directly
        // Let's try to just call it if it exists
        if (typeof genAI.listModels === 'function') {
            const result = await genAI.listModels();
            console.log('Available Models:');
            result.models.forEach(m => console.log(m.name));
        } else {
            console.log('listModels is not a function on genAI');
        }
    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
