"use client";

import { useState } from 'react';
import { RoleGuard } from '@/components/RoleGuard';
import { formatTimeAgo } from '@/utils/formatTimeAgo';
import { useActivityLogs } from '@/hooks/useActivityLogs';
import { getTodayDateRange } from '@/utils/dateHelper';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { EntityName } from '@/types/ActivityLog';


const LOG_TYPE_CONFIG: Record<EntityName, { icon: string; bg: string; text: string }> = {
    User: { icon: '🔐', bg: 'bg-indigo-50', text: 'text-indigo-600' },
    Order: { icon: '🧾', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    Item: { icon: '📦', bg: 'bg-amber-50', text: 'text-amber-600' },
};

const FILTER_OPTIONS: { value: EntityName | 'All'; label: string }[] = [
    { value: 'All', label: 'All Activity' },
    { value: 'User', label: '🔐 Logins' },
    { value: 'Order', label: '🧾 Orders' },
    { value: 'Item', label: '📦 Inventory' },
];

export default function ActivityLogsPage() {
    const [filterEntityName, setFilterEntityName] = useState<EntityName | 'All'>('All');

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [{ startDate, endDate }, setDateRange] = useState(getTodayDateRange());

    const { data: activityLogsResult } = useActivityLogs(pageNumber, pageSize, startDate, endDate, filterEntityName === 'All' ? undefined : filterEntityName);

    const activityLogs = activityLogsResult?.listPayload;

    return (
        <RoleGuard allowedRoles={['Manager']}>
            <div className="flex h-full flex-col gap-6 p-6 lg:p-8">
                {/* Header */}
                <header className="flex flex-col gap-4">
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
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
                                    onClick={() => setFilterEntityName(opt.value)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${filterEntityName === opt.value
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setDateRange(getTodayDateRange())}
                            className="bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-600 cursor-pointer rounded-md px-6 py-2 text-sm font-bold transition-all duration-200 touch-manipulation select-none whitespace-nowrap"
                        >
                            Today
                        </button>

                        <DateRangePicker
                            startDate={startDate}
                            endDate={endDate}
                            setDateRange={setDateRange}
                        />
                    </div>
                </header>

                {/* Timeline */}
                <div className="flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="divide-y divide-slate-100">
                        {activityLogs?.map(log => {
                            const config = LOG_TYPE_CONFIG[log.entityName];
                            return (
                                <div key={log.activityId} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-slate-50/60">
                                    <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm ${config.bg} ${config.text}`}>
                                        {config.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-800">
                                            {log.details}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500 leading-relaxed">{log.action}</p>
                                    </div>
                                    <span className="shrink-0 font-mono text-xs text-slate-400 mt-0.5">
                                        {formatTimeAgo(log.timestamp)}
                                    </span>
                                </div>
                            );
                        })}

                        {activityLogs?.length === 0 && (
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
