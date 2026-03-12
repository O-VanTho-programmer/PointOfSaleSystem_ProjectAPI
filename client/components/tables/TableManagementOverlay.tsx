"use client";

import React, { useEffect } from "react";
import { X, CheckCircle2, Calendar, Square } from "lucide-react";
import { useTableManagementStore } from "@/store/tableManagementStore";
import { TableForm } from "./TableForm";
import { ReservationForm } from "./ReservationForm";
import { useCreateTable } from "@/hooks/useTables";
import { useCreateReservation } from "@/hooks/useReservations";

export function TableManagementOverlay() {
    const { isOpen, mode, setMode, setIsOpen } = useTableManagementStore();
    
    // We import these hooks just to track pending statuses for the footer buttons.
    // The actual mutation logic remains inside the respective modular form components.
    const createTableMutation = useCreateTable();
    const createReservationMutation = useCreateReservation();
    const isPending = mode === "table" ? createTableMutation.isPending : createReservationMutation.isPending;

    const onClose = () => setIsOpen(false);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end px-4 sm:px-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300">
            {/* Backdrop click dismiss */}
            <div className="absolute inset-0" onClick={onClose} />
            
            {/* Modal Panel Container */}
            <div className="relative flex h-full max-h-[90vh] sm:max-h-full w-full max-w-md flex-col overflow-hidden rounded-3xl sm:rounded-none sm:rounded-l-3xl bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] animate-in slide-in-from-bottom-8 sm:slide-in-from-right-full">
                
                {/* Header Section */}
                <div className="shrink-0 border-b border-slate-100 bg-white px-6 pt-6 pb-4">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
                                {mode === "table" ? <Square className="h-5 w-5" strokeWidth={2.5} /> : <Calendar className="h-5 w-5" strokeWidth={2.5} />}
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                {mode === "table" ? "New Table" : "Book Reservation"}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-full bg-slate-50 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none transition-colors"
                        >
                            <X className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Segmented Control */}
                    <div className="flex rounded-xl bg-slate-100 p-1">
                        <button
                            onClick={() => setMode("table")}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition-all ${
                                mode === "table" ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            Configure Table
                        </button>
                        <button
                            onClick={() => setMode("reservation")}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition-all ${
                                mode === "reservation" ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                            }`}
                        >
                            Reservation
                        </button>
                    </div>
                </div>

                {/* Form Scrollable Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                    {mode === "table" ? <TableForm /> : <ReservationForm />}
                </div>

                {/* Footer Actions */}
                <div className="shrink-0 border-t border-slate-100 bg-white p-6">
                    <button
                        type="submit"
                        form={mode === "table" ? "table-form" : "res-form"}
                        disabled={isPending}
                        className={`
                            flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold text-white shadow-lg transition-all focus:outline-none focus:ring-4
                            ${mode === "table" 
                                ? "bg-slate-900 shadow-slate-900/20 hover:bg-slate-800 focus:ring-slate-900/20" 
                                : "bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-400 focus:ring-emerald-500/20"
                            }
                            disabled:opacity-50 disabled:pointer-events-none
                        `}
                    >
                        {mode === "table" ? (
                            isPending ? "Creating..." : <><CheckCircle2 className="h-5 w-5" /> Create Table</>
                        ) : (
                            isPending ? "Booking..." : <><Calendar className="h-5 w-5" /> Book Reservation</>
                        )}
                    </button>
                    <p className="mt-4 text-center text-xs font-medium text-slate-400">
                        Changes are immediately saved to the system.
                    </p>
                </div>
            </div>
        </div>
    );
}
