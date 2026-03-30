"use client";

import { useState, useMemo } from 'react';
import { RoleGuard } from '@/components/RoleGuard';
import { useDashboardSalesReport } from '@/hooks/useSalesReport';
import { TopSellerDto } from '@/types/SalesReport';
import { formatCurrency } from '@/utils/formatCurrency';
import BarChart from '@/components/report/BarChart';

interface SalesMetric {
    label: string;
    value: string;
    change: string;
    positive: boolean;
    icon: string;
}

export default function SalesReportsPage() {
    const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

    const getDatesForPeriod = (p: 'today' | 'week' | 'month') => {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        if (p === 'week') {
            start.setDate(start.getDate() - 7);
        } else if (p === 'month') {
            start.setDate(start.getDate() - 30);
        }

        return {
            startDate: start.toISOString(),
            endDate: end.toISOString()
        };
    };

    const { startDate, endDate } = getDatesForPeriod(period);

    const { data: reportData, isLoading, isError } = useDashboardSalesReport(startDate, endDate);

    const metricsData = reportData?.payload?.metrics;
    const topSellers = reportData?.payload?.topSellers || [];
    const hourlyData = reportData?.payload?.ordersChart || [];

    const METRICS: SalesMetric[] = useMemo(() => {
        if (!metricsData) return [];
        return [
            {
                label: 'Total Revenue',
                value: formatCurrency(metricsData.totalRevenue),
                change: `${metricsData.revenueTrend >= 0 ? '+' : ''}${metricsData.revenueTrend.toFixed(1)}%`,
                positive: metricsData.revenueTrend >= 0,
                icon: '💰'
            },
            {
                label: 'Orders',
                value: metricsData.totalOrders.toString(),
                change: `${metricsData.ordersTrend >= 0 ? '+' : ''}${metricsData.ordersTrend.toFixed(1)}%`,
                positive: metricsData.ordersTrend >= 0,
                icon: '🧾'
            },
            {
                label: 'Avg. Order',
                value: formatCurrency(metricsData.averageOrderValue),
                change: '',
                positive: true,
                icon: '📊'
            },
            {
                label: 'Items Sold',
                value: metricsData.itemsSold.toString(),
                change: '',
                positive: true,
                icon: '📦'
            },
        ];
    }, [metricsData]);

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
                                disabled={isLoading}
                                className={`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 ${period === p
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </header>

                {isLoading && (
                    <div className="flex-1 flex items-center justify-center min-h-[400px]">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
                    </div>
                )}

                {isError && (
                    <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-red-600">
                        Failed to load sales report. Please try again later.
                    </div>
                )}

                {!isLoading && !isError && reportData && (
                    <>
                        {/* Metric Cards */}
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            {METRICS.map(m => (
                                <div key={m.label} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl">{m.icon}</span>
                                        {m.change && (
                                            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${m.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                                {m.change}
                                            </span>
                                        )}
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
                            <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm overflow-hidden flex flex-col">
                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500 shrink-0">
                                    {period === 'today' ? 'Orders by Hour' : 'Orders Over Time'}
                                </h3>
                                <div className="flex-1 min-h-[200px] flex items-end">
                                    {hourlyData.length > 0 ? (
                                        <BarChart data={hourlyData} />
                                    ) : (
                                        <div className="w-full flex items-center justify-center text-slate-400 text-sm h-full">
                                            No data for this period
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Top Items */}
                            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col max-h-[400px]">
                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500 shrink-0">Top Sellers</h3>
                                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                                    {topSellers.length > 0 ? (
                                        topSellers.map((item: TopSellerDto, idx: number) => (
                                            <div key={item.itemName} className="flex items-center gap-3">
                                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-black ${idx === 0 ? 'bg-amber-100 text-amber-700' :
                                                    idx === 1 ? 'bg-slate-100 text-slate-600' :
                                                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                                                            'bg-slate-50 text-slate-400'
                                                    }`}>
                                                    {idx + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 truncate" title={item.itemName}>{item.itemName}</p>
                                                    <p className="text-xs text-slate-400">{item.quantitySold} sold</p>
                                                </div>
                                                <span className="font-mono text-sm font-bold text-emerald-600">{formatCurrency(item.totalRevenue)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-slate-400 text-sm py-8">
                                            No sales data available
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </RoleGuard>
    );
}
