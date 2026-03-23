"use client";

import React, { useState, useMemo } from 'react';
import { KitchenStatus, OrderStatus, OrderType } from '@/types/OrderDTO';
import { RoleGuard } from '@/components/RoleGuard';
import { useOrdersByDateRange, useUpdateKitchenStatus } from '@/hooks/useOrders';
import { formatTimeAgo } from '@/utils/formatTimeAgo';
import { getTodayDateRange } from '@/utils/dateHelper';
import { usePosSignalR } from '@/hooks/usePosSignalR';

const ORDER_TYPE_LABELS: Record<number, string> = {
    [OrderType.DineIn]: 'DINE-IN',
    [OrderType.TakeAway]: 'TAKEAWAY',
};

const KITCHEN_STATUS_LABELS: Record<number, string> = {
    [KitchenStatus.Pending]: 'PENDING',
    [KitchenStatus.Cooking]: 'COOKING',
    [KitchenStatus.Ready]: 'READY',
};

type KitchenFilterMode = 'Active' | 'Ready' | 'All';

export default function KitchenDisplaySystemPage() {
    const { startDate, endDate } = getTodayDateRange();
    const { data: ordersResult, isLoading, error } = useOrdersByDateRange(startDate, endDate);
    const orders = ordersResult?.listPayload || [];

    usePosSignalR();

    const updateKitchenStatus = useUpdateKitchenStatus();

    const [filterMode, setFilterMode] = useState<KitchenFilterMode>('Active');

    const handleAdvanceKitchenStatus = (orderId: number, currentStatus: KitchenStatus) => {
        let nextStatus: KitchenStatus;
        switch (currentStatus) {
            case KitchenStatus.Pending:
                nextStatus = KitchenStatus.Cooking;
                break;
            case KitchenStatus.Cooking:
                nextStatus = KitchenStatus.Ready;
                break;
            default:
                return; // Chef cannot advance beyond Ready
        }
        updateKitchenStatus.mutate({ id: orderId, dto: { kitchenStatus: nextStatus } });
    };

    const getNextActionLabel = (status: KitchenStatus): string => {
        switch (status) {
            case KitchenStatus.Pending: return 'START COOKING';
            case KitchenStatus.Cooking: return 'MARK READY';
            default: return '';
        }
    };

    // Only show active (non-cancelled, non-completed) orders
    const activeOrders = useMemo(() => {
        return orders.filter(o => o.status === OrderStatus.Active);
    }, [orders]);

    const visibleOrders = useMemo(() => {
        switch (filterMode) {
            case 'Active': return activeOrders.filter(o => o.kitchenStatus === KitchenStatus.Pending || o.kitchenStatus === KitchenStatus.Cooking);
            case 'Ready': return activeOrders.filter(o => o.kitchenStatus === KitchenStatus.Ready);
            case 'All': return activeOrders.filter(o => o.kitchenStatus !== KitchenStatus.Served);
        }
    }, [activeOrders, filterMode]);

    const getStatusColor = (status: KitchenStatus) => {
        switch (status) {
            case KitchenStatus.Pending: return { border: 'border-amber-500/50', bg: 'bg-amber-500/10', borderB: 'border-amber-500/20', badge: 'bg-amber-500/20 text-amber-400', btn: 'bg-amber-500 text-amber-950 hover:bg-amber-400 active:bg-amber-600' };
            case KitchenStatus.Cooking: return { border: 'border-orange-500/50', bg: 'bg-orange-500/10', borderB: 'border-orange-500/20', badge: 'bg-orange-500/20 text-orange-400', btn: 'bg-orange-500 text-orange-950 hover:bg-orange-400 active:bg-orange-600' };
            case KitchenStatus.Ready: return { border: 'border-emerald-500/50', bg: 'bg-emerald-500/10', borderB: 'border-emerald-500/20', badge: 'bg-emerald-500/20 text-emerald-400', btn: 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400 active:bg-emerald-600' };

            default: return { border: 'border-slate-500/50', bg: 'bg-slate-500/10', borderB: 'border-slate-500/20', badge: 'bg-slate-500/20 text-slate-400', btn: '' };
        }
    };

    return (
        <RoleGuard allowedRoles={['Chef']}>
            <div className="flex h-full flex-col bg-slate-900 p-4 sm:p-6 text-slate-200">

                {/* Header and Filter Tabs */}
                <header className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Kitchen Display</h1>
                        <p className="mt-1 text-slate-400">Manage active tickets and prep times.</p>
                    </div>

                    <div className="flex shrink-0 items-center justify-center rounded-xl bg-slate-800 p-1 border border-slate-700">
                        {(['Active', 'Ready', 'All'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setFilterMode(mode)}
                                className={`
                rounded-lg px-6 py-2.5 text-sm font-bold transition-all duration-200 touch-manipulation tap-highlight-transparent select-none whitespace-nowrap
                ${filterMode === mode
                                        ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-600'
                                        : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                                    }
              `}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Ticket Kanban Grid */}
                <div className="flex-1 overflow-y-auto pb-8 scrollbar-hide">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
                        {visibleOrders.map(order => {
                            const colors = getStatusColor(order.kitchenStatus);
                            return (
                                <article
                                    key={order.orderId}
                                    className={`
                    flex flex-col overflow-hidden rounded-2xl border-2 bg-slate-800 shadow-md
                    ${colors.border}
                  `}
                                >
                                    {/* Ticket Header */}
                                    <div className={`flex items-center justify-between border-b p-4 ${colors.borderB} ${colors.bg}`}>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-2xl font-black text-white">#{order.orderId}</span>
                                            <span className={`rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${colors.badge}`}>
                                                {KITCHEN_STATUS_LABELS[order.kitchenStatus]}
                                            </span>
                                        </div>
                                        <span className="font-mono text-sm font-medium text-slate-400">
                                            {formatTimeAgo(order.createdDate)}
                                        </span>
                                    </div>

                                    {/* Ticket Metadata */}
                                    <div className="flex justify-between bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300">
                                        <span className="uppercase tracking-wider text-slate-400">
                                            {order.orderType !== undefined ? ORDER_TYPE_LABELS[order.orderType] : '—'}
                                        </span>
                                        {order.tableNumber && (
                                            <span className="text-white">Table {order.tableNumber}</span>
                                        )}
                                    </div>

                                    {/* Items List */}
                                    <div className="flex-1 p-4">
                                        <ul className="space-y-3">
                                            {order.orderItems.map((oi, idx) => (
                                                <li key={idx} className="flex items-start gap-3">
                                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-slate-700 font-mono text-sm font-bold text-white">
                                                        {oi.quantity}x
                                                    </span>
                                                    <span className="mt-0.5 font-medium leading-snug text-slate-200">
                                                        {oi.itemName}
                                                    </span>
                                                    <span className="mt-0.5 font-medium leading-snug text-slate-500">
                                                        Item #{oi.itemId}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action Button */}
                                    {order.kitchenStatus !== KitchenStatus.Ready ? (
                                        <div className="p-4 pt-0 mt-2">
                                            <button
                                                onClick={() => handleAdvanceKitchenStatus(order.orderId, order.kitchenStatus)}
                                                className={`w-full rounded-xl px-4 py-4 text-lg font-black tracking-wide shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md active:translate-y-0 touch-manipulation tap-highlight-transparent ${colors.btn}`}
                                            >
                                                {getNextActionLabel(order.kitchenStatus)}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-4 pt-0 mt-2">
                                            <div className="flex w-full items-center justify-center rounded-xl bg-emerald-500/20 px-4 py-4 text-lg font-black tracking-wide text-emerald-400 border border-emerald-500/30">
                                                ✓ READY FOR PICKUP
                                            </div>
                                        </div>
                                    )}
                                </article>
                            );
                        })}

                        {visibleOrders.length === 0 && (
                            <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/50">
                                <UtensilsCrossedIcon className="mb-4 h-12 w-12 text-slate-600" />
                                <span className="text-lg font-medium text-slate-400">No tickets in this view</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </RoleGuard>
    );
}

function UtensilsCrossedIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
            <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
            <path d="m8.5 8.5 5 5" />
            <path d="m5 5 5 5" />
        </svg>
    );
}
