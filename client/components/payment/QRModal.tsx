import React, { useEffect, useState } from 'react';
import { useOrder } from '@/hooks/useOrders';
import { usePosSignalR, UnderPaidPayload } from '@/hooks/usePosSignalR';
import { PaymentStatus } from '@/types/OrderDTO';
import { CheckCircle2, AlertTriangle, Loader2, X } from 'lucide-react';
import { formatVND } from '@/utils/formatCurrency';

interface QRModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    orderId: number;
    qrSvgBase64: string;
}

export function QRModal({ isOpen, onClose, onSuccess, orderId, qrSvgBase64 }: QRModalProps) {
    const { data: orderData } = useOrder(orderId);
    const isPaid = orderData?.payload?.paymentStatus === PaymentStatus.Paid;

    const [underPaid, setUnderPaid] = useState<UnderPaidPayload | null>(null);

    const handleUnderPaid = (payload: UnderPaidPayload) => {
        if (payload.orderId === orderId) {
            setUnderPaid(payload);
        }
    };

    usePosSignalR(handleUnderPaid);

    useEffect(() => {
        if (!isOpen) setUnderPaid(null);
    }, [isOpen]);

    useEffect(() => {
        if (isPaid) {
            const timer = setTimeout(() => {
                onSuccess();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isPaid]);

    if (!isOpen) return null;

    const remaining = underPaid ? underPaid.expectedAmount - underPaid.amountPaid : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isPaid && onClose()} />

            <div className={`relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300 ${isPaid ? 'border-4 border-emerald-500' : underPaid ? 'border-4 border-amber-400' : ''}`}>
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <h3 className="text-lg font-bold text-slate-900">Scan to Pay</h3>
                    {!isPaid && (
                        <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                <div className="p-8 pb-10 flex flex-col items-center justify-center min-h-[300px]">
                    {isPaid ? (
                        <div className="flex flex-col items-center animate-in zoom-in slide-in-from-bottom-4 duration-500">
                            <div className="rounded-full bg-emerald-100 p-4 mb-4">
                                <CheckCircle2 className="h-16 w-16 text-emerald-600 animate-pulse" />
                            </div>
                            <h4 className="text-2xl font-bold text-emerald-600">Payment Received!</h4>
                            <p className="mt-2 text-sm text-slate-500 font-medium">Auto-completing order...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center w-full gap-4">
                            {/* Under-payment warning banner */}
                            {underPaid && (
                                <div className="w-full rounded-xl bg-amber-50 border border-amber-300 p-4 flex gap-3 items-start animate-in slide-in-from-top-2 duration-300">
                                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                                    <div className="text-sm">
                                        <p className="font-bold text-amber-800">Partial Payment Received</p>
                                        <p className="text-amber-700 mt-0.5">
                                            Still need: <span className="font-mono font-bold">{formatVND(remaining)}</span>
                                        </p>
                                        <p className="text-amber-600 text-xs mt-1">
                                            Please scan the QR code again to pay the remaining amount.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <p className="text-sm font-medium text-slate-500 text-center">
                                {underPaid ? 'Awaiting remaining payment...' : 'Awaiting payment via SePay webhook...'}
                            </p>
                            <div className="w-full h-auto bg-white rounded-xl shadow-inner border max-w-[240px] aspect-square flex items-center justify-center p-2">
                                <img
                                    src={qrSvgBase64}
                                    alt="Payment QR Code"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>{underPaid ? 'Waiting for remaining payment...' : 'Waiting for payment...'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


