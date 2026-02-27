import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
        const response = await axios.get(url);
        fs.writeFileSync('models.json', JSON.stringify(response.data, null, 2));
        console.log("Written to models.json");
    } catch (error) {
        console.error("Failed");
    }
}

listModels();
