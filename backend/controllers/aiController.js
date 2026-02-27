import User from '../models/User.js';
import { generateRoadmap, suggestVideos } from '../services/aiService.js';

// @desc    Get personalized learning roadmap
// @route   GET /api/ai/roadmap
// @access  Private
export const getUserRoadmap = async (req, res, next) => {
    try {
        const { topic, lang } = req.query;
        let user = await User.findById(req.user._id);

        // If a specific topic or language is requested, generate a fresh one and RETURN immediately
        if (topic) {
            const roadmapData = await generateRoadmap(user, topic, lang || user.language);
            return res.json({ steps: roadmapData.steps || [] });
        }

        // Only return saved roadmap if NO topic is specified
        if (user.roadmap && user.roadmap.length > 0) {
            return res.json({ steps: user.roadmap });
        }

        // Default roadmap generation for empty state (if user has none)
        const roadmapData = await generateRoadmap(user, null, lang || user.language);
        user.roadmap = roadmapData.steps || [];
        await user.save();

        res.json({ steps: user.roadmap });
    } catch (error) {
        console.error('getUserRoadmap Error:', error);
        next(error);
    }
};

// @desc    Get suggested videos for a topic
// @route   GET /api/ai/videos/:topic
// @access  Private
export const getVideoRecs = async (req, res, next) => {
    try {
        const { lang } = req.query;
        const targetLang = lang || req.user.language;
        const queries = await suggestVideos(req.params.topic, targetLang);
        res.json({ queries });
    } catch (error) {
        next(error);
    }
};
