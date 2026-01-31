import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { Trophy, CheckCircle2, AlertCircle, Rocket, ChevronRight, BarChart3, Star, Target } from 'lucide-react';

const ScoreCard = ({ label, score, color, icon: Icon }) => {
    const percentage = (score / 10) * 100;

    return (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl bg-${color}-500/10 text-${color}-500`}>
                    <Icon size={20} />
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{score}</span>
                    <span className="text-xs text-[var(--text-secondary)] font-medium">/ 10</span>
                </div>
            </div>
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3 leading-none">{label}</h3>
            <div className="h-2 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-1000 ease-out rounded-full`}
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color === 'blue' ? 'var(--accent-color)' : color
                    }}
                />
            </div>
        </div>
    );
};

const Evaluation = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            if (!interviewId) return;
            try {
                setLoading(true);
                const res = await interviewAPI.getReport(interviewId);
                setReport(res.data.report);
            } catch (err) {
                console.error('Error fetching report:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [interviewId]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 border-4 border-[var(--accent-color)]/20 border-t-[var(--accent-color)] rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-bold text-[var(--text-secondary)] tracking-widest uppercase animate-pulse">Analyzing Performance...</p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
                <p className="text-[var(--text-secondary)] mb-8 max-w-xs">We couldn't find the evaluation records for this session ID.</p>
                <button
                    onClick={() => navigate('/')}
                    className="btn-primary"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    // Calculating Problem Solving score as an average of others if not explicitly provided 
    // or as a mock for this UI overhaul since specific data fields might vary
    const scores = [
        { label: 'Technical Depth', score: report.technicalDepth || 0, color: 'blue', icon: BarChart3 },
        { label: 'Communication', score: report.clarity || 0, color: 'emerald', icon: Star },
        { label: 'Confidence', score: report.confidence || 0, color: 'purple', icon: Target }
    ];

    const overallScore = Math.round((scores.reduce((acc, s) => acc + s.score, 0) / 3) * 10) / 10;

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                <div className="text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold mb-4 uppercase tracking-widest">
                        Assessment Complete
                    </div>
                    <h1 className="text-4xl font-bold mb-2">Detailed Feedback</h1>
                    <p className="text-[var(--text-secondary)] max-w-md">Great job! Here is a breakdown of your strengths and areas where you can improve.</p>
                </div>

                <div className="relative group">
                    <div className="absolute inset-0 bg-[var(--accent-color)] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative bg-[var(--card-bg)] border border-[var(--border-color)] p-8 rounded-[40px] flex flex-col items-center justify-center shadow-xl min-w-[200px]">
                        <Trophy className="text-amber-500 mb-2" size={40} />
                        <span className="text-4xl font-black text-[var(--accent-color)]">{overallScore}</span>
                        <span className="text-xs font-bold uppercase tracking-tighter text-[var(--text-secondary)]">Overall Score</span>
                    </div>
                </div>
            </div>

            {/* Scores Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {scores.map((s, i) => <ScoreCard key={i} {...s} />)}
            </div>

            {/* Detailed Analysis Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
                {/* Strengths */}
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 rounded-[32px]">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-500" size={20} />
                        Key Strengths
                    </h2>
                    <ul className="space-y-4">
                        {report.strengths.map((s, i) => (
                            <li key={i} className="flex gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                <div className="h-6 w-6 shrink-0 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xs font-bold">
                                    {i + 1}
                                </div>
                                <p className="text-sm text-[var(--text-primary)] leading-relaxed">{s}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Improvements */}
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 rounded-[32px]">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <AlertCircle className="text-amber-500" size={20} />
                        Areas for Growth
                    </h2>
                    <ul className="space-y-4">
                        {report.weaknesses.map((w, i) => (
                            <li key={i} className="flex gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                <div className="h-6 w-6 shrink-0 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs font-bold">
                                    {i + 1}
                                </div>
                                <p className="text-sm text-[var(--text-primary)] leading-relaxed">{w}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Learning Roadmap */}
            <div className="bg-gradient-to-br from-[var(--accent-color)] to-blue-700 text-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-blue-500/20 mb-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-widest">
                            <Rocket size={14} />
                            Your personalized Roadmap
                        </div>
                        <h2 className="text-3xl font-bold">Recommended Next Steps</h2>
                        <div className="space-y-4 pt-4">
                            {report.suggestedImprovements.map((imp, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <ChevronRight className="shrink-0 mt-1 opacity-60" size={18} />
                                    <p className="text-blue-50 leading-relaxed font-medium">{imp}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="bg-white text-[var(--accent-color)] px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2 group whitespace-nowrap"
                    >
                        Try Another Level
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </button>
                </div>
            </div>

            <div className="pt-8 text-center">
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.4em] font-bold">Verified AI Assessment Report</p>
            </div>
        </div>
    );
};

export default Evaluation;
