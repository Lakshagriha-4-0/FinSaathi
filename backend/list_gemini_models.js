import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function testList() {
    try {
        const response = await fetch(URL);
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Models:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("List Error:", err);
    }
}

testList();
