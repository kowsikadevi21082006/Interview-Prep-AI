import React from 'react';

const GradientButton = ({ children, onClick, type = "button", disabled = false, loading = false, className = "" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`relative group px-8 py-4 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-purple/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${className}`}
        >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-center gap-2">
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : children}
            </div>
        </button>
    );
};

export default GradientButton;
