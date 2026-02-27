import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testResult() {
    try {
        console.log("Testing gemini-2.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Ready to go?");
        const response = await result.response;
        console.log("SUCCESS:", response.text());
    } catch (e) {
        console.error("FAILED again:", e.message);
    }
}

testResult();
