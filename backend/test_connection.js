import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const modelsToTest = [
    "models/gemini-1.5-flash",
    "models/gemini-pro"
];

async function testModels() {
    for (const modelName of modelsToTest) {
        try {
            console.log(`\n--- Testing model: ${modelName} ---`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log(`RESULT: Success with ${modelName}: ${response.text()}`);
            return modelName;
        } catch (error) {
            console.log(`RESULT: Failed with ${modelName}. Status: ${error.status} Message: ${error.message}`);
        }
    }
}

testModels();
