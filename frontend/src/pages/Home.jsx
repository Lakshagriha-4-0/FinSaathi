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
            <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-primary via-primary-light to-primary-dark p-8 lg:p-16 text-white shadow-2xl shadow-primary/30 group">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-accent rounded-full opacity-20 blur-[80px] group-hover:scale-110 transition-transform duration-1000 ease-out"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[400px] h-[400px] bg-teal-400 rounded-full opacity-20 blur-[80px] group-hover:scale-110 transition-transform duration-1000 ease-out delay-150"></div>

                <div className="relative z-10 max-w-3xl space-y-8">
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-widest leading-none border border-white/20 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        {user ? `Welcome back, ${user.name}` : 'Trusted by communities'}
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-display font-extrabold leading-[1.1] tracking-tight">
                        Build Your Future <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-white/90">With Trust & Knowledge</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-white/80 leading-relaxed font-medium max-w-2xl">
                        Learn money skills, track your growth, and protect your family from frauds. {user ? 'Your data is securely stored in your personal vault.' : 'Join now to secure your family\'s financial future.'}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        {user ? (
                            <Link to="/dashboard" className="px-8 py-4 bg-white text-primary font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group">
                                Go to Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup" className="px-8 py-4 bg-white text-primary font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                    Join FinSaathi
                                </Link>
                                <Link to="/login" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
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
                    { icon: BookOpen, title: 'Learn Simply', desc: 'Audio-visual guides on banking & loans.', color: 'text-primary', bg: 'bg-primary/10', hoverBg: 'group-hover:bg-primary', hoverText: 'group-hover:text-white', link: '/learn' },
                    { icon: ShieldCheck, title: 'Stay Safe', desc: 'Real-time alerts on scam and cyber frauds.', color: 'text-accent', bg: 'bg-accent/10', hoverBg: 'group-hover:bg-accent', hoverText: 'group-hover:text-white', link: '/alerts' },
                    { icon: TrendingUp, title: 'Grow Wealth', desc: 'Wise investment tips for rural families.', color: 'text-secondary', bg: 'bg-secondary/10', hoverBg: 'group-hover:bg-secondary', hoverText: 'group-hover:text-white', link: '/dashboard' },
                    { icon: Users, title: 'Community', desc: 'Support and schemes for your family.', color: 'text-primary-dark', bg: 'bg-primary-dark/10', hoverBg: 'group-hover:bg-primary-dark', hoverText: 'group-hover:text-white', link: '/schemes' },
                ].map((feature, i) => (
                    <Link key={i} to={feature.link} className="group p-8 bg-white rounded-[32px] border border-gray-100 hover:border-transparent hover:shadow-2xl hover:shadow-gray-200 hover:-translate-y-2 transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        <div className={`p-4 rounded-2xl ${feature.bg} flex items-center justify-center w-fit ${feature.hoverBg} transition-colors duration-300 relative z-10`}>
                            <feature.icon className={`${feature.color} ${feature.hoverText} transition-colors duration-300`} size={28} />
                        </div>
                        <h3 className="mt-6 text-2xl font-display font-black text-gray-900 tracking-tight relative z-10">{feature.title}</h3>
                        <p className="mt-3 text-sm text-gray-500 font-medium leading-relaxed relative z-10">{feature.desc}</p>
                    </Link>
                ))}
            </section>

            {/* Interactive CTA */}
            <section className="bg-gradient-to-r from-secondary to-secondary-light rounded-[40px] p-10 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 text-white shadow-2xl shadow-secondary/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10 max-w-xl">
                    <h2 className="text-3xl lg:text-4xl font-display font-black tracking-tight leading-tight">Unsure where to start?</h2>
                    <p className="mt-3 text-lg text-white/80 font-medium leading-relaxed">Let our AI guide you with a personalized learning roadmap based on your profile.</p>
                </div>
                <Link to="/learn" className="w-full lg:w-auto relative z-10 px-10 py-5 bg-white text-secondary font-extrabold rounded-2xl shadow-xl hover:shadow-2xl hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 text-center flex items-center justify-center gap-3 group/btn">
                    Get My Roadmap <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </section>
        </div>
    );
};

export default Home;
