"use client";

import React, { useState } from 'react';
import { useTables } from '@/hooks/useTables';
import { RoleGuard } from '@/components/RoleGuard';
import { TableManagementOverlay } from '@/components/tables/TableManagementOverlay';
import { BookingList } from '@/components/tables/BookingList';
import { useTableManagementStore } from '@/store/tableManagementStore';
import { Table, TableStatus } from '@/types/Table';
import { useUpdateTable } from '@/hooks/useTables';
import toast from 'react-hot-toast';
import { Power, Check, X as CloseIcon } from 'lucide-react';

const STATUS_CONFIG: Record<TableStatus, { label: string; dot: string; bg: string; text: string; ring: string }> = {
    available: { label: 'Available', dot: 'bg-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
    reserved: { label: 'Reserved', dot: 'bg-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
    occupied: { label: 'Occupied', dot: 'bg-red-400', bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200' },
};

function TableCard({ table }: { table: Table }) {
    const config = STATUS_CONFIG[table.status] ?? STATUS_CONFIG.available;
    const updateTable = useUpdateTable();

    const handleToggleStatus = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent card clicks if we add them later
        
        // Determine next status
        let nextStatus: TableStatus = 'available';
        let actionName = '';
        
        switch (table.status) {
            case 'available':
                nextStatus = 'occupied';
                actionName = 'Occupied';
                break;
            case 'occupied':
            case 'reserved':
                nextStatus = 'available';
                actionName = 'Available';
                break;
        }

        const promise = updateTable.mutateAsync({
            id: table.tableId,
            dto: {
                tableId: table.tableId,
                capacity: table.capacity,
                status: nextStatus
            }
        });

        toast.promise(promise, {
            loading: `Updating table to ${actionName}...`,
            success: `Table ${table.tableId} is now ${actionName}`,
            error: `Failed to update table status`
        });
    };

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

            {/* Status badge & Quick Action */}
            <div className="flex w-full items-center justify-between mt-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${config.bg} ${config.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                    {config.label}
                </span>
                
                <button
                    onClick={handleToggleStatus}
                    disabled={updateTable.isPending}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none ${
                        table.status === 'available'
                            ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 focus:ring-emerald-400'
                            : table.status === 'occupied'
                            ? 'bg-red-100 text-red-600 hover:bg-red-200 focus:ring-red-400'
                            : 'bg-amber-100 text-amber-600 hover:bg-amber-200 focus:ring-amber-400'
                    }`}
                    title={table.status === 'available' ? 'Mark Occupied' : table.status === 'occupied' ? 'Mark Available' : 'Cancel Reservation'}
                >
                    {updateTable.isPending ? (
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : table.status === 'available' ? (
                        <Power className="h-4 w-4" strokeWidth={2.5} />
                    ) : table.status === 'occupied' ? (
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                        <CloseIcon className="h-4 w-4" strokeWidth={2.5} />
                    )}
                </button>
            </div>
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
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
                        
                        {/* View Modes Toggle */}
                        <div className="mt-6 flex w-fit rounded-lg bg-slate-100 p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-bold transition-all ${
                                    viewMode === 'grid' ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                                </svg>
                                Table Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-bold transition-all ${
                                    viewMode === 'list' ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                                Bookings List
                            </button>
                        </div>
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

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                    {viewMode === 'list' ? (
                        <BookingList />
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>

            {/* Management Overlay Modal */}
            <TableManagementOverlay />
        </RoleGuard>
    );
}
