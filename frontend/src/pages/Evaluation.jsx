import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { Trophy, Target, Zap, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, BarChart3, Loader2 } from 'lucide-react';

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
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest animate-pulse">Analyzing Session...</p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-6 p-4 text-center">
                <AlertCircle className="w-16 h-16 text-rose-500" />
                <div>
                    <h2 className="text-2xl font-black text-white mb-2">Report Not Found</h2>
                    <p className="text-slate-400 max-w-sm">We couldn't retrieve your evaluation. Make sure the interview has been completed correctly.</p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    const data = report;

    const ScoreCard = ({ icon: Icon, label, score, color, bgColor }) => (
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md space-y-4 group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl ${bgColor} border border-white/5`}>
                    <Icon className={`w-7 h-7 ${color}`} />
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-black text-white">{score}<span className="text-slate-500 text-lg">/10</span></span>
                </div>
            </div>
            <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{label}</p>
                <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden shadow-inner">
                    <div
                        className={`h-full ${bgColor.replace('/10', '')} rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(255,255,255,0.1)]`}
                        style={{ width: `${score * 10}%` }}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-4 md:p-12">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center space-x-2 text-slate-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Dashboard</span>
                        </button>
                        <div className="space-y-1">
                            <h1 className="text-5xl font-black text-white tracking-tight">Report.</h1>
                            <p className="text-slate-400 text-lg">Your performance analysis is ready.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all flex items-center space-x-3 shadow-xl shadow-blue-500/25 active:scale-95"
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>Retry Simulation</span>
                        </button>
                    </div>
                </div>

                {/* Scores Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ScoreCard icon={Zap} label="Technical Depth" score={data.technicalDepth} color="text-amber-400" bgColor="bg-amber-500/10" />
                    <ScoreCard icon={Target} label="Clarity" score={data.clarity} color="text-sky-400" bgColor="bg-sky-500/10" />
                    <ScoreCard icon={Trophy} label="Confidence" score={data.confidence} color="text-emerald-400" bgColor="bg-emerald-500/10" />
                </div>

                {/* Detailed Feedback */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Strengths */}
                    <div className="p-8 md:p-10 rounded-[2.5rem] bg-slate-900/40 border border-slate-800 backdrop-blur-xl space-y-8">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Key Strengths</h2>
                        </div>
                        <ul className="space-y-5">
                            {data.strengths.map((s, i) => (
                                <li key={i} className="flex items-start space-x-4 text-slate-300 group">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover:scale-125 transition-transform" />
                                    <span className="text-lg leading-snug">{s}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="p-8 md:p-10 rounded-[2.5rem] bg-slate-900/40 border border-slate-800 backdrop-blur-xl space-y-8">
                        <div className="flex items-center space-x-4 text-rose-400">
                            <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400 border border-rose-500/20">
                                <AlertCircle className="w-7 h-7" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Improvement</h2>
                        </div>
                        <ul className="space-y-5">
                            {data.weaknesses.map((w, i) => (
                                <li key={i} className="flex items-start space-x-4 text-slate-300 group">
                                    <div className="w-2 h-2 bg-rose-500 rounded-full mt-2.5 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.5)] group-hover:scale-125 transition-transform" />
                                    <span className="text-lg leading-snug">{w}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Roadmap */}
                <div className="p-10 rounded-[3rem] bg-blue-600/5 border border-blue-500/10 backdrop-blur-xl space-y-10 border-dashed">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
                            <BarChart3 className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight">Growth Roadmap</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Suggested Learning Path</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data.suggestedImprovements.map((imp, i) => (
                            <div key={i} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/50 text-slate-300 text-lg font-medium leading-relaxed hover:bg-slate-900 transition-colors shadow-xl">
                                {imp}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Call */}
                <div className="text-center pt-8">
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.3em]">
                        Export PDF • Share Results • Career Coaching
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Evaluation;
