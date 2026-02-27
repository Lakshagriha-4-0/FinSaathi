import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Play, BookOpen, Video, Search } from 'lucide-react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import AudioButton from '../components/AudioButton';

const Learn = () => {
    const { t } = useTranslation();
    const [roadmap, setRoadmap] = useState(null);
    const [videos, setVideos] = useState({});
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(null);
    const [roadmapLang, setRoadmapLang] = useState(''); // Empty defaults to profile lang
    const [customGoal, setCustomGoal] = useState('');
    const [error, setError] = useState(null);

    const fetchRoadmap = async (goal = null) => {
        setLoading(true);
        setError(null);
        setActiveStep(null);
        try {
            const params = {};
            if (goal) params.topic = goal;
            if (roadmapLang) params.lang = roadmapLang;

            const { data } = await api.get('/ai/roadmap', { params });
            if (data.steps && data.steps.length > 0) {
                setRoadmap(data.steps);
            } else {
                setError("AI was unable to generate a roadmap. Please try again with a different topic.");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchVideos = async (topic) => {
        if (videos[topic]) return;
        try {
            const params = roadmapLang ? { lang: roadmapLang } : {};
            const { data } = await api.get(`/ai/videos/${encodeURIComponent(topic)}`, { params });
            setVideos(prev => ({ ...prev, [topic]: data.queries }));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRoadmap();
    }, []);

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        setRoadmap(null); // Clear previous roadmap
        fetchRoadmap(customGoal.trim() || null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="bg-secondary/5 p-8 lg:p-12 rounded-[40px] border border-secondary/10 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-4 text-secondary">
                            <div className="flex items-center gap-2">
                                <Sparkles size={20} />
                                <span className="text-xs font-bold uppercase tracking-[0.2em]">{t('ai_learning')}</span>
                            </div>
                            <AudioButton text={`${t('ai_learning')}. ${t('learning_path')}`} />
                        </div>
                        <h1 className="text-3xl font-display font-black text-gray-900">{t('learn')}</h1>
                        <p className="text-gray-500 font-medium">{t('guide_desc')}</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <form onSubmit={handleCustomSubmit} className="relative h-full">
                            <div className="absolute inset-y-0 left-6 flex items-center text-gray-400 group-focus-within:text-secondary transition-colors">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder={t('learn_goal_placeholder')}
                                className="w-full h-full pl-16 pr-10 py-5 bg-white border border-gray-100 rounded-[24px] shadow-sm focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all outline-none font-medium"
                                value={customGoal}
                                onChange={(e) => setCustomGoal(e.target.value)}
                            />
                        </form>
                    </div>

                    <div className="w-full md:w-48">
                        <select
                            value={roadmapLang}
                            onChange={(e) => setRoadmapLang(e.target.value)}
                            className="w-full py-5 px-6 bg-white border border-gray-100 rounded-[24px] shadow-sm focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all outline-none font-bold text-gray-700 appearance-none cursor-pointer"
                        >
                            <option value="">{t('language')}</option>
                            <option value="en">English</option>
                            <option value="hi">हिंदी (Hindi)</option>
                            <option value="mr">मराठी (Marathi)</option>
                            <option value="ta">தமிழ் (Tamil)</option>
                        </select>
                    </div>

                    <button
                        onClick={handleCustomSubmit}
                        disabled={loading}
                        className="px-10 py-5 bg-secondary text-white font-bold rounded-[24px] shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                        {loading ? t('thinking') : t('get_roadmap')}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {error && (
                    <div className="p-6 bg-red-50 border border-red-100 rounded-[24px] text-red-600 flex items-center gap-4">
                        <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold">!</div>
                        <p className="font-medium text-sm">{error}</p>
                    </div>
                )}
                {!loading && (!roadmap || roadmap.length === 0) && !error && (
                    <div className="p-12 text-center bg-white/50 border border-dashed border-gray-200 rounded-[40px] space-y-4">
                        <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                            <Sparkles size={40} className="text-primary/40" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">What would you like to learn today?</h3>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium">Enter a topic above like "UPI Security" or "Crop Loans" to generate your custom AI learning roadmap.</p>
                    </div>
                )}
                {loading ? (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-gray-400 font-bold animate-pulse">{t('designing_path')}</p>
                    </div>
                ) : (
                    roadmap?.map((step, idx) => (
                        <div
                            key={idx}
                            className={`group p-6 lg:p-10 rounded-[40px] border transition-all ${activeStep === idx ? 'bg-white border-primary shadow-xl ring-1 ring-primary/10' : 'bg-white/50 border-gray-100 hover:border-primary/30'}`}
                        >
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-shrink-0">
                                    <div className={`h-16 w-16 rounded-3xl flex items-center justify-center font-black text-2xl transition-colors ${activeStep === idx ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                        {idx + 1}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none mb-2 inline-block">
                                                {step.category || 'Financial Basic'}
                                            </span>
                                            <h3 className="text-2xl font-display font-extrabold text-gray-900 group-hover:text-primary transition-colors flex items-center gap-3">
                                                {step.title}
                                                <AudioButton text={`${step.title}. ${step.description}`} />
                                            </h3>
                                        </div>
                                        {activeStep === idx ? (
                                            <span className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 px-4 py-2 rounded-xl">
                                                <Play size={16} fill="currentColor" /> {t('currently_learning')}
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setActiveStep(idx);
                                                    fetchVideos(step.title);
                                                }}
                                                className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                                            >
                                                {t('start_topic')}
                                            </button>
                                        )}
                                    </div>

                                    <p className="text-gray-500 leading-relaxed font-medium text-lg">
                                        {step.description}
                                    </p>

                                    {activeStep === idx && (
                                        <div className="pt-8 mt-8 border-t border-gray-100 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h4 className="flex items-center gap-3 font-black text-gray-900 text-lg">
                                                    <div className="p-2 bg-secondary/10 rounded-lg">
                                                        <Video size={20} className="text-secondary" />
                                                    </div>
                                                    {t('lessons_youtube')}
                                                </h4>
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                    AI Verified
                                                </span>
                                            </div>

                                            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
                                                {(videos[step.title] || [t('loading'), t('loading'), t('loading')]).map((video, vIdx) => (
                                                    <a
                                                        key={vIdx}
                                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group/video relative overflow-hidden p-5 bg-gray-50 rounded-[24px] flex flex-col gap-3 hover:bg-white hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300 border border-transparent hover:border-secondary/20"
                                                    >
                                                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover/video:opacity-100 transition-opacity">
                                                            <Sparkles size={14} className="text-secondary" />
                                                        </div>
                                                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover/video:scale-110 transition-transform duration-300">
                                                            <Play size={20} className="text-secondary fill-secondary/20 group-hover/video:fill-secondary transition-all" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Recommended Lesson</p>
                                                            <span className="text-sm font-bold leading-snug text-gray-900 group-hover/video:text-secondary transition-colors line-clamp-2">
                                                                {video}
                                                            </span>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-10 bg-primary rounded-[40px] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-primary/20">
                <div className="p-5 bg-white/10 rounded-3xl backdrop-blur-md">
                    <BookOpen size={48} />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-3">
                        {t('practical_ready')}
                        <AudioButton text={`${t('practical_ready')} ${t('practical_desc')}`} />
                    </h2>
                    <p className="text-primary-light font-medium mt-1">{t('practical_desc')}</p>
                </div>
                <Link to="/dashboard" className="px-8 py-4 bg-white text-primary font-black rounded-2xl whitespace-nowrap">
                    {t('go_dashboard')}
                </Link>
            </div>
        </div>
    );
};

export default Learn;
