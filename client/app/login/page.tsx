"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, Fingerprint, KeyRound, Loader2, ArrowRight } from 'lucide-react';
import { useAuthLogin } from '@/hooks/authHooks';
import { useAuthStore } from '@/store/authStore';
import { ROLE_REDIRECT_MAP, UserRole } from '@/models/User';

export default function LoginPage() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    const { mutateLogin, isLoading, error: apiError } = useAuthLogin();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');

        if (phone.length < 8) {
            setValidationError('Phone number must be at least 8 digits.');
            return;
        }

        if (password.length < 4) {
            setValidationError('Access code must be at least 4 characters.');
            return;
        }

        try {
            const data = await mutateLogin({ phone, password });

            if (data) {
                const role = useAuthStore.getState().user?.role;
                const destination = ROLE_REDIRECT_MAP[role as UserRole] || '/register';
                router.push(destination);
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="flex min-h-screen w-full font-mono bg-[#0A0A0A] text-zinc-100 selection:bg-emerald-500 selection:text-black">

            {/* Split Layout: Left side graphic, Right side form */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between border-r border-zinc-800 p-12 bg-[url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center relative">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

                <div className="relative z-10">
                    <div className="flex h-16 w-16 items-center justify-center border-2 border-white bg-black/50 backdrop-blur-md">
                        <Coffee strokeWidth={1.5} className="h-8 w-8 text-white" />
                    </div>
                </div>

                <div className="relative z-10 max-w-xl">
                    <h1 className="text-6xl font-black uppercase tracking-tighter text-white leading-[0.9]">
                        System <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Terminal</span>
                    </h1>
                    <p className="mt-6 text-zinc-400 font-sans text-lg font-medium max-w-sm">
                        Authorised personnel only. Enter your credentials to access the point of sale interface.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    <span>SYS_VER_2.4.1</span>
                    <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span>SECURE CONTEXT</span>
                </div>
            </div>

            {/* Right side Form Area */}
            <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-hidden">

                {/* Mobile Header (Hidden on Desktop) */}
                <div className="mb-12 w-full max-w-md lg:hidden text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-white bg-zinc-900 mb-6">
                        <Coffee strokeWidth={1.5} className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                        Access <span className="text-emerald-500">Terminal</span>
                    </h1>
                </div>

                <div className="w-full max-w-md space-y-10 relative z-10">
                    <div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-2">Authentication required</h2>
                        <div className="h-px w-16 bg-emerald-500" />
                    </div>

                    <form
                        onSubmit={onSubmit}
                        className="space-y-8"
                    >
                        {(validationError || apiError) ? (
                            <div className="border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-400">
                                [AUTH_ERROR] {validationError || apiError}
                            </div>
                        ) : null}

                        <div className="space-y-6">
                            <div className="group relative">
                                <label htmlFor="phone" className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
                                    Identification Number
                                </label>
                                <div className="relative flex items-center border-b-2 border-zinc-800 bg-zinc-900/50 focus-within:border-emerald-500 focus-within:bg-zinc-900 transition-all">
                                    <div className="pl-4 pr-3 text-zinc-500 group-focus-within:text-emerald-500">
                                        <Fingerprint className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="tel"
                                        id="phone"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-transparent py-4 pr-4 pl-0 text-white placeholder:text-zinc-700 focus:outline-none font-medium sm:text-lg"
                                        placeholder="Enter Phone Number"
                                    />
                                </div>
                            </div>

                            <div className="group relative">
                                <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
                                    Access Code
                                </label>
                                <div className="relative flex items-center border-b-2 border-zinc-800 bg-zinc-900/50 focus-within:border-emerald-500 focus-within:bg-zinc-900 transition-all">
                                    <div className="pl-4 pr-3 text-zinc-500 group-focus-within:text-emerald-500">
                                        <KeyRound className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-transparent py-4 pr-4 pl-0 text-white placeholder:text-zinc-700 focus:outline-none font-medium font-sans tracking-widest sm:text-lg"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !phone || !password}
                            className="group relative flex w-full items-center justify-between border-2 border-emerald-500 bg-transparent px-6 py-4 font-bold text-emerald-500 transition-all hover:bg-emerald-500 hover:text-black active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 touch-manipulation uppercase tracking-widest"
                        >
                            <span className="relative z-10">
                                {isLoading ? 'Authenticating...' : 'Initialize Session'}
                            </span>

                            <div className="relative z-10 flex h-8 w-8 items-center justify-center bg-emerald-500/20 text-emerald-500 group-hover:bg-black group-hover:text-emerald-500 transition-colors">
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="h-4 w-4" />
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="pt-8 text-center text-xs text-zinc-600 uppercase tracking-widest">
                        Property of the Corporation
                    </div>
                </div>
            </div>
        </div>
    );
}
