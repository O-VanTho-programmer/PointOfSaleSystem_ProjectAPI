import React from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
}

export function ConfirmModal({ 
    isOpen, onClose, onConfirm, title, description, confirmText = "Confirm", isDestructive = true, isLoading = false 
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isLoading && onClose()} />
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                            <p className="mt-2 text-sm text-slate-500">{description}</p>
                        </div>
                        <button onClick={onClose} disabled={isLoading} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="flex gap-3 bg-slate-50 px-6 py-4">
                    <button type="button" onClick={onClose} disabled={isLoading} className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button type="button" onClick={onConfirm} disabled={isLoading} className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer ${isDestructive ? 'bg-red-600 hover:bg-red-700 focus:ring-red-600' : 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-600'}`}>
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
