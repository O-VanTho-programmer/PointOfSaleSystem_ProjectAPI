import React from 'react';
import { Banknote, QrCode, X } from 'lucide-react';

interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectCash: () => void;
    onSelectBank: () => void;
}

export function PaymentMethodModal({ isOpen, onClose, onSelectCash, onSelectBank }: PaymentMethodModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
                    <h3 className="text-xl font-bold text-slate-900">Select Payment Method</h3>
                    <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    <button 
                        onClick={onSelectCash}
                        className="flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-5 transition-all hover:border-emerald-500 hover:bg-emerald-50 active:bg-emerald-100 group"
                    >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
                            <Banknote className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-lg font-bold text-slate-900">Pay by Cash</span>
                            <span className="text-sm tracking-tight text-slate-500 font-medium">Customer pays via physical cash.</span>
                        </div>
                    </button>

                    <button 
                        onClick={onSelectBank}
                        className="flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-5 transition-all hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 group"
                    >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
                            <QrCode className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-lg font-bold text-slate-900">Pay by Bank</span>
                            <span className="text-sm tracking-tight text-slate-500 font-medium">Generate a VietQR code to scan.</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
