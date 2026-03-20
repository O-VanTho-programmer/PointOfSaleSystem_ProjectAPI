import React from 'react'

interface DateRangePickerProps {
    startDate: string | undefined;
    endDate: string | undefined;
    setDateRange: React.Dispatch<React.SetStateAction<{ startDate: string, endDate: string }>>;
}

export default function DateRangePicker({ startDate, endDate, setDateRange }: DateRangePickerProps) {
    return (
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <input
                type="date"
                title="Start Date"
                value={startDate ? startDate.split('T')[0] : ''}
                onChange={(e) => {
                    if (e.target.value) {
                        setDateRange(prev => ({
                            ...prev,
                            startDate: `${e.target.value}T00:00:00.000`
                        }));
                    }
                }}
                className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none focus:ring-0 cursor-pointer"
            />
            <span className="text-slate-300 font-medium px-1">&rarr;</span>
            <input
                type="date"
                title="End Date"
                value={endDate ? endDate.split('T')[0] : ''}
                onChange={(e) => {
                    if (e.target.value) {
                        setDateRange(prev => ({
                            ...prev,
                            endDate: `${e.target.value}T23:59:59.999`
                        }));
                    }
                }}
                className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none focus:ring-0 cursor-pointer"
            />
        </div>
    )
}