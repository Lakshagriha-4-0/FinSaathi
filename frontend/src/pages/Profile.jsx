import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Globe, MapPin, TrendingUp, Users, Save } from 'lucide-react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import AudioButton from '../components/AudioButton';

const Profile = () => {
    const { user, login } = useContext(AuthContext);
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        language: user?.language || 'en',
        incomeBracket: user?.familyCondition?.incomeBracket || '< 2L',
        dependents: user?.familyCondition?.dependents || 0,
        isRulerArea: user?.familyCondition?.isRulerArea ?? true,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                language: user.language || 'en',
                incomeBracket: user.familyCondition?.incomeBracket || '< 2L',
                dependents: user.familyCondition?.dependents || 0,
                isRulerArea: user.familyCondition?.isRulerArea ?? true,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const { name, language, incomeBracket, dependents, isRulerArea } = formData;
            const res = await api.put('/auth/profile', {
                name,
                language,
                familyCondition: {
                    incomeBracket,
                    dependents: Number(dependents),
                    isRulerArea
                }
            });
            login(res.data);
            i18n.changeLanguage(res.data.language);
            setMessage(t('profile_success'));
        } catch (err) {
            setMessage(err.response?.data?.message || 'Update failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-white p-8 lg:p-12 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="flex items-center gap-6 mb-10">
                    <div className="h-20 w-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center">
                        <User size={40} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-black text-gray-900 flex items-center gap-3">
                            {t('profile_title')}
                            <AudioButton text={`${t('profile_title')}. ${t('profile_desc')}`} />
                        </h1>
                        <p className="text-gray-500 font-medium">{t('profile_desc')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {message && (
                        <div className={`p-4 rounded-2xl text-sm font-bold border ${message.includes('success') || message === t('profile_success') ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            {message}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2 font-display">
                                    <User size={14} /> {t('full_name')}
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-bold"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2 font-display">
                                    <Globe size={14} /> {t('language')}
                                </label>
                                <select
                                    name="language"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-bold"
                                    value={formData.language}
                                    onChange={handleChange}
                                >
                                    <option value="en">English</option>
                                    <option value="hi">Hindi (हिंदी)</option>
                                    <option value="mr">Marathi (मराठी)</option>
                                    <option value="ta">Tamil (தமிழ்)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2 font-display">
                                    <TrendingUp size={14} /> {t('yearly_income')}
                                </label>
                                <select
                                    name="incomeBracket"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-bold"
                                    value={formData.incomeBracket}
                                    onChange={handleChange}
                                >
                                    <option value="< 2L">{t('< 2L') || 'Less than 2 Lakh'}</option>
                                    <option value="2L-5L">{t('2L-5L') || '2 Lakh - 5 Lakh'}</option>
                                    <option value="> 5L">{t('> 5L') || 'More than 5 Lakh'}</option>
                                </select>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2 font-display">
                                    <Users size={14} /> {t('dependents_count')}
                                </label>
                                <input
                                    type="number"
                                    name="dependents"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-bold"
                                    value={formData.dependents}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-5 bg-primary/5 rounded-2xl border border-primary/10">
                        <input
                            type="checkbox"
                            name="isRulerArea"
                            id="isRulerArea"
                            checked={formData.isRulerArea}
                            onChange={handleChange}
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                        />
                        <label htmlFor="isRulerArea" className="text-sm font-bold text-gray-700 select-none cursor-pointer">
                            {t('rural_area')}
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-4 bg-primary text-white font-extrabold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? t('saving') : <><Save size={20} /> {t('save_profile')}</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
