import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        language: 'en',
        incomeBracket: '< 2L',
        dependents: 0
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { name, email, password, language, incomeBracket, dependents } = formData;
            const { data } = await api.post('/auth/register', {
                name,
                email,
                password,
                language,
                familyCondition: {
                    incomeBracket,
                    dependents: Number(dependents),
                    isRulerArea: true
                }
            });
            login(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 lg:py-12">
            <div className="w-full max-w-2xl space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                        FS
                    </div>
                    <h1 className="mt-6 text-3xl font-display font-extrabold text-gray-900">Start Your Journey</h1>
                    <p className="mt-2 text-gray-500 font-medium font-display">Join thousands of rural leaders securing their family's future.</p>
                </div>

                <div className="bg-white p-8 lg:p-12 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100">
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                        {error && (
                            <div className="md:col-span-2 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Personal Details</h3>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 pl-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                                    placeholder="Ram Kumar"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 pl-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                                    placeholder="ram@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 pl-2">Create Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Family & Language</h3>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 pl-2">Preferred Language</label>
                                <select
                                    name="language"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                                    value={formData.language}
                                    onChange={handleChange}
                                >
                                    <option value="en">English</option>
                                    <option value="hi">Hindi (हिंदी)</option>
                                    <option value="mr">Marathi (मराठी)</option>
                                    <option value="ta">Tamil (தமிழ்)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 pl-2">Yearly Family Income</label>
                                <select
                                    name="incomeBracket"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                                    value={formData.incomeBracket}
                                    onChange={handleChange}
                                >
                                    <option value="< 2L">Less than 2 Lakh</option>
                                    <option value="2L-5L">2 Lakh - 5 Lakh</option>
                                    <option value="> 5L">More than 5 Lakh</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 pl-2">Number of Dependents</label>
                                <input
                                    type="number"
                                    name="dependents"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                                    value={formData.dependents}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="md:col-span-2 py-4 mt-4 bg-primary text-white font-extrabold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? 'Creating Profile...' : 'Sign Up for Free'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-500 font-medium">
                        Already have an account? {' '}
                        <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
