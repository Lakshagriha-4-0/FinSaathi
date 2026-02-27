import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);

    return (
        <div className="space-y-12 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-[40px] bg-primary p-8 lg:p-16 text-white shadow-2xl shadow-primary/20">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary-light rounded-full opacity-20 blur-3xl"></div>
                <div className="relative z-10 max-w-2xl space-y-6">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest leading-none">
                        {user ? `Welcome back, ${user.name}` : 'Trusted by communities'}
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-display font-extrabold leading-[1.1]">
                        Build Your Future <br /> With Trust & Knowledge
                    </h1>
                    <p className="text-lg text-primary-light leading-relaxed font-medium">
                        Learn money skills, track your growth, and protect your family from frauds. {user ? 'Your data is securely stored in your personal vault.' : 'Join now to secure your family\'s financial future.'}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        {user ? (
                            <Link to="/dashboard" className="px-8 py-4 bg-accent text-white font-bold rounded-2xl shadow-lg shadow-accent/30 hover:scale-105 transition-transform flex items-center gap-2">
                                Go to Dashboard <ArrowRight size={18} />
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup" className="px-8 py-4 bg-accent text-white font-bold rounded-2xl shadow-lg shadow-accent/30 hover:scale-105 transition-transform">
                                    Join FinSaathi
                                </Link>
                                <Link to="/login" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: BookOpen, title: 'Learn Simply', desc: 'Audio-visual guides on banking & loans.', color: 'text-primary', link: '/learn' },
                    { icon: ShieldCheck, title: 'Stay Safe', desc: 'Real-time alerts on scam and cyber frauds.', color: 'text-accent', link: '/alerts' },
                    { icon: TrendingUp, title: 'Grow Wealth', desc: 'Wise investment tips for rural families.', color: 'text-secondary', link: '/dashboard' },
                    { icon: Users, title: 'Community', desc: 'Support and schemes for your family.', color: 'text-primary-dark', link: '/schemes' },
                ].map((feature, i) => (
                    <Link key={i} to={feature.link} className="group p-8 bg-white rounded-[32px] border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all outline-none focus:ring-2 focus:ring-primary/20">
                        <div className={`p-4 rounded-2xl bg-gray-50 flex items-center justify-center w-fit group-hover:bg-primary/10 transition-colors`}>
                            <feature.icon className={feature.color} size={28} />
                        </div>
                        <h3 className="mt-6 text-xl font-bold text-gray-900">{feature.title}</h3>
                        <p className="mt-2 text-gray-500 font-medium leading-normal">{feature.desc}</p>
                    </Link>
                ))}
            </section>

            {/* Interactive CTA */}
            <section className="bg-secondary rounded-[40px] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 text-white">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold">Unsure where to start?</h2>
                    <p className="mt-2 text-secondary-light font-medium">Let our AI guide you with a personalized learning roadmap.</p>
                </div>
                <Link to="/learn" className="w-full lg:w-auto px-10 py-5 bg-white text-secondary font-extrabold rounded-2xl shadow-xl hover:shadow-secondary/20 transition-all text-center">
                    Get My Roadmap
                </Link>
            </section>
        </div>
    );
};

export default Home;
