import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, ShieldCheck, ExternalLink, Calendar, Video, Play, X, Sparkles } from 'lucide-react';
import api from '../services/api';
import AudioButton from '../components/AudioButton';

const ScamAlerts = () => {
    const { t, i18n } = useTranslation();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [explanation, setExplanation] = useState(null);
    const [explaining, setExplaining] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const { data } = await api.get('/info/alerts');
                setAlerts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    const handleExplain = async (alert) => {
        setExplaining(true);
        setShowModal(true);
        setExplanation(null);
        try {
            const { data } = await api.post('/info/alerts/explain', {
                title: alert.title,
                description: alert.description,
                lang: i18n.language
            });
            setExplanation(data);
        } catch (err) {
            console.error(err);
        } finally {
            setExplaining(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 relative">
            <div className="bg-red-500 rounded-[40px] p-8 lg:p-12 text-white shadow-2xl shadow-red-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldAlert size={120} />
                </div>
                <div className="relative z-10 space-y-4">
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest w-fit">
                        {t('safe_zone')}
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-display font-black">{t('alerts')}</h1>
                    <p className="text-red-100 text-lg max-w-xl font-medium">
                        {t('schemes_subtitle')}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-[1fr_0.4fr] gap-8">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ShieldAlert className="text-red-500" />
                        Live Alerts
                    </h2>
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-[32px]"></div>)}
                        </div>
                    ) : (
                        alerts.map((alert) => (
                            <div key={alert._id} className="p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm space-y-4 group hover:border-red-200 transition-all">
                                <div className="flex justify-between items-start">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${alert.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {alert.severity} Priority
                                    </span>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                                        <Calendar size={14} />
                                        {new Date(alert.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3">
                                    {alert.title}
                                    <AudioButton text={`${alert.title}. ${alert.description}`} />
                                </h3>
                                <p className="text-gray-500 leading-relaxed font-medium">{alert.description}</p>
                                <div className="pt-4">
                                    <button
                                        onClick={() => handleExplain(alert)}
                                        className="px-6 py-3 bg-gray-900 text-white font-bold rounded-2xl text-sm hover:bg-gray-800 flex items-center gap-2 transition-transform active:scale-95"
                                    >
                                        <Sparkles size={16} className="text-primary" />
                                        {t('how_it_happens')}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900">Safety Checklist</h3>
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 space-y-6 shadow-xl shadow-gray-200/50">
                        {[
                            "Never share your UPI PIN on calls.",
                            "Bank never asks for OTP over SMS.",
                            "Verify loan agents via official apps.",
                            "Don't click links in unknown SMS."
                        ].map((tip, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    <ShieldCheck size={14} />
                                </div>
                                <p className="text-sm font-bold text-gray-700 leading-tight">{tip}</p>
                            </div>
                        ))}
                        <div className="pt-4">
                            <a
                                href="https://www.cybercrime.gov.in/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 bg-primary text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                            >
                                {t('contact_cyber_cell')}
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Explanation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <Sparkles className="text-primary" size={20} />
                                </div>
                                <h2 className="font-display font-black text-xl text-gray-900">{t('explanation_title')}</h2>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-8">
                            {explaining ? (
                                <div className="py-20 text-center space-y-4">
                                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-gray-400 font-bold animate-pulse">{t('thinking')}</p>
                                </div>
                            ) : explanation ? (
                                <>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">{t('ai_insight')}</h3>
                                            <AudioButton text={explanation.explanation} />
                                        </div>
                                        <p className="text-gray-600 text-lg leading-relaxed font-medium bg-secondary/5 p-6 rounded-[32px] border border-secondary/10">
                                            {explanation.explanation}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                            <Video className="text-red-500" size={20} />
                                            {t('video_lessons')}
                                        </h3>
                                        <div className="grid gap-3">
                                            {explanation.videoQueries?.map((query, idx) => (
                                                <a
                                                    key={idx}
                                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-5 bg-gray-50 rounded-[24px] border border-gray-100 flex items-center justify-between group hover:bg-white hover:border-primary hover:shadow-lg transition-all"
                                                >
                                                    <span className="font-bold text-gray-700 group-hover:text-primary transition-colors">{query}</span>
                                                    <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-gray-400">
                                                        <Play size={18} fill="currentColor" />
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-center text-red-500 font-bold">Failed to load explanation.</p>
                            )}
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100">
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-colors"
                            >
                                {t('close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScamAlerts;
