import React from 'react';
import { useReservations, useUpdateReservation, useDeleteReservation } from '@/hooks/useReservations';
import { useTables } from '@/hooks/useTables';
import { Calendar, Clock, Users, Square, User, XCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function BookingList() {
    const { data: reservationsResult, isLoading: resLoading, isError: resError } = useReservations();
    const { data: tablesResult, isLoading: tabLoading } = useTables();
    
    // Safety check map for Table Capacities
    const tables = tablesResult?.listPayload || [];
    const tableCapacityMap = new Map(tables.map(t => [t.tableId, t.capacity]));

    const reservations = reservationsResult?.listPayload || [];
    
    // Sort reservations by Date then Time (closest first)
    const sortedReservations = [...reservations].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) return dateA - dateB;
        
        // If same date, sort by time string
        return a.time.localeCompare(b.time);
    });

    const deleteMutation = useDeleteReservation();

    const handleCancelReservation = async (id: number) => {
        if (!confirm("Are you sure you want to cancel this reservation?")) return;
        
        toast.promise(deleteMutation.mutateAsync(id), {
            loading: 'Canceling reservation...',
            success: 'Reservation canceled successfully',
            error: 'Failed to cancel reservation'
        });
    };

    if (resLoading || tabLoading) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-4">
                <svg className="h-8 w-8 animate-spin text-emerald-500" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm font-medium text-slate-500 animate-pulse">Loading schedule...</p>
            </div>
        );
    }

    if (resError) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-red-200 bg-red-50">
                <XCircle className="h-8 w-8 text-red-400" />
                <p className="text-sm font-bold text-red-700">Failed to load reservations</p>
            </div>
        );
    }

    if (sortedReservations.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                <Calendar className="h-10 w-10 text-slate-300" strokeWidth={1.5} />
                <p className="text-sm font-medium text-slate-600">No active bookings</p>
                <p className="text-xs text-slate-400">Upcoming reservations will appear here.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-bold">Customer</th>
                            <th className="px-6 py-4 font-bold">Date & Time</th>
                            <th className="px-6 py-4 font-bold">Table</th>
                            <th className="px-6 py-4 font-bold">Guests / Cap</th>
                            <th className="px-6 py-4 font-bold">Notes</th>
                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sortedReservations.map((res) => {
                            const dateObj = new Date(res.date);
                            const formattedDate = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                            
                            // Try to format time from ISO if possible, or leave as string
                            let formattedTime = res.time;
                            try {
                                const t = new Date(res.time);
                                if (!isNaN(t.getTime())) {
                                    formattedTime = t.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                                }
                            } catch { /* ignore */ }

                            const capacity = tableCapacityMap.get(res.tableId) || "?";
                            const isOverCapacity = typeof capacity === 'number' && res.numberOfPeople > capacity;

                            return (
                                <tr key={res.reservationId} className="group transition-colors hover:bg-slate-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                                <User className="h-4 w-4" strokeWidth={2.5} />
                                            </div>
                                            <span className="font-bold text-slate-900">{res.customerName}</span>
                                        </div>
                                    </td>
                                    
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                {formattedDate}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                                {formattedTime}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-sm font-bold text-slate-700">
                                            <Square className="h-3.5 w-3.5 text-slate-400" />
                                            T-{res.tableId}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${isOverCapacity ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                                                <Users className="h-3.5 w-3.5" />
                                                {res.numberOfPeople} 
                                                <span className="opacity-50">/ {capacity}</span>
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 max-w-[200px] truncate text-slate-500">
                                        {res.note}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleCancelReservation(res.reservationId)}
                                            className="inline-flex items-center justify-center rounded-lg bg-white p-2 text-slate-400 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-red-50 hover:text-red-600 hover:ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            title="Cancel Booking"
                                        >
                                            <XCircle className="h-4 w-4" strokeWidth={2.5} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
