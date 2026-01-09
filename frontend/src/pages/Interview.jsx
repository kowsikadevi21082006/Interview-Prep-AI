import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { Send, User, Bot, Loader2, StopCircle, ChevronLeft } from 'lucide-react';

const Interview = () => {
    const { interviewId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [ending, setEnding] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (location.state?.initialQuestion) {
            setMessages([{ role: 'ai', content: location.state.initialQuestion }]);
        }
    }, [location.state]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!answer.trim() || loading) return;

        const userMsg = answer;
        setAnswer('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const res = await interviewAPI.answer(interviewId, userMsg);
            setMessages(prev => [...prev, { role: 'ai', content: res.data.question }]);
        } catch (err) {
            console.error(err);
            alert('Failed to get next question.');
        } finally {
            setLoading(false);
        }
    };

    const handleEnd = async () => {
        if (window.confirm('Are you sure you want to end the interview and see your results?')) {
            setEnding(true);
            try {
                await interviewAPI.end(interviewId);
                navigate(`/evaluation/${interviewId}`);
            } catch (err) {
                console.error(err);
                alert('Failed to end interview.');
            } finally {
                setEnding(false);
            }
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-slate-100">
            {/* Header */}
            <header className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/40 backdrop-blur-xl flex justify-between items-center sticky top-0 z-20">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white md:hidden"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-lg leading-tight">AI Interviewer</h2>
                            <div className="flex items-center space-x-1.5">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Active Session</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleEnd}
                    disabled={ending}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/20 group"
                >
                    {ending ? <Loader2 className="w-4 h-4 animate-spin" /> : <StopCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    <span className="text-sm font-bold uppercase tracking-wide">Finish</span>
                </button>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                        >
                            <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                                <div className={`p-2.5 rounded-2xl shrink-0 shadow-lg ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-800 border border-slate-700 text-blue-400'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                </div>
                                <div
                                    className={`px-5 py-4 rounded-3xl text-slate-200 shadow-xl ${msg.role === 'user'
                                            ? 'bg-blue-600 rounded-br-none text-white'
                                            : 'bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-bl-none'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap leading-relaxed md:text-lg">{msg.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-3xl rounded-bl-none px-6 py-4 flex items-center space-x-2 shadow-lg">
                                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} className="h-4" />
                </div>
            </main>

            {/* Input Area */}
            <footer className="p-4 md:p-6 border-t border-slate-800/50 bg-slate-900/60 backdrop-blur-2xl">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSend} className="relative group">
                        <input
                            type="text"
                            placeholder="Provide your detailed answer..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700/50 text-white pl-6 pr-20 py-5 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 text-lg shadow-inner shadow-black/50"
                            disabled={loading || ending}
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={loading || !answer.trim() || ending}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all shadow-lg active:scale-95"
                        >
                            <Send className="w-6 h-6" />
                        </button>
                    </form>
                    <div className="mt-4 flex items-center justify-center space-x-6 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        <span className="flex items-center"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" /> One question at a time</span>
                        <span className="hidden md:flex items-center"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" /> Context-aware AI</span>
                        <span className="flex items-center"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" /> No time limit</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Interview;
