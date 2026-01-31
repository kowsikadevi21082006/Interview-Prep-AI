import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { Brain, Sparkles, Target, Zap } from 'lucide-react';

const Home = () => {
    const [role, setRole] = useState('');
    const [level, setLevel] = useState('Junior');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleStart = async (e) => {
        e.preventDefault();
        if (!role) return;

        setLoading(true);
        try {
            const res = await interviewAPI.start(role, level);
            navigate(`/interview/${res.data.interviewId}`, {
                state: { initialQuestion: res.data.question }
            });
        } catch (err) {
            console.error(err);
            alert('Failed to start interview. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: <Sparkles className="text-amber-500" />, title: "AI-Powered", desc: "Intelligent follow-ups tailored to your responses." },
        { icon: <Target className="text-emerald-500" />, title: "Role-Specific", desc: "Questions mapped to industry-standard benchmarks." },
        { icon: <Zap className="text-blue-500" />, title: "Instant Feedback", desc: "Detailed performance reports and scoring." }
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl w-full">
                {/* Left Side: Hero Text */}
                <div className="space-y-8 text-center lg:text-left animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-sm font-semibold mb-2">
                        <Brain size={16} />
                        Next-Gen Interview Prep
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
                        Ace Your Next <br />
                        <span className="text-[var(--accent-color)] italic">Dream Job</span> Interview
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0">
                        Practice with our advanced AI interviewer that adapts to your skill level and provides deep technical insights to help you grow.
                    </p>

                    <div className="grid sm:grid-cols-3 gap-6 pt-4">
                        {features.map((f, i) => (
                            <div key={i} className="flex flex-col items-center lg:items-start space-y-2">
                                <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                                    {f.icon}
                                </div>
                                <h3 className="font-bold text-sm">{f.title}</h3>
                                <p className="text-xs text-[var(--text-secondary)]">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="w-full max-w-md p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-xl shadow-black/5">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold">Get Started</h2>
                            <p className="text-[var(--text-secondary)] text-sm">Configure your practice session.</p>
                        </div>

                        <form onSubmit={handleStart} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
                                    Target Job Role
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Full Stack Developer"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
                                    Your Experience Level
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Intern', 'Junior', 'Mid', 'Senior', 'Lead'].map((l) => (
                                        <button
                                            key={l}
                                            type="button"
                                            onClick={() => setLevel(l)}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${level === l
                                                    ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white'
                                                    : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]'
                                                }`}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !role}
                                className="btn-primary w-full py-4 text-base"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Preparing...
                                    </span>
                                ) : (
                                    'Begin Interview Session'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <p className="mt-12 text-sm text-[var(--text-secondary)] flex items-center gap-2">
                <Target size={14} /> Trusted by 10,000+ candidates preparing for top tech companies
            </p>
        </div>
    );
};

export default Home;
