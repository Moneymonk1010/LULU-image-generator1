import React, { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  className = ''
}) => {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };

  return (
    <div className={`relative group flex items-center justify-center ${className}`}>
      {children}
      <div 
        className={`absolute ${positionClasses[position]} px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.5)] whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 ease-out`}
      >
        {content}
      </div>
    </div>
  );
};