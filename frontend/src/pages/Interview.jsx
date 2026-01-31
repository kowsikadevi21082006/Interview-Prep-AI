import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { Send, Bot, Clock, User, StopCircle, Info } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const Timer = () => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (sec) => {
        const mins = Math.floor(sec / 60);
        const s = sec % 60;
        return `${mins}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <Clock size={16} className="text-[var(--accent-color)]" />
            <span className="font-mono text-sm font-bold">
                {formatTime(seconds)}
            </span>
        </div>
    );
};

const Interview = () => {
    const { interviewId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [ending, setEnding] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
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
            alert('Failed to get response.');
        } finally {
            setLoading(false);
        }
    };

    const handleEndConfirm = async () => {
        setEnding(true);
        try {
            await interviewAPI.end(interviewId);
            navigate(`/evaluation/${interviewId}`);
        } catch (err) {
            console.error(err);
            alert('Error ending session.');
        } finally {
            setEnding(false);
            setIsConfirmOpen(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            {/* Session Header */}
            <header className="px-6 py-4 flex justify-between items-center border-b border-[var(--border-color)] bg-[var(--bg-primary)] z-10">
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <Bot size={22} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">Active Session</h2>
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <p className="text-sm font-bold">Interviewing...</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Timer />
                    <button
                        onClick={() => setIsConfirmOpen(true)}
                        className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 border border-red-500/20 rounded-full transition-all uppercase tracking-tighter"
                    >
                        <StopCircle size={14} />
                        End Session
                    </button>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[var(--bg-secondary)]/30 custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-8 pb-12">
                    {/* Welcome Message */}
                    <div className="flex justify-center mb-8 animate-fade-in">
                        <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                            <Info size={14} className="text-[var(--accent-color)]" />
                            <span className="text-[10px] sm:text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">Interview conversation started</span>
                        </div>
                    </div>

                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                        >
                            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center border ${msg.role === 'user'
                                        ? 'bg-[var(--accent-color)] border-[var(--accent-color)]/20 text-white'
                                        : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--accent-color)]'
                                    }`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`relative px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-[var(--accent-color)] text-white rounded-tr-none'
                                    : 'bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center border bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--accent-color)]">
                                    <Bot size={16} className="animate-pulse" />
                                </div>
                                <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-5 py-3.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </main>

            {/* Input Footer */}
            <footer className="p-4 md:p-6 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSend} className="relative group">
                        <textarea
                            rows="1"
                            placeholder="Type your response here..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e);
                                }
                            }}
                            className="input-field pr-16 py-4 min-h-[56px] max-h-[150px] resize-none overflow-hidden"
                            disabled={loading}
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={loading || !answer.trim()}
                            className="absolute right-3 bottom-2.5 h-10 w-10 bg-[var(--accent-color)] hover:scale-105 active:scale-95 text-white rounded-xl transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 flex items-center justify-center shadow-lg shadow-[var(--accent-color)]/20"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="mt-2 text-[10px] text-center text-[var(--text-secondary)] font-medium uppercase tracking-[0.2em]">Press Enter to send response</p>
                </div>
            </footer>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleEndConfirm}
                title="End Interview Session"
                message="Are you sure you want to conclude the interview? You will receive a detailed performance report immediately after."
                confirmText="Yes, End Session"
                loading={ending}
            />
        </div>
    );
};

export default Interview;
