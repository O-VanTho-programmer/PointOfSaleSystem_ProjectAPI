"use client";

import { useState, useMemo } from 'react';
import { RoleGuard } from '../../../components/RoleGuard';

interface SalesMetric {
    label: string;
    value: string;
    change: string;
    positive: boolean;
    icon: string;
}

const METRICS: SalesMetric[] = [
    { label: 'Total Revenue', value: '$12,847.50', change: '+12.5%', positive: true, icon: '💰' },
    { label: 'Orders Today', value: '148', change: '+8.2%', positive: true, icon: '🧾' },
    { label: 'Avg. Order Value', value: '$86.80', change: '-2.1%', positive: false, icon: '📊' },
    { label: 'Items Sold', value: '432', change: '+15.7%', positive: true, icon: '📦' },
];

interface TopItem {
    rank: number;
    name: string;
    qty: number;
    revenue: number;
}

const TOP_ITEMS: TopItem[] = [
    { rank: 1, name: 'Double Smash Burger', qty: 64, revenue: 831.36 },
    { rank: 2, name: 'Classic Cheeseburger', qty: 58, revenue: 521.42 },
    { rank: 3, name: 'Crispy Chicken Sandwich', qty: 45, revenue: 494.55 },
    { rank: 4, name: 'Truffle Parm Fries', qty: 38, revenue: 227.62 },
    { rank: 5, name: 'Vanilla Bean Shake', qty: 32, revenue: 175.68 },
];

const HOURLY_DATA = [
    { hour: '8AM', orders: 4 }, { hour: '9AM', orders: 8 }, { hour: '10AM', orders: 12 },
    { hour: '11AM', orders: 22 }, { hour: '12PM', orders: 35 }, { hour: '1PM', orders: 28 },
    { hour: '2PM', orders: 18 }, { hour: '3PM', orders: 10 }, { hour: '4PM', orders: 8 },
    { hour: '5PM', orders: 15 }, { hour: '6PM', orders: 30 }, { hour: '7PM', orders: 38 },
    { hour: '8PM', orders: 25 }, { hour: '9PM', orders: 12 },
];

function formatCurrency(val: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
}

function BarChart({ data }: { data: typeof HOURLY_DATA }) {
    const max = useMemo(() => Math.max(...data.map(d => d.orders)), [data]);

    return (
        <div className="flex items-end gap-1.5 h-40" role="img" aria-label="Hourly orders chart">
            {data.map((d) => {
                const heightPct = max > 0 ? (d.orders / max) * 100 : 0;
                return (
                    <div key={d.hour} className="group flex flex-1 flex-col items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
                            {d.orders}
                        </span>
                        <div
                            className="w-full rounded-t-md bg-emerald-400 transition-all duration-300 group-hover:bg-emerald-500"
                            style={{ height: `${heightPct}%`, minHeight: d.orders > 0 ? '4px' : '0px' }}
                        />
                        <span className="text-[9px] font-medium text-slate-400">{d.hour}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default function SalesReportsPage() {
    const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

    return (
        <RoleGuard allowedRoles={['Manager']}>
            <div className="flex h-full flex-col gap-6 p-6 lg:p-8 overflow-y-auto">
                {/* Header */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                            Sales Reports
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Revenue breakdown, popular items, and order trends.
                        </p>
                    </div>
                    <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200">
                        {(['today', 'week', 'month'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${period === p
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Metric Cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {METRICS.map(m => (
                        <div key={m.label} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <span className="text-2xl">{m.icon}</span>
                                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${m.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                                    }`}>
                                    {m.change}
                                </span>
                            </div>
                            <div>
                                <p className="font-mono text-2xl font-black text-slate-900">{m.value}</p>
                                <p className="mt-0.5 text-xs font-medium text-slate-400 uppercase tracking-wider">{m.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                    {/* Hourly Bar Chart */}
                    <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Orders by Hour</h3>
                        <BarChart data={HOURLY_DATA} />
                    </div>

                    {/* Top Items */}
                    <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Top Sellers</h3>
                        <div className="space-y-3">
                            {TOP_ITEMS.map(item => (
                                <div key={item.rank} className="flex items-center gap-3">
                                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-black ${item.rank === 1 ? 'bg-amber-100 text-amber-700' :
                                            item.rank === 2 ? 'bg-slate-100 text-slate-600' :
                                                item.rank === 3 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-slate-50 text-slate-400'
                                        }`}>
                                        {item.rank}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                                        <p className="text-xs text-slate-400">{item.qty} sold</p>
                                    </div>
                                    <span className="font-mono text-sm font-bold text-emerald-600">{formatCurrency(item.revenue)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </RoleGuard>
    );
}
