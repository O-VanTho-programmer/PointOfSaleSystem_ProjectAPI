"use client";

import React, { useState, useMemo } from 'react';
import { OrderStatus, OrderType, OrderDTO, OrderItemDTO } from '@/types/OrderDTO';
import { RoleGuard } from '@/components/RoleGuard';

const MOCK_KITCHEN_ORDERS: OrderDTO[] = [
    {
        orderId: 1001,
        userId: 1,
        status: OrderStatus.Pending,
        orderType: OrderType.DineIn,
        tableNumber: '4',
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
        tableNumber: '1',
        createdDate: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        orderItems: [
            { itemId: 1, quantity: 3, priceAtOrder: 8.99 },
        ]
    },
    {
        orderId: 1004,
        userId: 1,
        status: OrderStatus.Pending,
        orderType: OrderType.TakeAway,
        tableNumber: undefined,
        createdDate: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
        orderItems: [
            { itemId: 3, quantity: 1, priceAtOrder: 10.99 },
            { itemId: 4, quantity: 1, priceAtOrder: 3.99 },
        ]
    }
];

const ORDER_TYPE_LABELS: Record<number, string> = {
    [OrderType.DineIn]: 'DINE-IN',
    [OrderType.TakeAway]: 'TAKEAWAY',
    [OrderType.Delivery]: 'DELIVERY',
};

export default function KitchenDisplaySystemPage() {
    const [orders, setOrders] = useState<OrderDTO[]>(MOCK_KITCHEN_ORDERS);

    const [filterMode, setFilterMode] = useState<'Pending' | 'Completed' | 'Both'>('Pending');

    const formatTimeAgo = (isoString: string) => {
        const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
        if (diff < 1) return 'Just now';
        return `${diff}m ago`;
    };

    const handleMarkComplete = (orderId: number) => {
        setOrders(prev => prev.map(o =>
            o.orderId === orderId ? { ...o, status: OrderStatus.Complete } : o
        ));
    };

    const visibleOrders = useMemo(() => {
        switch (filterMode) {
            case 'Pending': return orders.filter(o => o.status === OrderStatus.Pending);
            case 'Completed': return orders.filter(o => o.status === OrderStatus.Complete);
            case 'Both': return orders;
        }
    }, [orders, filterMode]);

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
                        {(['Pending', 'Completed', 'Both'] as const).map((mode) => (
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
                        {visibleOrders.map(order => (
                            <article
                                key={order.orderId}
                                className={`
                flex flex-col overflow-hidden rounded-2xl border-2 bg-slate-800 shadow-md
                ${order.status === OrderStatus.Pending ? 'border-amber-500/50' : 'border-emerald-500/50 opacity-80'}
              `}
                            >
                                {/* Ticket Header */}
                                <div className={`flex items-center justify-between border-b p-4 ${order.status === OrderStatus.Pending ? 'border-amber-500/20 bg-amber-500/10' : 'border-emerald-500/20 bg-emerald-500/10'}`}>
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-2xl font-black text-white">#{order.orderId}</span>
                                        <span className={`rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${order.status === OrderStatus.Pending ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                            {order.status === OrderStatus.Pending ? 'COOKING' : 'READY'}
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
                                                    Item #{oi.itemId}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action Button */}
                                {order.status === OrderStatus.Pending ? (
                                    <div className="p-4 pt-0 mt-2">
                                        <button
                                            onClick={() => handleMarkComplete(order.orderId)}
                                            className="w-full rounded-xl bg-amber-500 px-4 py-4 text-lg font-black tracking-wide text-amber-950 shadow-sm transition-transform hover:-translate-y-1 hover:bg-amber-400 hover:shadow-md active:translate-y-0 active:bg-amber-600 touch-manipulation tap-highlight-transparent"
                                        >
                                            MARK COMPLETE
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-4 pt-0 mt-2">
                                        <div className="flex w-full items-center justify-center rounded-xl bg-emerald-500/20 px-4 py-4 text-lg font-black tracking-wide text-emerald-400 border border-emerald-500/30">
                                            COMPLETED
                                        </div>
                                    </div>
                                )}
                            </article>
                        ))}

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
