import React from 'react';

const GlassCard = ({ children, className = "" }) => {
    return (
        <div className={`glass rounded-3xl overflow-hidden transition-all duration-300 ${className}`}>
            {children}
        </div>
    );
};

export default GlassCard;
