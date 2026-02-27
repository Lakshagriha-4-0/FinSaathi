import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ArrowUpCircle,
    ArrowDownCircle,
    Plus,
    History,
    TrendingUp,
    AlertTriangle,
    Sparkles,
    Loader2
} from 'lucide-react';
import api from '../services/api';
import AudioButton from '../components/AudioButton';
import MentorChat from '../components/MentorChat';

const Dashboard = () => {
    const { t, i18n } = useTranslation();
    const [expenses, setExpenses] = useState([]);
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('General');

    useEffect(() => {
        fetchExpenses();
        fetchInsights();
    }, [i18n.language]);

    const fetchExpenses = async () => {
        try {
            const { data } = await api.get('/finance/expenses');
            setExpenses(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchInsights = async () => {
        setLoadingInsights(true);
        try {
            const { data } = await api.get('/finance/insights');
            setInsights(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingInsights(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/finance/expenses', { title, amount: Number(amount), type, category });
            setTitle('');
            setAmount('');
            setCategory('General');
            fetchExpenses();
            fetchInsights();
        } catch (err) {
            console.error(err);
        }
    };

    const totalIncome = expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const balance = totalIncome - totalExpense;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
                            {t('financial_snapshot')}
                            <AudioButton text={t('financial_snapshot')} />
                        </h1>
                        <p className="text-gray-500 font-medium">{t('path_to_prosperity')}</p>
                    </div>
                </div>
                <div className="px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold border border-accent/20 flex items-center gap-2">
                    <AlertTriangle size={14} />
                    {t('safe_zone')}
                </div>
            </div>

            {/* AI Insights Bar */}
            <div className="bg-gradient-to-r from-primary via-primary-light to-primary-dark rounded-[32px] p-1 shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="bg-white/95 backdrop-blur-md rounded-[31px] p-6 lg:p-8 flex flex-col lg:flex-row items-center gap-6 relative z-10 transition-colors duration-500 group-hover:bg-white">
                    <div className="shrink-0 h-16 w-16 bg-gradient-to-tr from-primary to-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                        <Sparkles size={32} className="animate-pulse" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight font-display">{t('ai_insight')}</h3>
                            {insights && <AudioButton text={`${t('ai_insight')}. ${insights.summary}. ${t('saving_tips')}: ${insights.tips?.join('. ')}`} />}
                        </div>
                        {loadingInsights ? (
                            <div className="flex items-center gap-2 text-gray-400 font-medium italic">
                                <Loader2 size={16} className="animate-spin" />
                                {t('thinking')}
                            </div>
                        ) : insights?.tips?.length > 0 ? (
                            <div className="space-y-4">
                                <p className="text-gray-700 font-medium border-l-[4px] border-accent pl-4 text-base leading-relaxed bg-accent/5 py-1 pr-3 rounded-r-lg">{insights.summary}</p>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {insights.tips.map((tip, i) => (
                                        <div key={i} className="bg-gradient-to-b from-gray-50 to-white p-4 rounded-2xl border border-gray-100 text-[13px] font-bold text-gray-700 flex gap-3 items-start shadow-sm hover:shadow-md transition-shadow">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
                                            <span className="leading-snug pt-0.5">{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400 font-medium italic">{t('no_insights')}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="p-8 bg-gradient-to-br from-white to-gray-50 rounded-[32px] border border-gray-200 shadow-xl shadow-gray-200/50 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                        <TrendingUp size={100} className="text-primary" />
                    </div>
                    <div className="flex items-center gap-2 mb-1 relative z-10">
                        <p className="text-sm font-black text-gray-500 uppercase tracking-widest font-display">{t('balance')}</p>
                        <AudioButton text={t('balance')} />
                    </div>
                    <p className={`text-4xl font-black mt-2 font-display relative z-10 ${balance >= 0 ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light' : 'text-red-500'}`}>
                        ₹ {balance.toLocaleString()}
                    </p>
                </div>

                <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-lg shadow-gray-200/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <ArrowUpCircle size={20} className="text-primary" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest font-display text-gray-500">{t('total_income')}</span>
                        <AudioButton text={t('total_income')} />
                    </div>
                    <p className="text-3xl font-display font-black text-gray-900 mt-2">₹ {totalIncome.toLocaleString()}</p>
                </div>

                <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-lg shadow-gray-200/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300">
                    <div className="flex items-center gap-3 text-red-500 mb-2">
                        <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
                            <ArrowDownCircle size={20} className="text-red-500" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest font-display text-gray-500">{t('total_expense')}</span>
                        <AudioButton text={t('total_expense')} />
                    </div>
                    <p className="text-3xl font-display font-black text-gray-900 mt-2">₹ {totalExpense.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_0.4fr] gap-8">
                {/* Transaction History */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <History size={20} className="text-gray-400" />
                            {t('recent_activities')}
                            <AudioButton text={t('recent_activities')} />
                        </h3>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden">
                        {expenses.length === 0 ? (
                            <div className="p-12 text-center space-y-3">
                                <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                    <History size={24} />
                                </div>
                                <p className="text-gray-400 font-medium">No transactions found yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {expenses.map((expense) => (
                                    <div key={expense._id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl ${expense.type === 'income' ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-500'}`}>
                                                {expense.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{expense.title}</p>
                                                <p className="text-xs text-gray-400 font-medium capitalize">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <p className={`font-bold ${expense.type === 'income' ? 'text-primary' : 'text-gray-900'}`}>
                                            {expense.type === 'income' ? '+' : '-'} ₹{expense.amount}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Add Form */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Plus size={20} className="text-gray-400" />
                        {t('quick_record')}
                        <AudioButton text={t('quick_record')} />
                    </h3>
                    <div className="bg-white p-6 border border-gray-100 rounded-[32px] shadow-sm">
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 font-display">{t('title_label')}</label>
                                <input
                                    type="text"
                                    className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-bold"
                                    placeholder="e.g., Weekly Salary"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 font-display">{t('amount_label')} (₹)</label>
                                <input
                                    type="number"
                                    className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-bold"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 font-display">{t('category_label')}</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-bold appearance-none cursor-pointer"
                                >
                                    <option value="General">General</option>
                                    <option value="Food">Food / Groceries</option>
                                    <option value="Health">Health / Hospital</option>
                                    <option value="Agri">Agri / Farmer</option>
                                    <option value="Education">Education</option>
                                    <option value="Business">Small Business</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setType('income')}
                                    className={`flex-1 py-3 text-xs font-bold rounded-2xl transition-all ${type === 'income' ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400'}`}
                                >
                                    {t('income')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('expense')}
                                    className={`flex-1 py-3 text-xs font-bold rounded-2xl transition-all ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-50 text-gray-400'}`}
                                >
                                    {t('expense')}
                                </button>
                            </div>
                            <button className="w-full py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-extrabold rounded-2xl shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                <Plus size={18} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                                {t('save_entry')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <MentorChat />
        </div>
    );
};

export default Dashboard;
