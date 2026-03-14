"use client";

import React, { useState } from 'react';
import { OrderStatus, OrderType, OrderDTO } from '@/types/OrderDTO';
import { RoleGuard } from '@/components/RoleGuard';
import { formatServerTimeOnly } from '@/utils/dateHelper';

const ORDER_TYPE_LABELS: Record<number, string> = {
    [OrderType.DineIn]: 'Dine-In',
    [OrderType.TakeAway]: 'Takeaway',
    [OrderType.Delivery]: 'Delivery',
};

const MOCK_ACTIVE_ORDERS: OrderDTO[] = [
    {
        orderId: 1001,
        userId: 1,
        status: OrderStatus.Pending,
        orderType: OrderType.DineIn,
        tableNumber: 4,
        createdDate: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        orderItems: [
            { itemId: 2, quantity: 2, priceAtOrder: 12.99 },
            { itemId: 5, quantity: 1, priceAtOrder: 5.99 },
        ]
    },
    {
        orderId: 1002,
        userId: 1,
        status: OrderStatus.Complete,
        orderType: OrderType.TakeAway,
        createdDate: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        orderItems: [
            { itemId: 3, quantity: 1, priceAtOrder: 10.99 },
            { itemId: 6, quantity: 1, priceAtOrder: 5.49 },
        ]
    },
    {
        orderId: 1003,
        userId: 1,
        status: OrderStatus.Pending,
        orderType: OrderType.DineIn,
        tableNumber: 1,
        createdDate: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        orderItems: [
            { itemId: 1, quantity: 3, priceAtOrder: 8.99 },
        ]
    },
];

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderDTO[]>(MOCK_ACTIVE_ORDERS);
    const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);

    const calculateTotal = (order: OrderDTO) => {
        const subtotal = order.orderItems.reduce((sum, oi) => sum + (oi.priceAtOrder * oi.quantity), 0);
        return subtotal * 1.10;
    };

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    const formatTime = (isoString: string) => {
        return formatServerTimeOnly(isoString);
    };

    const handleProceedToPayment = () => {
        if (!selectedOrder) return;
        setOrders(prev => prev.map(o =>
            o.orderId === selectedOrder.orderId ? { ...o, status: OrderStatus.Paid } : o
        ));
        setSelectedOrder(null);
    };

    const handleCancelOrder = () => {
        if (!selectedOrder) return;
        setOrders(prev => prev.filter(o => o.orderId !== selectedOrder.orderId));
        setSelectedOrder(null);
    };

    const visibleOrders = orders.filter(o => o.status === OrderStatus.Pending || o.status === OrderStatus.Complete);

    return (
        <div className="flex h-full flex-col bg-slate-50 p-6 sm:p-8">
            <header className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Active Orders</h1>
                    <p className="mt-2 text-slate-500">Manage order states and proceed to payment.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                        <span className="text-sm font-medium text-slate-600">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
                        <span className="text-sm font-medium text-slate-600">Completed (Ready)</span>
                    </div>
                </div>
            </header>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleOrders.map(order => (
                    <button
                        key={order.orderId}
                        onClick={() => setSelectedOrder(order)}
                        className={`
              relative flex flex-col items-start overflow-hidden rounded-2xl border-2 bg-white p-5 text-left shadow-sm transition-all duration-200 
              hover:-translate-y-1 hover:shadow-md active:translate-y-0
              ${order.status === OrderStatus.Complete ? 'border-emerald-200 hover:border-emerald-400' : 'border-amber-200 hover:border-amber-400'}
            `}
                    >
                        {/* Status Indicator Band */}
                        <div className={`absolute left-0 top-0 h-full w-1.5 ${order.status === OrderStatus.Complete ? 'bg-emerald-400' : 'bg-amber-400'}`} />

                        <div className="flex w-full items-start justify-between">
                            <span className="font-mono text-lg font-bold text-slate-900">#{order.orderId}</span>
                            <span className="font-mono text-sm font-medium text-slate-500">{formatTime(order.createdDate)}</span>
                        </div>

                        <div className="mt-3 flex gap-2">
                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                {order.orderType !== undefined ? ORDER_TYPE_LABELS[order.orderType] : '—'}
                            </span>
                            {order.tableNumber && (
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                    Table {order.tableNumber}
                                </span>
                            )}
                        </div>

                        <div className="mt-6 flex w-full items-end justify-between border-t border-slate-100 pt-4">
                            <span className="text-sm text-slate-500">{order.orderItems.length} items</span>
                            <span className="font-mono text-xl font-bold text-emerald-600">{formatCurrency(calculateTotal(order))}</span>
                        </div>
                    </button>
                ))}

                {visibleOrders.length === 0 && (
                    <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white">
                        <span className="text-lg font-medium text-slate-400">No active orders</span>
                    </div>
                )}
            </div>

            {/* Payment / Action Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm transition-opacity">
                    <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className={`h-2 w-full ${selectedOrder.status === OrderStatus.Complete ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center justify-between">
                                <h2 className="font-serif text-3xl font-bold text-slate-900">Order #{selectedOrder.orderId}</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>

                            <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
                                <div className="flex justify-between p-4">
                                    <span className="text-sm font-medium text-slate-500">Order Type</span>
                                    <span className="font-semibold text-slate-900">
                                        {selectedOrder.orderType !== undefined ? ORDER_TYPE_LABELS[selectedOrder.orderType] : '—'}
                                        {selectedOrder.tableNumber ? ` (Table ${selectedOrder.tableNumber})` : ''}
                                    </span>
                                </div>
                                <div className="flex justify-between p-4">
                                    <span className="text-sm font-medium text-slate-500">Status</span>
                                    <span className={`font-semibold ${selectedOrder.status === OrderStatus.Complete ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {selectedOrder.status === OrderStatus.Complete ? 'Complete (Ready)' : 'Pending (Cooking)'}
                                    </span>
                                </div>
                                <div className="flex justify-between p-4">
                                    <span className="text-sm font-medium text-slate-500">Total</span>
                                    <span className="font-mono text-xl font-bold text-slate-900">{formatCurrency(calculateTotal(selectedOrder))}</span>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancelOrder}
                                    className="flex-1 rounded-xl bg-white px-4 py-4 font-bold text-red-600 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-red-50 active:bg-red-100"
                                >
                                    Cancel Order
                                </button>
                                <RoleGuard allowedRoles={['Manager', 'Cashier']}>
                                    <button
                                        type="button"
                                        onClick={handleProceedToPayment}
                                        className="flex-[2] rounded-xl bg-slate-900 px-4 py-4 text-lg font-bold text-white shadow-md transition-transform hover:-translate-y-1 hover:bg-emerald-600 hover:shadow-lg active:translate-y-0 active:bg-emerald-700"
                                    >
                                        Proceed to Payment
                                    </button>
                                </RoleGuard>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
