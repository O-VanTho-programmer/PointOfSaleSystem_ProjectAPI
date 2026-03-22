"use client";

import { useState, useMemo } from 'react';
import { RoleGuard } from '@/components/RoleGuard';
import { formatTimeAgo } from '@/utils/formatTimeAgo';
import { useActivityLogs } from '@/hooks/useActivityLogs';

type LogType = 'login' | 'order' | 'inventory' | 'settings' | 'team';

interface ActivityLog {
    id: number;
    user: string;
    role: string;
    action: string;
    type: LogType;
    timestamp: string;
}

const LOG_TYPE_CONFIG: Record<LogType, { icon: string; bg: string; text: string }> = {
    login: { icon: '🔐', bg: 'bg-indigo-50', text: 'text-indigo-600' },
    order: { icon: '🧾', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    inventory: { icon: '📦', bg: 'bg-amber-50', text: 'text-amber-600' },
    settings: { icon: '⚙️', bg: 'bg-slate-100', text: 'text-slate-600' },
    team: { icon: '👤', bg: 'bg-blue-50', text: 'text-blue-600' },
};

const MOCK_LOGS: ActivityLog[] = [
    { id: 1, user: 'Nguyen Van A', role: 'Manager', action: 'Updated tax rate from 10% to 12%', type: 'settings', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 2, user: 'Tran Thi B', role: 'Cashier', action: 'Completed payment for Order #1042', type: 'order', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
    { id: 3, user: 'Le Van C', role: 'Chef', action: 'Logged in from Kitchen Terminal', type: 'login', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
    { id: 4, user: 'Nguyen Van A', role: 'Manager', action: 'Added new item "Mango Smoothie" to inventory', type: 'inventory', timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
    { id: 5, user: 'Pham D', role: 'Waiter', action: 'Created Order #1041 (Dine-In, Table 3)', type: 'order', timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString() },
    { id: 6, user: 'Nguyen Van A', role: 'Manager', action: 'Changed role of Tran Thi B to Cashier', type: 'team', timestamp: new Date(Date.now() - 1000 * 60 * 70).toISOString() },
    { id: 7, user: 'Tran Thi B', role: 'Cashier', action: 'Voided Order #1038', type: 'order', timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
    { id: 8, user: 'Ho E', role: 'Waiter', action: 'Logged in from Tablet POS', type: 'login', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
];

const FILTER_OPTIONS: { value: LogType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Activity' },
    { value: 'login', label: '🔐 Logins' },
    { value: 'order', label: '🧾 Orders' },
    { value: 'inventory', label: '📦 Inventory' },
    { value: 'settings', label: '⚙️ Settings' },
    { value: 'team', label: '👤 Team' },
];

export default function ActivityLogsPage() {
    const [filter, setFilter] = useState<LogType | 'all'>('all');
    const { data: activityLogs } = useActivityLogs();

    const filteredLogs = useMemo(() => {
        return filter === 'all' ? MOCK_LOGS : MOCK_LOGS.filter(l => l.type === filter);
    }, [filter]);

    return (
        <RoleGuard allowedRoles={['Manager']}>
            <div className="flex h-full flex-col gap-6 p-6 lg:p-8">
                {/* Header */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                            Activity Logs
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            System audit trail — track every action across your team.
                        </p>
                    </div>
                    {/* Filter pills */}
                    <div className="flex flex-wrap gap-1.5">
                        {FILTER_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setFilter(opt.value)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${filter === opt.value
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Timeline */}
                <div className="flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="divide-y divide-slate-100">
                        {filteredLogs.map(log => {
                            const config = LOG_TYPE_CONFIG[log.type];
                            return (
                                <div key={log.id} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-slate-50/60">
                                    <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm ${config.bg}`}>
                                        {config.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-800">
                                            <span className="font-semibold">{log.user}</span>
                                            <span className="mx-1.5 text-slate-300">·</span>
                                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
                                                {log.role}
                                            </span>
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500 leading-relaxed">{log.action}</p>
                                    </div>
                                    <span className="shrink-0 font-mono text-xs text-slate-400 mt-0.5">
                                        {formatTimeAgo(log.timestamp)}
                                    </span>
                                </div>
                            );
                        })}

                        {filteredLogs.length === 0 && (
                            <div className="flex h-48 items-center justify-center">
                                <p className="text-sm font-medium text-slate-400">No activity matching this filter.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </RoleGuard>
    );
}
