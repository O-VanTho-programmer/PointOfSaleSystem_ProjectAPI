"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, UserPlus, Mail, KeyRound, Loader2, ArrowLeft, Phone, User as UserIcon, Check } from 'lucide-react';
import { UserRole } from '@/models/User';
import { useAuthSignup } from '@/hooks/authHooks';

const AVAILABLE_ROLES = ['Manager', 'Cashier', 'Chef'] as const;

// Following @frontend-design bold aesthetic: Clean, editorial, utilitarian precision. 
export default function AdminSignupPage() {
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<UserRole>('Cashier');
    const [validationError, setValidationError] = useState('');
    const [localSuccess, setLocalSuccess] = useState(false);

    // Hook now purely handles API request
    const { mutateSignup, isLoading, error: apiError } = useAuthSignup();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');

        // 1. Input Validation (Before going to hooks)
        if (phone.length < 8) {
            setValidationError('Phone number must be at least 8 digits.');
            return;
        }
        if (password.length < 6) {
            setValidationError('Temporary PIN must be at least 6 characters.');
            return;
        }
        if (!email.includes('@')) {
            setValidationError('Invalid email format.');
            return;
        }

        // 2. Call hook mutation
        try {
            await mutateSignup(phone, name, email, password, selectedRole);
            // 3. Set local UI success state (Hook no longer manages this UI state)
            setLocalSuccess(true);
        } catch (err) {
            // Error handled by hook
        }
    };

    if (localSuccess) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0A0A0A] font-mono text-zinc-100 p-6 selection:bg-blue-500 selection:text-black">
                <div className="border border-zinc-800 bg-zinc-900/50 p-12 max-w-lg w-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShieldCheck className="h-32 w-32 text-blue-500" />
                    </div>

                    <div className="relative z-10 flex flex-col items-start">
                        <div className="mb-8 flex h-16 w-16 items-center justify-center border border-blue-500/30 bg-blue-500/10 text-blue-400">
                            <Check strokeWidth={2} className="h-8 w-8" />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">Provisioning<br />Complete</h2>
                        <div className="h-px w-16 bg-blue-500 mb-8" />

                        <div className="space-y-4 mb-10 w-full text-sm">
                            <div className="flex justify-between border-b border-zinc-800 pb-2">
                                <span className="text-zinc-500">Access Level</span>
                                <span className="text-blue-400 font-bold uppercase">{selectedRole}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-800 pb-2">
                                <span className="text-zinc-500">Entity</span>
                                <span className="text-white uppercase">{name}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-800 pb-2">
                                <span className="text-zinc-500">ID (Phone)</span>
                                <span className="text-zinc-300">{phone}</span>
                            </div>
                        </div>

                        <Link
                            href="/teams"
                            className="bg-zinc-100 text-black px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors w-full text-center"
                        >
                            Return to Directory
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#F4F4F5] font-sans text-zinc-900 selection:bg-black selection:text-white">

            {/* Top Admin Nav */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b-2 border-black bg-white px-6 uppercase tracking-widest font-bold text-xs font-mono">
                <Link href="/teams" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    System Directory
                </Link>
                <div className="flex gap-4 opacity-50">
                    <span>Admin Level 4</span>
                    <span>•</span>
                    <span>Secure Registration</span>
                </div>
            </header>

            <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-3xl border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">

                    {/* Header Block */}
                    <div className="border-b-2 border-black bg-zinc-100 p-8 sm:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white">
                                    <UserPlus className="h-5 w-5" />
                                </div>
                                <span className="font-mono text-sm font-bold uppercase tracking-widest text-zinc-500">Registry Module</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-black leading-none">
                                Provision <br />Account
                            </h1>
                        </div>
                        <p className="text-sm font-medium text-zinc-600 max-w-xs md:text-right border-l-2 border-black md:border-l-0 md:border-r-2 pl-4 md:pl-0 md:pr-4">
                            Create secure access credentials and assign system roles to new staff entities.
                        </p>
                    </div>

                    <form
                        onSubmit={onSubmit}
                        className="p-8 sm:p-10"
                    >
                        {(validationError || apiError) ? (
                            <div className="mb-8 border-2 border-red-500 bg-red-50 p-4 text-sm font-bold text-red-600 font-mono uppercase">
                                [ERROR] {validationError || apiError}
                            </div>
                        ) : null}

                        <div className="grid md:grid-cols-2 gap-10">
                            {/* Left Column: Role & Identifiers */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 bg-black" />
                                        Assign Clearance Level
                                    </label>
                                    <div className="grid grid-cols-1 gap-2 border-2 border-black p-2 bg-zinc-50">
                                        {AVAILABLE_ROLES.map((role) => (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => setSelectedRole(role)}
                                                className={`
                                                    py-3 font-mono text-sm font-bold uppercase tracking-wider transition-all border-2
                                                    ${selectedRole === role
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-transparent text-zinc-500 hover:border-black/20 hover:text-black'
                                                    }
                                                `}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 bg-black" />
                                        Primary Identifiers
                                    </label>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-black">
                                            <UserIcon className="h-5 w-5 opacity-40 group-focus-within:opacity-100" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="block w-full border-b-2 border-black bg-transparent py-4 pl-12 pr-4 text-black placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 font-medium transition-colors"
                                            placeholder="Legal Full Name"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Contact & Security */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <label className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 bg-black" />
                                        Contact & Security
                                    </label>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-black">
                                            <Phone className="h-5 w-5 opacity-40 group-focus-within:opacity-100" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="block w-full border-b-2 border-black bg-transparent py-4 pl-12 pr-4 text-black placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 font-medium transition-colors font-mono"
                                            placeholder="Phone Number (ID)"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-black">
                                            <Mail className="h-5 w-5 opacity-40 group-focus-within:opacity-100" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full border-b-2 border-black bg-transparent py-4 pl-12 pr-4 text-black placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 font-medium transition-colors"
                                            placeholder="Email Address"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-black">
                                            <KeyRound className="h-5 w-5 opacity-40 group-focus-within:opacity-100" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full border-b-2 border-black bg-transparent py-4 pl-12 pr-4 text-black placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 font-medium transition-colors font-mono tracking-widest"
                                            placeholder="Assign PIN/Password"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t-2 border-black flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-xs font-mono font-bold uppercase text-zinc-500 max-w-xs">
                                By proceeding, you confirm this entity is cleared for POS terminal operations.
                            </p>

                            <button
                                type="submit"
                                disabled={isLoading || !phone || !name || !email || !password}
                                className="group relative w-full md:w-auto overflow-hidden bg-black px-12 py-5 font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 touch-manipulation uppercase tracking-widest font-mono text-sm"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            <ShieldCheck className="h-5 w-5" />
                                            Execute Provision
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}
