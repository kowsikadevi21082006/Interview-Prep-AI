import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { Briefcase, Activity, Rocket, ChevronRight } from 'lucide-react';

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-4 md:p-6">
            <div className="w-full max-w-xl bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-8 md:p-12 space-y-8">
                    {/* Header Section */}
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-2">
                            <Rocket className="w-8 h-8 text-blue-400" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">
                            AI Mock Interview
                        </h1>
                        <p className="text-slate-400 text-lg max-w-sm mx-auto">
                            Boost your confidence with realistic, role-specific interview simulation.
                        </p>
                    </div>

                    <form onSubmit={handleStart} className="space-y-8">
                        {/* Input Group: Role */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1 uppercase tracking-wider">
                                Desired Job Role
                            </label>
                            <div className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="e.g. Senior Frontend Engineer"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-white text-lg placeholder:text-slate-600 shadow-inner"
                                    required
                                />
                            </div>
                        </div>

                        {/* Input Group: Level */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1 uppercase tracking-wider">
                                Seniority Level
                            </label>
                            <div className="relative group">
                                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <select
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-white text-lg appearance-none cursor-pointer shadow-inner"
                                >
                                    <option value="Intern">Intern</option>
                                    <option value="Junior">Junior</option>
                                    <option value="Mid-Level">Mid-Level</option>
                                    <option value="Senior">Senior</option>
                                    <option value="Lead/Staff">Lead / Staff</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <ChevronRight className="w-5 h-5 text-slate-500 rotate-90" />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading || !role}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-xl rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center group"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Begin Session</span>
                                        <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer Info */}
                    <p className="text-center text-slate-500 text-sm">
                        Powered by Cerebras AI • Fast & Contextual
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
