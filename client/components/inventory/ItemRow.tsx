'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Item } from '../../types/Item';

const STATUS_CONFIG = {
    inStock: { label: 'In Stock', dot: 'bg-emerald-400', bg: 'bg-emerald-400/10', text: 'text-emerald-700' },
    lowStock: { label: 'Low Stock', dot: 'bg-amber-400', bg: 'bg-amber-400/10', text: 'text-amber-700' },
    outOfStock: { label: 'Out of Stock', dot: 'bg-red-400', bg: 'bg-red-400/10', text: 'text-red-600' },
} as const;

function getStockStatus(qty: number) {
    if (qty <= 0) return STATUS_CONFIG.outOfStock;
    if (qty <= 10) return STATUS_CONFIG.lowStock;
    return STATUS_CONFIG.inStock;
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

interface ItemRowProps {
    item: Item;
    index: number;
    onEdit?: (item: Item) => void;
    onRemove?: (item: Item) => void;
}

export function ItemRow({ item, index, onEdit, onRemove }: ItemRowProps) {
    const status = getStockStatus(item.quantityInStock);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    return (
        <tr
            className="group border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/80"
            style={{ animationDelay: `${index * 30}ms` }}
        >
            <td className="px-5 py-4 font-mono text-xs text-slate-400">
                #{String(item.itemId).padStart(3, '0')}
            </td>
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-9 w-9 rounded-lg object-cover ring-1 ring-slate-200"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-slate-100 to-slate-200 ring-1 ring-slate-200">
                            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                            </svg>
                        </div>
                    )}
                    <span className="font-medium text-slate-800">{item.name}</span>
                </div>
            </td>
            <td className="px-5 py-4 font-mono text-sm text-slate-700 tabular-nums">
                {item.quantityInStock}
            </td>
            <td className="px-5 py-4 font-mono text-sm font-medium text-slate-800 tabular-nums">
                {formatCurrency(item.price)}
            </td>
            <td className="px-5 py-4">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                </span>
            </td>
            <td className="px-5 py-4 font-mono text-xs text-slate-400">
                {item.categoryId}
            </td>
            <td className="px-5 py-4">
                <div className="relative" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setMenuOpen(prev => !prev)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 z-20 mt-1 w-36 origin-top-right rounded-lg border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5 animate-in fade-in">
                            <button
                                type="button"
                                onClick={() => { onEdit?.(item); setMenuOpen(false); }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                <Pencil className="h-3.5 w-3.5 text-slate-400" />
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => { onRemove?.(item); setMenuOpen(false); }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                            >
                                <Trash2 className="h-3.5 w-3.5 text-red-400" />
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
}
