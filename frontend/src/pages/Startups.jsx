import React, { useState, useEffect } from 'react';
import { Rocket, IndianRupee, BarChart, Users, ChevronRight, Briefcase, X, Sparkles, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import AudioButton from '../components/AudioButton';

const Startups = () => {
    const { t, i18n } = useTranslation();
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStartup, setSelectedStartup] = useState(null);
    const [blueprint, setBlueprint] = useState(null);
    const [generatingBlueprint, setGeneratingBlueprint] = useState(false);

    useEffect(() => {
        fetchStartups();
    }, [i18n.language]);

    const fetchStartups = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/startups?lang=${i18n.language}`);
            setStartups(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewBlueprint = async (startup) => {
        setSelectedStartup(startup);
        setGeneratingBlueprint(true);
        setBlueprint(null);
        try {
            const { data } = await api.post('/startups/blueprint', {
                title: startup.title,
                lang: i18n.language
            });
            setBlueprint(data);
        } catch (err) {
            console.error(err);
        } finally {
            setGeneratingBlueprint(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            {/* Header / Hero */}
            <div className="bg-gradient-to-r from-accent to-accent-dark rounded-[40px] p-8 lg:p-14 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Rocket size={160} />
                </div>
                <div className="relative z-10 space-y-4 max-w-2xl">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                            {t('entrepreneur_hub')}
                        </span>
                        <AudioButton text={`${t('startup_hub_title')}. ${t('startup_hub_subtitle')}`} />
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-display font-black leading-tight">
                        {t('startup_hub_title')}
                    </h1>
                    <p className="text-accent-light text-lg font-medium">
                        {t('startup_hub_subtitle')}
                    </p>
                </div>
            </div>

            {/* Startups Grid */}
            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-[40px]"></div>
                    ))}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {startups.map((biz, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group border-b-4 border-b-accent/20 flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-accent/5 text-accent rounded-3xl group-hover:bg-accent group-hover:text-white transition-colors">
                                    <Briefcase size={28} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${biz.difficulty === 'Easy' || biz.difficulty === t('difficulty_easy')
                                        ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {biz.difficulty}
                                </span>
                            </div>

                            <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">{biz.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed mb-6 flex-grow">{biz.description}</p>

                            <div className="space-y-3 pt-6 border-t border-gray-50">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400 font-bold flex items-center gap-2">
                                        <IndianRupee size={16} /> {t('investment_label')}
                                    </span>
                                    <span className="text-gray-900 font-black">{biz.investmentRequired}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400 font-bold flex items-center gap-2">
                                        <BarChart size={16} /> {t('profit_label')}
                                    </span>
                                    <span className="text-primary font-black">{biz.profitMargin}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleViewBlueprint(biz)}
                                className="w-full mt-8 py-4 bg-gray-50 text-gray-900 font-bold rounded-2xl group-hover:bg-accent group-hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <Sparkles size={18} />
                                {t('blueprint_btn')}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Mentor Section */}
            <div className="bg-primary rounded-[40px] p-10 lg:p-16 text-white flex flex-col lg:flex-row items-center gap-10">
                <div className="h-20 w-20 bg-white/10 rounded-3xl flex items-center justify-center shrink-0">
                    <Users size={40} />
                </div>
                <div className="flex-1 text-center lg:text-left space-y-2">
                    <h2 className="text-3xl font-display font-bold">{t('need_mentor')}</h2>
                    <p className="text-primary-light font-medium text-lg">{t('mentor_desc')}</p>
                </div>
                <button className="px-10 py-5 bg-white text-primary font-black rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                    <Sparkles size={18} className="text-accent" />
                    {t('talk_to_mentor')}
                </button>
            </div>

            {/* Blueprint Modal */}
            {selectedStartup && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedStartup(null)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                                    <Sparkles size={12} /> AI Powered Guide
                                </span>
                                <h2 className="text-2xl font-display font-black text-gray-900 mt-1">{t('blueprint_title')}: {selectedStartup.title}</h2>
                            </div>
                            <button onClick={() => setSelectedStartup(null)} className="p-3 bg-white text-gray-400 hover:text-gray-900 rounded-2xl shadow-sm transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-6">
                            {generatingBlueprint ? (
                                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                    <Loader2 className="animate-spin text-accent" size={40} />
                                    <p className="text-gray-500 font-bold animate-pulse">{t('thinking')}</p>
                                </div>
                            ) : blueprint ? (
                                <div className="space-y-8">
                                    {blueprint.map((step, i) => (
                                        <div key={i} className="flex gap-6 relative group">
                                            {i !== blueprint.length - 1 && (
                                                <div className="absolute left-[20px] top-10 bottom-0 w-0.5 bg-gray-100 group-hover:bg-accent/20 transition-colors"></div>
                                            )}
                                            <div className="shrink-0 h-10 w-10 bg-accent text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-accent/20 z-10">
                                                {i + 1}
                                            </div>
                                            <div className="space-y-2 pb-6">
                                                <h4 className="text-xl font-bold text-gray-900">{step.step}</h4>
                                                <p className="text-gray-500 font-medium leading-relaxed">{step.advice}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                        <AudioButton text={blueprint.map(s => `${s.step}. ${s.advice}`).join(' ')} />
                                        <span className="ml-2 text-sm text-gray-500 font-bold italic">Listen to the full guide</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center py-10 text-gray-400 font-bold">Failed to load blueprint. Please try again.</p>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                            <button
                                onClick={() => setSelectedStartup(null)}
                                className="w-full py-4 bg-gray-900 text-white font-extrabold rounded-2xl hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm"
                            >
                                {t('blueprint_close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Startups;
