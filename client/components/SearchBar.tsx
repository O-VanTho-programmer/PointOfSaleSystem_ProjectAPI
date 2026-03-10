"use client";

import React, { useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search menu...", className = "" }: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div
            className={`
                group relative flex items-center h-12 w-full rounded-xl 
                bg-slate-100 transition-all duration-300 ease-in-out border
                ${isFocused
                    ? 'bg-white border-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.15)] ring-1 ring-emerald-400'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-200/50'}
                ${className}
            `}
        >
            <div className={`
                flex items-center justify-center pl-4 pr-2
                transition-colors duration-300
                ${isFocused ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-500'}
            `}>
                <Search className="w-5 h-5" strokeWidth={isFocused ? 2.5 : 2} />
            </div>

            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-0 peer h-full"
                placeholder={placeholder}
            />

            {/* Clear button */}
            <div className={`
                flex items-center justify-center pr-2
                transition-all duration-200 ease-in-out
                ${value ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-90'}
            `}>
                <button
                    onClick={() => {
                        onChange("");
                        inputRef.current?.focus();
                    }}
                    className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-slate-200 transition-colors focus:outline-none"
                    aria-label="Clear search"
                >
                    <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}
