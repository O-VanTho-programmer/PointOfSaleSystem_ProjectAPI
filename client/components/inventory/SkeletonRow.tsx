export function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            <td className="px-5 py-4"><div className="h-4 w-8 rounded bg-slate-200" /></td>
            <td className="px-5 py-4"><div className="h-4 w-36 rounded bg-slate-200" /></td>
            <td className="px-5 py-4"><div className="h-4 w-16 rounded bg-slate-200" /></td>
            <td className="px-5 py-4"><div className="h-4 w-20 rounded bg-slate-200" /></td>
            <td className="px-5 py-4"><div className="h-5 w-20 rounded-full bg-slate-200" /></td>
            <td className="px-5 py-4"><div className="h-4 w-14 rounded bg-slate-200" /></td>
        </tr>
    );
}
