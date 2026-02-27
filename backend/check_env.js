import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('--- ENV CHECK ---');
console.log('PORT:', process.env.PORT);
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
if (process.env.GEMINI_API_KEY) {
    console.log('GEMINI_API_KEY start:', process.env.GEMINI_API_KEY.substring(0, 7));
    console.log('GEMINI_API_KEY end:', process.env.GEMINI_API_KEY.substring(process.env.GEMINI_API_KEY.length - 4));
}
console.log('-----------------');
