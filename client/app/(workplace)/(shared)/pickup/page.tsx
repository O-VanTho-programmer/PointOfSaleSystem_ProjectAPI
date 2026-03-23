"use client";

import React, { useMemo } from 'react';
import { KitchenStatus, OrderStatus, OrderType } from '@/types/OrderDTO';
import { RoleGuard } from '@/components/RoleGuard';
import { useOrdersByDateRange, useUpdateKitchenStatus } from '@/hooks/useOrders';
import { formatTimeAgo } from '@/utils/formatTimeAgo';
import { getTodayDateRange } from '@/utils/dateHelper';
import { usePosSignalR } from '@/hooks/usePosSignalR';
import { HandPlatter } from 'lucide-react';

export default function PickupScreen() {
    const { startDate, endDate } = getTodayDateRange();
    const { data: ordersResult, isLoading, error } = useOrdersByDateRange(startDate, endDate);
    const orders = ordersResult?.listPayload || [];

    usePosSignalR();

    const updateKitchenStatus = useUpdateKitchenStatus();

    const handleMarkServed = (orderId: number) => {
        updateKitchenStatus.mutate({ 
            id: orderId, 
            dto: { kitchenStatus: KitchenStatus.Served } 
        });
    };

    // Filter to only show Active orders that are Dine-In and Ready in the kitchen
    const visibleOrders = useMemo(() => {
        return orders.filter(
            o => o.status === OrderStatus.Active &&
                 o.orderType === OrderType.DineIn &&
                 o.kitchenStatus === KitchenStatus.Ready
        );
    }, [orders]);

    return (
        <RoleGuard allowedRoles={['Waiter', 'Cashier', 'Manager']}>
            <div className="flex h-full flex-col bg-slate-50 p-4 sm:p-6 text-slate-900 overflow-hidden">

                {/* Header */}
                <header className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                            <HandPlatter className="h-8 w-8 text-emerald-600" />
                            Ready for Pickup
                        </h1>
                        <p className="mt-1 text-slate-500">Dine-In orders that are ready to be served to tables.</p>
                    </div>
                    
                    <div className="flex items-center justify-center rounded-xl bg-slate-200/50 px-4 py-2 border border-slate-200 font-mono text-sm font-bold text-slate-600">
                        {visibleOrders.length} ORDERS WAITING
                    </div>
                </header>

                {/* Ticket Kanban Grid */}
                <div className="flex-1 overflow-y-auto pb-8 pr-2" style={{ contentVisibility: 'auto' }}>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
                        {visibleOrders.map(order => (
                            <article
                                key={order.orderId}
                                className="flex flex-col overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Ticket Header */}
                                <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50/50 p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-2xl font-black text-slate-900">#{order.orderId}</span>
                                    </div>
                                    <span className="font-mono text-sm font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">
                                        {formatTimeAgo(order.createdDate)}
                                    </span>
                                </div>

                                {/* Table Number Callout */}
                                <div className="flex items-center justify-center bg-slate-900 py-3 text-white">
                                    <span className="text-xl font-bold tracking-widest uppercase">
                                        Table {order.tableNumber || '?'}
                                    </span>
                                </div>

                                {/* Items List */}
                                <div className="flex-1 p-4 bg-white">
                                    <ul className="space-y-3">
                                        {order.orderItems.map((oi, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 font-mono text-sm font-bold text-slate-700">
                                                    {oi.quantity}x
                                                </span>
                                                <span className="mt-0.5 font-medium leading-snug text-slate-800">
                                                    {oi.itemName}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action Button */}
                                <div className="p-4 pt-0 mt-2 bg-white">
                                    <button
                                        onClick={() => handleMarkServed(order.orderId)}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 text-lg font-black tracking-wide text-white shadow-sm transition-transform hover:-translate-y-1 hover:bg-emerald-500 hover:shadow-md active:translate-y-0 active:bg-emerald-700 touch-manipulation tap-highlight-transparent"
                                    >
                                        <HandPlatter className="h-6 w-6" />
                                        MARK AS SERVED
                                    </button>
                                </div>
                            </article>
                        ))}

                        {visibleOrders.length === 0 && (
                            <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                                <HandPlatter className="mb-4 h-16 w-16 text-slate-300" strokeWidth={1.5} />
                                <span className="text-xl font-medium text-slate-400">No plates waiting for pickup</span>
                                <span className="text-sm mt-2 text-slate-400 font-mono text-center max-w-sm">When the kitchen marks a Dine-In order as Ready, it will appear here.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </RoleGuard>
    );
}
