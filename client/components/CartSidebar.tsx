"use client";

import React, { useMemo, useState } from 'react';
import { usePosStore } from '../store/posStore';
import { OrderStatus, OrderType } from '../types/OrderDTO';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { QRModal } from './payment/QRModal';
import { useGeneratePaymentQr } from '@/hooks/usePayments';
import { formatUSD, formatVND } from '@/utils/formatCurrency';

export function CartSidebar() {
    const { order, updateQuantity, clearOrder } = usePosStore();
    const { user } = useAuthStore();

    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState<number>(0);
    const [qrBase64, setQrBase64] = useState<string>('');

    const subtotal = useMemo(() => {
        return order.orderItems.reduce((sum: number, oi) => sum + oi.priceAtOrder * oi.quantity, 0);
    }, [order.orderItems]);

    const taxRate = 0.10;
    const tax = subtotal * taxRate;
    const grandTotal = subtotal + tax;

    const createOrder = useCreateOrder();
    const generatePaymentQr = useGeneratePaymentQr();

    const handleSubmitOrder = () => {
        createOrder.mutateAsync({
            status: OrderStatus.Active,
            discountId: order.discountId,
            userId: user?.userId || -1,
            orderItems: order.orderItems.map((oi) => ({
                itemId: oi.itemId,
                quantity: oi.quantity,
                priceAtOrder: oi.priceAtOrder,
            })),
            tableNumber: order.tableNumber,
            orderType: order.orderType,
        }, {
            onSuccess: async (data) => {
                const createdOrder = data.payload;
                if (!createdOrder) {
                    toast.error("Failed to retrieve created order from server");
                    return;
                }

                if (order.orderType === OrderType.TakeAway) {
                    // Start QR generation flow
                    try {
                        const qrResponse = await generatePaymentQr.mutateAsync(createdOrder.orderId);
                        if (qrResponse.success && qrResponse.payload) {
                            setCurrentOrderId(createdOrder.orderId);
                            setQrBase64(qrResponse.payload);
                            setIsQrModalOpen(true);
                        } else {
                            toast.error(qrResponse.message || "Failed to generate payment QR");
                        }
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    // Standard Dine-In flow
                    clearOrder();
                    toast.success("Order created successfully");
                }
            },
            onError: (error) => {
                console.log(error);
                toast.error("Failed to create order");
            }
        });
    }

    const handleQrSuccess = () => {
        setIsQrModalOpen(false);
        clearOrder();
        toast.success("Payment Received & Order Completed!", { duration: 4000 });
    };

    return (
        <aside className="flex h-full w-full flex-col bg-white">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white p-4">
                <h2 className="font-sans text-xl font-bold tracking-tight text-slate-800">
                    Current Order
                </h2>
                <button
                    type="button"
                    onClick={clearOrder}
                    disabled={order.orderItems.length === 0}
                    className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 active:bg-red-100 disabled:opacity-50 touch-manipulation tap-highlight-transparent"
                >
                    Clear
                </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4" style={{ contentVisibility: 'auto' }}>
                {order.orderItems.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mb-4 h-12 w-12 opacity-50">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                        <p className="font-medium">Order is empty</p>
                        <p className="mt-1 text-sm">Select items from the menu</p>
                    </div>
                ) : (
                    <ul className="flex flex-col gap-4">
                        {order.orderItems.map((oi) => (
                            <li key={oi.itemId} className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 shadow-sm transition-colors hover:border-slate-200">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <h3 className="font-bold leading-tight text-slate-900">Item #{oi.itemId}</h3>
                                        <p className="mt-0.5 font-mono text-sm font-medium text-slate-500">
                                            {formatUSD(oi.priceAtOrder)}
                                        </p>
                                    </div>
                                    <div className="font-mono text-base font-bold text-slate-900">
                                        {formatUSD(oi.priceAtOrder * oi.quantity)}
                                    </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center justify-between mt-1">
                                    <div className="flex h-10 w-28 items-center justify-between overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                                        <button
                                            type="button"
                                            aria-label="Decrease quantity"
                                            onClick={() => updateQuantity(oi.itemId, oi.quantity - 1)}
                                            className="flex h-full w-10 cursor-pointer items-center justify-center text-slate-500 transition-colors hover:bg-slate-50 active:bg-slate-100 touch-manipulation text-xl font-medium"
                                        >
                                            &minus;
                                        </button>
                                        <span className="font-mono text-base font-bold text-slate-800">{oi.quantity}</span>
                                        <button
                                            type="button"
                                            aria-label="Increase quantity"
                                            onClick={() => updateQuantity(oi.itemId, oi.quantity + 1)}
                                            className="flex h-full w-10 cursor-pointer items-center justify-center text-slate-500 transition-colors hover:bg-slate-50 active:bg-slate-100 touch-manipulation text-xl font-medium"
                                        >
                                            &#43;
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Footer / Totals */}
            <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-2 pb-4">
                    <div className="flex justify-between text-sm font-medium text-slate-500">
                        <span>Subtotal</span>
                        <span className="font-mono text-slate-700">{formatUSD(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-slate-500">
                        <span>Tax (10%)</span>
                        <span className="font-mono text-slate-700">{formatUSD(tax)}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-xl font-bold text-slate-900">
                        <span>Total</span>
                        <div className="flex flex-col items-end">
                            <span className="font-mono text-emerald-600">{formatUSD(grandTotal)}</span>
                            <span className="font-mono text-sm text-slate-400">{formatVND(grandTotal)}</span>
                        </div>
                    </div>
                </div>

                {order.orderType === OrderType.DineIn ? (
                    <button
                        type="button"
                        onClick={() => handleSubmitOrder()}
                        disabled={order.orderItems.length === 0 || (order.tableNumber === undefined && order.orderType === OrderType.DineIn) || createOrder.isPending || generatePaymentQr.isPending}
                        className="flex w-full items-center justify-center rounded-xl bg-blue-600 p-4 font-bold text-white shadow-md transition-all hover:bg-blue-500 disabled:pointer-events-none disabled:opacity-50 touch-manipulation"
                    >
                        {createOrder.isPending || generatePaymentQr.isPending ? (
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span className="text-lg tracking-wide">PROCESSING...</span>
                            </div>
                        ) : (
                            <span className="text-lg tracking-wide">SUBMIT ORDER</span>
                        )}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => handleSubmitOrder()}
                        disabled={order.orderItems.length === 0 || createOrder.isPending || generatePaymentQr.isPending}
                        className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-slate-900 p-4 font-bold text-white shadow-md transition-all ease-out hover:-translate-y-1 hover:bg-emerald-600 hover:shadow-lg active:translate-y-0 active:bg-emerald-700 disabled:pointer-events-none disabled:opacity-50 touch-manipulation tap-highlight-transparent"
                    >
                        {createOrder.isPending || generatePaymentQr.isPending ? (
                            <div className="flex w-full items-center justify-center gap-2">
                                <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span className="text-lg tracking-wide">PROCESSING...</span>
                            </div>
                        ) : (
                            <>
                                <span className="text-lg tracking-wide">PAY NOW</span>
                                <span className="rounded-md bg-white/20 px-3 py-1 cursor-pointer font-mono text-lg transition-colors group-hover:bg-white/30">
                                    {formatUSD(grandTotal)}
                                </span>
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* QR Payment Modal */}
            <QRModal
                isOpen={isQrModalOpen}
                onClose={() => setIsQrModalOpen(false)}
                onSuccess={handleQrSuccess}
                orderId={currentOrderId}
                qrSvgBase64={qrBase64}
            />
        </aside>
    );
}
