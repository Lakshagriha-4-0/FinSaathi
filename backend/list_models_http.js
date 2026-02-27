import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
    try {
        console.log("Fetching models list via HTTP...");
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
        const response = await axios.get(url);
        console.log("Success! Available models:");
        response.data.models.forEach(m => {
            console.log(`- ${m.name} (supports: ${m.supportedGenerationMethods.join(', ')})`);
        });
    } catch (error) {
        console.error("Failed to fetch models list:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data:`, JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

listModels();
