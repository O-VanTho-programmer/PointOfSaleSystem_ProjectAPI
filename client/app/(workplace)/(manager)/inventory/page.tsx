"use client";

import { useMemo, useState } from 'react';
import { RoleGuard } from '@/components/RoleGuard';
import { useItems } from '@/hooks/useItems';
import { useCategories } from '@/hooks/useCategories';
import { SkeletonRow } from '@/components/inventory/SkeletonRow';
import { ItemRow } from '@/components/inventory/ItemRow';
import { Pagination } from '@/components/inventory/Pagination';
import { InventoryManage } from '@/components/inventory/InventoryManage';

const PAGE_SIZE = 8;

export default function InventoryPage() {
    const [page, setPage] = useState(1);
    const [isManageOpen, setIsManageOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<number>(0);
    const { data, isLoading, isError, error } = useItems(page, PAGE_SIZE);
    const { data: categoriesData } = useCategories(1, 200);

    const items = data?.listPayload ?? [];
    const categories = categoriesData?.listPayload ?? [];
    const totalPages = data?.totalPages ?? 0;
    const totalElement = data?.totalElement ?? 0;

    const filteredItems = useMemo(() => {
        if (!categoryFilter) return items;
        return items.filter(i => i.categoryId === categoryFilter);
    }, [items, categoryFilter]);

    return (
        <RoleGuard allowedRoles={['Manager']}>
            <div className="flex h-full flex-col gap-6 p-6 lg:p-8">
                <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                            Inventory
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {totalElement > 0
                                ? `${totalElement} items across all categories`
                                : 'Manage your product catalog and stock levels'}
                        </p>
                    </div>
                    <div className="mt-4 flex flex-col gap-3 sm:mt-0 sm:flex-row sm:items-end">
                        <div className="min-w-[220px]">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Filter by category
                            </label>
                            <select
                                value={categoryFilter || ""}
                                onChange={(e) => setCategoryFilter(parseInt(e.target.value, 10) || 0)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                            >
                                <option value="">All categories</option>
                                {categories.map((c) => (
                                    <option key={c.categoryId} value={c.categoryId}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsManageOpen(true)}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Inventory Manage
                        </button>
                    </div>
                </header>

                <InventoryManage isOpen={isManageOpen} onClose={() => setIsManageOpen(false)} />

                <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/60">
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">ID</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Stock</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Cat ID</th>
                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center w-16">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    Array.from({ length: PAGE_SIZE }).map((_, i) => (
                                        <SkeletonRow key={i} />
                                    ))
                                ) : isError ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-16 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <svg className="h-8 w-8 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                </svg>
                                                <p className="text-sm font-medium text-slate-700">Failed to load inventory</p>
                                                <p className="text-xs text-slate-400">
                                                    {error instanceof Error ? error.message : 'Unexpected error'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : items.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-16 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                                </svg>
                                                <p className="text-sm font-medium text-slate-600">No items found</p>
                                                <p className="text-xs text-slate-400">Items will appear here once added.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item, i) => (
                                        <ItemRow key={item.itemId} item={item} index={i} />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!isLoading && !isError && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            totalElement={totalElement}
                            onPageChange={setPage}
                        />
                    )}
                </div>
            </div>
        </RoleGuard>
    );
}