import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserPlus, Mail, KeyRound, Loader2, Phone, User as UserIcon, Check, X } from 'lucide-react';
import { UserRole } from '@/types/User';
import { useAuthSignup } from '@/hooks/authHooks';
import { useQueryClient } from '@tanstack/react-query';
import { userKeys } from '@/hooks/useUsers';

const AVAILABLE_ROLES: UserRole[] = ['Manager', 'Cashier', 'Chef', 'Waiter'];

interface AddStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddStaffModal({ isOpen, onClose }: AddStaffModalProps) {
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<UserRole>('Cashier');
    const [validationError, setValidationError] = useState('');
    const [localSuccess, setLocalSuccess] = useState(false);
    
    const queryClient = useQueryClient();
    const { mutateSignup, isLoading, error: apiError } = useAuthSignup();

    useEffect(() => {
        if (!isOpen) {
            setPhone('');
            setName('');
            setEmail('');
            setPassword('');
            setSelectedRole('Cashier');
            setValidationError('');
            setLocalSuccess(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');

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

        try {
            await mutateSignup(phone, name, email, password, selectedRole);
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            setLocalSuccess(true);
        } catch (err) {

        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => !isLoading && onClose()}
            />

            <div className="relative w-full max-w-3xl border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh]">
                
                <button 
                    onClick={onClose}
                    className="absolute cursor-pointer top-4 right-4 p-2 bg-white border-2 border-black hover:bg-zinc-100 z-20 group transition-colors"
                    disabled={isLoading}
                >
                    <X className="h-5 w-5 text-black group-hover:scale-110 transition-transform" />
                </button>

                {localSuccess ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center bg-zinc-50 relative overflow-y-auto">
                        <div className="absolute top-0 left-0 p-4 opacity-10">
                            <ShieldCheck className="h-32 w-32 text-slate-900" />
                        </div>
                        
                        <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center border-2 border-black bg-emerald-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <Check strokeWidth={3} className="h-8 w-8" />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-black mb-2">Provisioning<br/>Complete</h2>
                            <div className="h-1 w-16 bg-black mb-8" />

                            <div className="space-y-4 mb-10 w-full text-sm font-mono text-left bg-white border-2 border-black p-4">
                                <div className="flex justify-between border-b border-zinc-200 pb-2">
                                    <span className="text-zinc-500">Access Level</span>
                                    <span className="text-black font-bold uppercase">{selectedRole}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-200 pb-2">
                                    <span className="text-zinc-500">Entity</span>
                                    <span className="text-black uppercase font-bold">{name}</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="text-zinc-500">ID (Phone)</span>
                                    <span className="text-black font-bold">{phone}</span>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="cursor-pointer bg-black text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-zinc-800 transition-colors w-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                            >
                                Acknowledge & Close
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 overflow-y-auto">
                        {/* Header Block */}
                        <div className="border-b-2 border-black bg-zinc-100 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                            <div className="pr-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex h-8 w-8 items-center justify-center border-2 border-black bg-white">
                                        <UserPlus className="h-4 w-4" />
                                    </div>
                                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-500">Registry Module</span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-black leading-none">
                                    Provision <br />Account
                                </h1>
                            </div>
                            <p className="text-xs font-medium text-zinc-600 max-w-[200px] sm:text-right border-l-2 border-black sm:border-l-0 sm:border-r-2 pl-3 sm:pl-0 sm:pr-3">
                                Create secure access credentials and assign system roles.
                            </p>
                        </div>

                        <form onSubmit={onSubmit} className="p-6 sm:p-8 flex-1 overflow-y-auto">
                            {(validationError || apiError) ? (
                                <div className="mb-6 border-2 border-red-500 bg-red-50 p-3 text-sm font-bold text-red-600 font-mono uppercase">
                                    [ERROR] {validationError || apiError}
                                </div>
                            ) : null}

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Left Column: Role & Identifiers */}
                                <div className="space-y-6">
                                    <div className="space-y-3">
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
                                                        py-2.5 font-mono text-sm font-bold uppercase tracking-wider transition-all border-2
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

                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 bg-black" />
                                            Primary Identifiers
                                        </label>

                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                                                <UserIcon className="h-4 w-4 opacity-40 group-focus-within:opacity-100" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="block w-full border-b-2 border-black bg-transparent py-3 pl-10 pr-3 text-black placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 font-medium transition-colors text-sm"
                                                placeholder="Legal Full Name"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 bg-black" />
                                            Contact & Security
                                        </label>

                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                                                <Phone className="h-4 w-4 opacity-40 group-focus-within:opacity-100" />
                                            </div>
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="block w-full border-b-2 border-black bg-transparent py-3 pl-10 pr-3 text-black placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 font-medium transition-colors font-mono text-sm"
                                                placeholder="Phone Number (ID)"
                                            />
                                        </div>

                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                                                <Mail className="h-4 w-4 opacity-40 group-focus-within:opacity-100" />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="block w-full border-b-2 border-black bg-transparent py-3 pl-10 pr-3 text-black placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 font-medium transition-colors text-sm"
                                                placeholder="Email Address"
                                            />
                                        </div>

                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                                                <KeyRound className="h-4 w-4 opacity-40 group-focus-within:opacity-100" />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="block w-full border-b-2 border-black bg-transparent py-3 pl-10 pr-3 text-black placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-50 font-medium transition-colors font-mono tracking-widest text-sm"
                                                placeholder="Assign PIN/Password"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-[10px] font-mono font-bold uppercase text-zinc-500 max-w-[200px]">
                                    By proceeding, you confirm clearance for POS terminal operations.
                                </p>

                                <button
                                    type="submit"
                                    disabled={isLoading || !phone || !name || !email || !password}
                                    className="group relative cursor-pointer w-full sm:w-auto overflow-hidden bg-black px-8 py-4 font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 touch-manipulation uppercase tracking-widest font-mono text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <ShieldCheck className="h-4 w-4" />
                                                Execute Provision
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
