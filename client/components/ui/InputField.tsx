import React from "react";

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ElementType;
}

export function InputField({ label, icon: Icon, className = "", ...props }: InputFieldProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</label>
            <div className="relative flex items-center">
                {Icon && (
                    <div className="absolute left-3 flex items-center justify-center text-slate-400">
                        <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                )}
                <input
                    {...props}
                    className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-3 ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-sm font-semibold text-slate-800 placeholder:font-medium placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-400/10 transition-all ${className}`}
                />
            </div>
        </div>
    );
}
