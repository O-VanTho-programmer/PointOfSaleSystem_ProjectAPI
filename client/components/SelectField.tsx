import React from "react";

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: string | number; label: string }[];
    icon?: React.ElementType;
}

export function SelectField({ label, icon: Icon, options, className = "", ...props }: SelectFieldProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</label>
            <div className="relative flex items-center">
                {Icon && (
                    <div className="absolute left-3 flex items-center justify-center text-slate-400 pointer-events-none">
                        <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                )}
                <select
                    {...props}
                    className={`w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 ${Icon ? 'pl-10' : 'pl-4'} pr-10 text-sm font-semibold text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-400/10 transition-all cursor-pointer ${className}`}
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <div className="absolute right-4 pointer-events-none text-slate-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
