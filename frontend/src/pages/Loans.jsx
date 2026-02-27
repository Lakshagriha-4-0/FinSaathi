import React, { useState, useEffect } from 'react';
import { Landmark, Info, Calculator, Sparkles, TrendingDown, ArrowRight, Wallet, Percent, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import AudioButton from '../components/AudioButton';

const Loans = () => {
    const { t, i18n } = useTranslation();
    const [loans, setLoans] = useState([]);
    const [suggestion, setSuggestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [guide, setGuide] = useState(null);
    const [generatingGuide, setGeneratingGuide] = useState(false);

    // EMI Calculator State
    const [amount, setAmount] = useState(50000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(1);
    const [emi, setEmi] = useState(0);

    useEffect(() => {
        fetchData();
    }, [i18n.language]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/loans/compare');
            setLoans(data.loans || []);
            setSuggestion(data.suggestion || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyNow = async (loan) => {
        setSelectedLoan(loan);
        setGeneratingGuide(true);
        setGuide(null);
        try {
            const { data } = await api.post('/loans/guide', {
                title: loan.title,
                provider: loan.provider,
                lang: i18n.language
            });
            setGuide(data);
        } catch (err) {
            console.error(err);
        } finally {
            setGeneratingGuide(false);
        }
    };

    useEffect(() => {
        const r = rate / 12 / 100;
        const n = years * 12;
        const emiValue = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        setEmi(emiValue || 0);
    }, [amount, rate, years]);

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="bg-white p-8 lg:p-12 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-4 text-warning">
                        <div className="flex items-center gap-2">
                            <Landmark size={20} className="text-secondary" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">{t('loans')}</span>
                        </div>
                        <AudioButton text={`${t('loan_hub_title')}. ${t('loan_hub_subtitle')}`} />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-display font-black text-gray-900">{t('loan_hub_title')}</h1>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <p className="text-gray-500 font-medium text-lg max-w-2xl">{t('loan_hub_subtitle')}</p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse border border-red-100 italic">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-600"></div>
                            Live Market Feed
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Suggestion Card */}
            {suggestion && (
                <div className="bg-gradient-to-br from-secondary/5 to-primary/5 p-1 rounded-[40px]">
                    <div className="bg-white p-8 lg:p-12 rounded-[38px] shadow-sm flex flex-col lg:flex-row gap-10 items-start">
                        <div className="h-20 w-20 shrink-0 bg-secondary/10 rounded-3xl flex items-center justify-center text-secondary">
                            <Sparkles size={40} />
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-2xl font-display font-bold text-gray-900">{t('best_match')}</h3>
                                <AudioButton text={`${t('best_match')}. ${suggestion.reason}. ${suggestion.advice}. ${suggestion.dynamicAdvice}`} />
                            </div>
                            <div className="p-6 bg-secondary/5 rounded-3xl border border-secondary/10 space-y-4">
                                <p className="text-gray-900 font-bold leading-relaxed italic border-l-4 border-secondary/30 pl-4">
                                    {suggestion.dynamicAdvice}
                                </p>
                                <p className="text-gray-700 font-medium leading-relaxed italic">{suggestion.reason}</p>

                                {suggestion.tips && (
                                    <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-secondary/10">
                                        {suggestion.tips.map((tip, idx) => (
                                            <div key={idx} className="flex gap-2 items-start">
                                                <div className="h-5 w-5 rounded-full bg-secondary/10 flex items-center justify-center text-[10px] font-bold text-secondary shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-xs text-gray-600 font-medium">{tip}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="pt-4 border-t border-secondary/10">
                                    <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-2">{t('best_advice')}</p>
                                    <p className="text-gray-900 font-bold">{suggestion.advice}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Loan List */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 px-4">{t('suggested_loans')}</h3>
                    {loading ? (
                        [1, 2].map(i => <div key={i} className="h-48 bg-gray-50 rounded-[40px] animate-pulse"></div>)
                    ) : (
                        loans.map(loan => (
                            <div key={loan._id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                                                <Wallet size={20} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{loan.provider}</span>
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-tighter">Live Market</span>
                                        </div>
                                        <h4 className="text-2xl font-display font-bold text-gray-900">
                                            {loan.title}
                                            {suggestion?.bestMatchTitle === loan.title && (
                                                <span className="ml-3 text-[10px] bg-secondary text-white px-2 py-1 rounded-full uppercase tracking-widest">
                                                    {t('best_match')}
                                                </span>
                                            )}
                                        </h4>
                                        <p className="text-gray-500 font-medium text-sm leading-relaxed">{loan.description || loan.reason}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {loan.benefits?.map((b, i) => (
                                                <span key={i} className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold">
                                                    {b}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="md:w-48 space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-2xl text-center group-hover:bg-secondary/5 transition-colors">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('interest_rate')}</p>
                                            <p className="text-3xl font-display font-black text-secondary">{loan.interestRate}%</p>
                                        </div>
                                        <button
                                            onClick={() => handleApplyNow(loan)}
                                            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
                                        >
                                            {t('apply_now')} <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Calculator */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 px-4">{t('calculate_emi')}</h3>
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm sticky top-24 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">{t('loan_amount')}</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="w-full pl-10 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-secondary outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">{t('interest_p_a')}</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 group-focus-within:text-secondary"><Percent size={16} /></span>
                                    <input
                                        type="number"
                                        value={rate}
                                        onChange={(e) => setRate(Number(e.target.value))}
                                        className="w-full pl-10 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-secondary outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">{t('term_label')} ({years} {years > 1 ? 'years' : 'year'})</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="30"
                                    value={years}
                                    onChange={(e) => setYears(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-secondary"
                                />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-500">{t('monthly_emi')}</span>
                                <span className="text-2xl font-display font-black text-gray-900">₹{Math.round(emi).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-gray-400">{t('total_interest')}</span>
                                <span className="font-bold text-gray-700">₹{Math.round((emi * years * 12) - amount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Guide Modal */}
            {selectedLoan && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedLoan(null)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-primary text-white">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 flex items-center gap-2">
                                    <Sparkles size={12} /> {t('apply_now')}
                                </span>
                                <h2 className="text-2xl font-display font-black mt-1">{selectedLoan.title} GUIDE</h2>
                            </div>
                            <button onClick={() => setSelectedLoan(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-6">
                            {generatingGuide ? (
                                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                    <Loader2 className="animate-spin text-primary" size={40} />
                                    <p className="text-gray-500 font-bold animate-pulse">{t('thinking')}</p>
                                </div>
                            ) : guide ? (
                                <div className="space-y-8">
                                    {guide.map((step, i) => (
                                        <div key={i} className="flex gap-6 relative group">
                                            {i !== guide.length - 1 && (
                                                <div className="absolute left-[20px] top-10 bottom-0 w-0.5 bg-gray-100 group-hover:bg-primary/20 transition-colors"></div>
                                            )}
                                            <div className="shrink-0 h-10 w-10 bg-primary text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-primary/20 z-10">
                                                {i + 1}
                                            </div>
                                            <div className="space-y-1 pb-6">
                                                <h4 className="text-lg font-bold text-gray-900 uppercase tracking-tight">{step.step}</h4>
                                                <p className="text-gray-500 font-medium leading-relaxed">{step.action}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                                        <AudioButton text={guide.map(s => `${s.step}. ${s.action}`).join(' ')} />
                                        <span className="ml-2 text-sm text-primary font-bold">{t('view_guide')} (Audio)</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center py-10 text-gray-400 font-bold">Failed to load application guide.</p>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                            <button
                                onClick={() => setSelectedLoan(null)}
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

export default Loans;
