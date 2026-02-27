import React, { useState, useEffect } from 'react';
import { Handshake, Search, ArrowRight, UserCheck, Wallet, ExternalLink, Sparkles, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import AudioButton from '../components/AudioButton';

const Schemes = () => {
    const { t, i18n } = useTranslation();
    const [schemes, setSchemes] = useState([]);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedScheme, setSelectedScheme] = useState(null);
    const [guide, setGuide] = useState(null);
    const [generatingGuide, setGeneratingGuide] = useState(false);

    useEffect(() => {
        fetchSchemes();
    }, [i18n.language]);

    const fetchSchemes = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/info/schemes');
            setSchemes(data.schemes || []);
            setAiAnalysis(data.aiAnalysis);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyNow = async (scheme) => {
        setSelectedScheme(scheme);
        setGeneratingGuide(true);
        setGuide(null);
        try {
            const { data } = await api.post('/info/schemes/guide', {
                title: scheme.title,
                lang: i18n.language
            });
            setGuide(data);
        } catch (err) {
            console.error(err);
        } finally {
            setGeneratingGuide(false);
        }
    };

    const filteredSchemes = schemes.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-display font-black text-gray-900">{t('schemes_title')}</h1>
                        <AudioButton text={`${t('schemes_title')}. ${t('schemes_subtitle')}`} />
                    </div>
                    <p className="text-gray-500 font-medium">{t('schemes_subtitle')}</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder={t('search_schemes')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all text-sm shadow-sm outline-none"
                    />
                </div>
            </div>

            {/* AI Analysis Section */}
            {!loading && aiAnalysis && (
                <div className="bg-gradient-to-r from-secondary/10 to-transparent p-8 rounded-[40px] border border-secondary/20 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary/20 text-secondary rounded-xl">
                            <Sparkles size={20} />
                        </div>
                        <h2 className="text-xl font-display font-bold text-gray-900">{t('best_match')}</h2>
                        <AudioButton text={`${t('best_match')}. ${aiAnalysis.summary}`} />
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed italic border-l-4 border-secondary/30 pl-4">
                        {aiAnalysis.summary}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 pt-2">
                        {aiAnalysis.recommendations?.map((rec, i) => (
                            <div key={i} className="bg-white/50 p-4 rounded-2xl border border-white/50 space-y-1">
                                <p className="text-xs font-bold text-secondary uppercase tracking-wider">{rec.scheme}</p>
                                <p className="text-sm text-gray-700 font-medium">{rec.why}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
                {loading ? (
                    <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-gray-50 rounded-[40px] animate-pulse"></div>)}
                    </div>
                ) : (
                    filteredSchemes.map((scheme) => (
                        <div key={scheme._id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-secondary/5 text-secondary rounded-2xl group-hover:bg-secondary group-hover:text-white transition-colors">
                                        <Wallet size={24} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AudioButton text={`${scheme.title}. ${scheme.description}. ${t('benefit_type')}: ${scheme.benefit}`} />
                                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">
                                            {t('active_benefit')}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-gray-900">{scheme.title}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">{scheme.description}</p>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('eligibility_label')}</p>
                                        <p className="text-xs font-bold text-gray-700">Income &lt; ₹{scheme.eligibility.incomeLimit.toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('benefit_type')}</p>
                                        <p className="text-xs font-bold text-gray-700">{scheme.benefit || 'Financial'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                <button
                                    onClick={() => handleApplyNow(scheme)}
                                    className="flex items-center gap-2 text-primary font-bold hover:scale-105 transition-transform text-sm"
                                >
                                    {t('apply_now')} <ArrowRight size={16} />
                                </button>
                                <a
                                    href={scheme.officialLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 hover:bg-gray-800 transition-colors"
                                >
                                    {t('view_guide')} <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    ))
                )}

                {!loading && filteredSchemes.length === 0 && (
                    <div className="lg:col-span-2 p-20 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                        <UserCheck size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 font-bold text-xl">{t('finding_matches')}</p>
                        <p className="text-gray-400 font-medium mt-1">{t('matches_desc')}</p>
                    </div>
                )}
            </div>

            <div className="bg-gray-900 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-bold">{t('documents_title')}</h2>
                        <AudioButton text={`${t('documents_title')}. ${t('documents_subtitle')}`} />
                    </div>
                    <p className="text-gray-400 font-medium text-lg">{t('documents_subtitle')}</p>
                    <div className="flex gap-4 pt-2">
                        <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl text-sm hover:scale-105 transition-all">
                            {t('call_guide')}
                        </button>
                        <button className="px-6 py-3 border border-gray-700 text-gray-400 font-bold rounded-xl text-sm hover:bg-white/5 transition-all">
                            {t('whatsapp_support')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Scheme Guide Modal */}
            {selectedScheme && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedScheme(null)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-secondary text-white">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 flex items-center gap-2">
                                    <Sparkles size={12} /> {t('schemes')}
                                </span>
                                <h2 className="text-2xl font-display font-black mt-1">{selectedScheme.title} GUIDE</h2>
                            </div>
                            <button onClick={() => setSelectedScheme(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-6">
                            {generatingGuide ? (
                                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                    <Loader2 className="animate-spin text-secondary" size={40} />
                                    <p className="text-gray-500 font-bold animate-pulse">{t('thinking')}</p>
                                </div>
                            ) : guide ? (
                                <div className="space-y-8">
                                    {guide.map((step, i) => (
                                        <div key={i} className="flex gap-6 relative group">
                                            {i !== guide.length - 1 && (
                                                <div className="absolute left-[20px] top-10 bottom-0 w-0.5 bg-gray-100 group-hover:bg-secondary/20 transition-colors"></div>
                                            )}
                                            <div className="shrink-0 h-10 w-10 bg-secondary text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-secondary/20 z-10">
                                                {i + 1}
                                            </div>
                                            <div className="space-y-1 pb-6 flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-lg font-bold text-gray-900 uppercase tracking-tight">{step.step}</h4>
                                                    <AudioButton text={`${step.step}. ${step.action}`} />
                                                </div>
                                                <p className="text-gray-500 font-medium leading-relaxed">{step.action}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="p-6 bg-secondary/5 rounded-3xl border border-secondary/10">
                                        <AudioButton text={guide.map(s => `${s.step}. ${s.action}`).join(' ')} />
                                        <span className="ml-2 text-sm text-secondary font-bold">{t('view_guide')} (Audio)</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center py-10 text-gray-400 font-bold">Failed to load application guide.</p>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                            <button
                                onClick={() => setSelectedScheme(null)}
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

export default Schemes;
