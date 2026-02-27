import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Generates a personalized financial literacy roadmap based on user profile.
 */
export const generateRoadmap = async (userProfile, customTopic = null, targetLanguage = null) => {
    try {
        const lang = targetLanguage || userProfile.language || 'en';
        const topicFocus = customTopic
            ? `IMPORTANT: The user wants to learn SPECIFICALLY about: "${customTopic}". Ignore default rural banking topics and provide a deep-dive roadmap for "${customTopic}".`
            : 'Focus areas: UPI safety, Crop Loans, Micro-banking, Avoiding Cyber Frauds.';

        const prompt = `You are a specialized educational expert. 
        Design a highly practical, 5-step detailed roadmap for a user named ${userProfile.name}.
        
        Profile Context:
        - Language: ${lang}
        - Background: ${userProfile.familyCondition?.incomeBracket || 'low'} income household.
        
        Goal: ${topicFocus}
        
        Output Requirements:
        1. JSON format with a "steps" array.
        2. Each step must have: "title", "description", and "category".
        3. Translate ALL content (titles and descriptions) into ${lang}.
        4. Each description should be 2-3 sentences explaining exactly what to learn in that step.
        5. Return ONLY the JSON object. No markdown formatting.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        console.log('Gemini Raw Response (Roadmap):', text);

        // More robust JSON extraction: Match either an object {} or an array []
        const jsonMatch = text.match(/([\[\{][\s\S]*[\]\}])/);
        if (!jsonMatch) {
            console.error('No JSON found in AI response:', text);
            throw new Error('AI failed to return a valid JSON structure.');
        }

        const content = JSON.parse(jsonMatch[0]);
        // Normalize to { steps: [...] }
        return Array.isArray(content) ? { steps: content } : (content.steps ? content : { steps: content });
    } catch (error) {
        console.error('Gemini Roadmap Generation ERROR:', error.message);

        if (error.message.includes('429') || error.message.includes('Quota exceeded')) {
            throw new Error('AI Daily Limit Reached: Our education system is very busy. Please try again after 1 minute or check your daily quota.');
        }

        throw new Error(`Failed to generate roadmap: ${error.message}`);
    }
};

/**
 * Suggests video search queries based on an educational topic.
 */
export const suggestVideos = async (topic, language) => {
    try {
        const prompt = `Act as an educational content curator. For the topic "${topic}", recommend 3 specific, high-quality YouTube search terms that would lead to the best tutorial videos in ${language}. 
        Focus on practical, easy-to-understand content for beginners.
        Return ONLY a JSON object with a "queries" array. Example: {"queries": ["Title 1", "Title 2", "Title 3"]}.
        No markdown formatting.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        console.log('Gemini Raw Response (Videos):', text);

        // More robust JSON extraction: Match either an object {} or an array []
        const jsonMatch = text.match(/([\[\{][\s\S]*[\]\}])/);
        if (!jsonMatch) {
            console.error('No JSON found in AI response (Videos):', text);
            return [topic];
        }

        const content = JSON.parse(jsonMatch[0]);
        const queries = Array.isArray(content) ? content : (content.queries || content.search_queries || []);
        return queries;
    } catch (error) {
        console.error('Gemini Video Suggestion Error:', error);
        if (error.message.includes('429') || error.message.includes('Quota exceeded')) {
            console.warn('Video Suggestion Quota Exceeded. Falling back to default search.');
        }
        return [topic];
    }
};
