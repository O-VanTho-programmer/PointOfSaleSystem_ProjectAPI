import React from 'react';

interface LoadingStateProps {
    message?: string;
    className?: string;
}

export default function LoadingState({ message = "Loading...", className = "" }: LoadingStateProps) {
    return (
        <div className={`col-span-full flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white ${className}`}>
            <span className="text-lg font-medium text-slate-400 animate-pulse">
                {message}
            </span>
        </div>
    );
}
