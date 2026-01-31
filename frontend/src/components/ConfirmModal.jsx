import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--border-color)]">
                    <h3 className="font-bold flex items-center gap-2">
                        <AlertCircle className="text-amber-500" size={18} />
                        {title}
                    </h3>
                    <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex gap-3 p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-sm font-bold border border-[var(--border-color)] rounded-xl hover:bg-[var(--bg-primary)] transition-colors"
                        disabled={loading}
                    >
                        {cancelText || 'Cancel'}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 text-sm font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (confirmText || 'Confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
