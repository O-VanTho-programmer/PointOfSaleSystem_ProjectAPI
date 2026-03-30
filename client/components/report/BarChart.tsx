import { useMemo } from "react";

export default function BarChart({ data }: { data: { label: string; value: number }[] }) {
    const max = useMemo(() => Math.max(...data.map(d => d.value), 0), [data]);

    return (
        <div className="flex items-end gap-1.5 h-40" role="img" aria-label="Orders chart">
            {data.map((d) => {
                const heightPct = max > 0 ? (d.value / max) * 100 : 0;
                return (
                    <div key={d.label} className="group flex flex-1 flex-col items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
                            {d.value}
                        </span>
                        <div
                            className="w-full rounded-t-md bg-emerald-400 transition-all duration-300 group-hover:bg-emerald-500"
                            style={{ height: `${heightPct}%`, minHeight: d.value > 0 ? '4px' : '0px' }}
                        />
                        <span className="text-[9px] font-medium text-slate-400 truncate w-full text-center" title={d.label}>
                            {d.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}