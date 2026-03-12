import React from "react";
import { toast } from "react-hot-toast";
import { Square, Users, User, Calendar, Clock } from "lucide-react";
import { InputField } from "@/components/InputField";
import { useTableManagementStore } from "@/store/tableManagementStore";
import { useCreateReservation } from "@/hooks/useReservations";

export function ReservationForm() {
    const {
        resTableId, resName, resGuests, resDate, resTime, resNote,
        setReservationField, resetReservationForm, setIsOpen
    } = useTableManagementStore();
    
    const createReservation = useCreateReservation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!resTableId || !resName || !resGuests || !resDate || !resTime) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const tId = parseInt(resTableId, 10);
        const guestsNum = parseInt(resGuests, 10);

        if (isNaN(tId) || tId <= 0) return toast.error("Invalid Table ID.");
        if (isNaN(guestsNum) || guestsNum <= 0) return toast.error("Invalid number of guests.");

        const isoDate = new Date(resDate).toISOString();
        
        const promise = createReservation.mutateAsync({
            tableId: tId,
            customerName: resName,
            numberOfPeople: guestsNum,
            date: isoDate,
            time: resTime,
            note: resNote || "No note",
        });

        toast.promise(promise, {
            loading: 'Booking reservation...',
            success: 'Reservation confirmed!',
            error: (err) => `Error: ${err?.message || 'Failed to book reservation'}`
        });

        try {
            await promise;
            resetReservationForm();
            setIsOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form id="res-form" onSubmit={handleSubmit} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="grid grid-cols-2 gap-4">
                <InputField
                    label="Table Number"
                    icon={Square}
                    type="number"
                    min="1"
                    placeholder="10"
                    value={resTableId}
                    onChange={(e) => setReservationField("resTableId", e.target.value)}
                    autoFocus
                />
                <InputField
                    label="Total Guests"
                    icon={Users}
                    type="number"
                    min="1"
                    placeholder="2"
                    value={resGuests}
                    onChange={(e) => setReservationField("resGuests", e.target.value)}
                />
            </div>

            <InputField
                label="Customer Name"
                icon={User}
                type="text"
                placeholder="John Doe"
                value={resName}
                onChange={(e) => setReservationField("resName", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
                <InputField
                    label="Date"
                    icon={Calendar}
                    type="date"
                    value={resDate}
                    onChange={(e) => setReservationField("resDate", e.target.value)}
                />
                <InputField
                    label="Time"
                    icon={Clock}
                    type="time"
                    value={resTime}
                    onChange={(e) => setReservationField("resTime", e.target.value)}
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Add Note (Optional)</label>
                <textarea
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold text-slate-800 placeholder:font-medium placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-400/10 transition-all resize-none"
                    rows={3}
                    placeholder="Special occasion, dietary requirements..."
                    value={resNote}
                    onChange={(e) => setReservationField("resNote", e.target.value)}
                />
            </div>
        </form>
    );
}
