import React from 'react';
import { Banknote, QrCode, X } from 'lucide-react';

interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectCash: () => void;
    onSelectBank: () => void;
    isCashLoading?: boolean;
    isBankLoading?: boolean;
}

export function PaymentMethodModal({ isOpen, onClose, onSelectCash, onSelectBank, isCashLoading, isBankLoading }: PaymentMethodModalProps) {
    if (!isOpen) return null;

    const anyLoading = isCashLoading || isBankLoading;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={anyLoading ? undefined : onClose} />
            
            <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
                    <h3 className="text-xl font-bold text-slate-900">Select Payment Method</h3>
                    <button 
                        onClick={onClose} 
                        disabled={anyLoading}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    <button 
                        onClick={onSelectCash}
                        disabled={anyLoading}
                        className="flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-5 transition-all hover:border-emerald-500 hover:bg-emerald-50 active:bg-emerald-100 group disabled:opacity-60 disabled:pointer-events-none"
                    >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
                            {isCashLoading ? (
                                <svg className="h-6 w-6 animate-spin text-emerald-600" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <Banknote className="h-6 w-6" />
                            )}
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-lg font-bold text-slate-900">Pay by Cash</span>
                            <span className="text-sm tracking-tight text-slate-500 font-medium">
                                {isCashLoading ? 'Processing transaction...' : 'Customer pays via physical cash.'}
                            </span>
                        </div>
                    </button>

                    <button 
                        onClick={onSelectBank}
                        disabled={anyLoading}
                        className="flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-5 transition-all hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 group disabled:opacity-60 disabled:pointer-events-none"
                    >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
                            {isBankLoading ? (
                                <svg className="h-6 w-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <QrCode className="h-6 w-6" />
                            )}
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-lg font-bold text-slate-900">Pay by Bank</span>
                            <span className="text-sm tracking-tight text-slate-500 font-medium">
                                {isBankLoading ? 'Generating QR Code...' : 'Generate a VietQR code to scan.'}
                            </span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
