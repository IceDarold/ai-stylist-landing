import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => {
  return (
    <div
      className={`
        bg-black/20 backdrop-blur-lg 
        rounded-3xl border border-white/10 
        shadow-lg
        transition-all duration-300 ease-in-out
        hover:bg-black/30 hover:border-white/20 hover:scale-105
        ${className || ''}
      `}
    >
      {children}
    </div>
  );
};

