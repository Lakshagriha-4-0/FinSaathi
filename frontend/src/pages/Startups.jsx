import React, { useState, useEffect, useContext } from 'react';
import { Rocket, IndianRupee, BarChart, Users, ChevronRight, Briefcase, X, Sparkles, Loader2, Target } from 'lucide-react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import AudioButton from '../components/AudioButton';
import { AuthContext } from '../context/AuthContext';

const Startups = () => {
    const { user } = useContext(AuthContext);
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
            <div className="bg-gradient-to-br from-accent via-accent-light to-accent-dark rounded-[40px] p-10 lg:p-16 text-white shadow-2xl shadow-accent/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                    <Rocket size={200} />
                </div>
                <div className="relative z-10 space-y-6 max-w-2xl">
                    <div className="flex items-center gap-3">
                        <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                            {user ? <><Target size={12} /> Personalized for you</> : t('entrepreneur_hub')}
                        </span>
                        <AudioButton text={user ? `Personalized Startup Ideas. ${t('startup_hub_subtitle')}` : `${t('startup_hub_title')}. ${t('startup_hub_subtitle')}`} />
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-display font-black leading-tight tracking-tight">
                        {t('startup_hub_title')}
                    </h1>
                    <p className="text-white/90 text-xl font-medium max-w-xl leading-relaxed">
                        {t('startup_hub_subtitle')}
                    </p>
                </div>
            </div>

            {/* Startups Grid */}
            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-96 bg-gray-100/50 blur-sm animate-pulse rounded-[40px] border border-gray-100"></div>
                    ))}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {startups.map((biz, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2 transition-all duration-300 group flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent to-accent-light opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-accent/10 text-accent rounded-[20px] group-hover:bg-gradient-to-br group-hover:from-accent group-hover:to-accent-dark group-hover:text-white transition-all duration-300 shadow-sm">
                                    <Briefcase size={28} />
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${biz.difficulty === 'Easy' || biz.difficulty === t('difficulty_easy')
                                    ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                    {biz.difficulty}
                                </span>
                            </div>

                            <h3 className="text-2xl font-display font-black text-gray-900 mb-3 tracking-tight">{biz.title}</h3>
                            <div className="flex gap-2 items-start mb-8 text-sm">
                                <p className="text-gray-500 font-medium leading-relaxed flex-grow">{biz.description}</p>
                                <AudioButton text={biz.description} />
                            </div>

                            <div className="space-y-4 pt-6 border-t border-gray-100 mt-auto">
                                <div className="flex items-center justify-between text-sm bg-gray-50/50 p-2.5 rounded-xl">
                                    <span className="text-gray-500 font-bold flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-gray-200/50 flex items-center justify-center"><IndianRupee size={12} className="text-gray-600" /></div>
                                        {t('investment_label')}
                                    </span>
                                    <span className="text-gray-900 font-black tracking-tight">{biz.investmentRequired}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm bg-primary/5 p-2.5 rounded-xl border border-primary/10">
                                    <span className="text-gray-500 font-bold flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center"><BarChart size={12} className="text-primary" /></div>
                                        {t('profit_label')}
                                    </span>
                                    <span className="text-primary font-black tracking-tight">{biz.profitMargin}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleViewBlueprint(biz)}
                                className="w-full mt-8 py-4 bg-gray-50 text-gray-900 font-black rounded-2xl group-hover:bg-accent group-hover:text-white group-hover:shadow-lg group-hover:shadow-accent/30 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Sparkles size={18} className="group-hover:animate-pulse" />
                                {t('blueprint_btn')}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Mentor Section */}
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-[40px] p-10 lg:p-16 text-white flex flex-col lg:flex-row items-center gap-10 shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 opacity-10 group-hover:scale-110 transition-transform duration-1000 -translate-x-10 translate-y-10">
                    <Users size={200} />
                </div>
                <div className="h-24 w-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-[28px] flex items-center justify-center shrink-0 shadow-lg relative z-10 group-hover:-translate-y-2 transition-transform duration-500">
                    <Users size={40} />
                </div>
                <div className="flex-1 text-center lg:text-left space-y-3 relative z-10">
                    <h2 className="text-3xl lg:text-4xl font-display font-black tracking-tight">{t('need_mentor')}</h2>
                    <p className="text-white/80 font-medium text-lg max-w-2xl">{t('mentor_desc')}</p>
                </div>
                <button className="px-10 py-5 bg-white text-primary font-black rounded-2xl shadow-xl hover:shadow-2xl hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 relative z-10 group/btn">
                    <Sparkles size={20} className="text-accent group-hover/btn:rotate-12 transition-transform" />
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
                                            <div className="space-y-2 pb-6 flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-xl font-bold text-gray-900">{step.step}</h4>
                                                    <AudioButton text={`${step.step}. ${step.advice}`} />
                                                </div>
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
