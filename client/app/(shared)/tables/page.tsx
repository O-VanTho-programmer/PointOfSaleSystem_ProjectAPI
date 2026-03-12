"use client";

import React from 'react';
import { useTables } from '../../../hooks/useTables';
import { RoleGuard } from '../../../components/RoleGuard';
import { TableManagementOverlay } from '../../../components/tables/TableManagementOverlay';
import { useTableManagementStore } from '../../../store/tableManagementStore';
import { Table, TableStatus } from '../../../types/Table';

const STATUS_CONFIG: Record<TableStatus, { label: string; dot: string; bg: string; text: string; ring: string }> = {
    available: { label: 'Available', dot: 'bg-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
    reserved: { label: 'Reserved', dot: 'bg-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
    occupied: { label: 'Occupied', dot: 'bg-red-400', bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200' },
};

function TableCard({ table }: { table: Table }) {
    const config = STATUS_CONFIG[table.status] ?? STATUS_CONFIG.available;

    return (
        <div className={`group relative flex flex-col items-center gap-4 rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${table.status === 'occupied' ? 'border-red-200' : table.status === 'reserved' ? 'border-amber-200' : 'border-slate-200'
            }`}>
            {/* Table visual */}
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ring-2 transition-colors ${config.bg} ${config.ring}`}>
                <span className="font-mono text-3xl font-black text-slate-800">
                    {table.tableId}
                </span>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <span className="font-medium">{table.capacity} seats</span>
            </div>

            {/* Status badge */}
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${config.bg} ${config.text}`}>
                <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                {config.label}
            </span>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="flex animate-pulse flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="h-20 w-20 rounded-2xl bg-slate-100" />
            <div className="h-4 w-16 rounded bg-slate-100" />
            <div className="h-6 w-20 rounded-full bg-slate-100" />
        </div>
    );
}

export default function TablesPage() {
    const { data: tablesResult, isLoading, isError, error } = useTables();
    const tables = tablesResult?.listPayload || [];
    const { setIsOpen } = useTableManagementStore();

    const availableCount = tables?.filter(t => t.status === 'available').length ?? 0;
    const reservedCount = tables?.filter(t => t.status === 'reserved').length ?? 0;
    const occupiedCount = tables?.filter(t => t.status === 'occupied').length ?? 0;

    return (
        <RoleGuard allowedRoles={['Manager', 'Cashier', 'Waiter']}>
            <div className="flex h-full flex-col gap-6 p-6 lg:p-8">
                {/* Header */}
                <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                                Table Overview
                            </h1>
                            <button
                                onClick={() => setIsOpen(true)}
                                className="hidden cursor-pointer sm:flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-slate-900/10 active:scale-95 touch-manipulation tap-highlight-transparent select-none"
                            >
                                Manage Tables
                            </button>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            Real-time status of all tables in the restaurant.
                        </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-3 shrink-0">
                        {/* Summary pills */}
                        {!isLoading && !isError && tables && (
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    {availableCount} Available
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                                    {reservedCount} Reserved
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 ring-1 ring-red-200">
                                    <span className="h-2 w-2 rounded-full bg-red-400" />
                                    {occupiedCount} Occupied
                                </span>
                            </div>
                        )}
                        <button
                            onClick={() => setIsOpen(true)}
                            className="sm:hidden flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-md shadow-slate-900/20 transition-all hover:bg-slate-800 active:scale-95 touch-manipulation tap-highlight-transparent select-none"
                        >
                            Manage Tables
                        </button>
                    </div>
                </header>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto">
                    {isError ? (
                        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                            <svg className="h-8 w-8 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                            <p className="text-sm font-medium text-slate-700">Failed to load tables</p>
                            <p className="text-xs text-slate-400">{error instanceof Error ? error.message : 'Unexpected error'}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {isLoading
                                ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
                                : tables?.map(table => (
                                    <TableCard key={table.tableId} table={table} />
                                ))
                            }
                        </div>
                    )}

                    {!isLoading && !isError && tables?.length === 0 && (
                        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                            <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                            </svg>
                            <p className="text-sm font-medium text-slate-600">No tables configured</p>
                            <p className="text-xs text-slate-400">Manage tables to get started.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Management Overlay Modal */}
            <TableManagementOverlay />
        </RoleGuard>
    );
}
