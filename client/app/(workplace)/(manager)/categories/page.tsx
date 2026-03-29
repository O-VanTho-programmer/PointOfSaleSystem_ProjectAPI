"use client";

import { useState } from 'react';
import { RoleGuard } from '@/components/RoleGuard';
import { useCategories, useDeleteCategory } from '@/hooks/useCategories';
import { Pagination } from '@/components/inventory/Pagination';
import { SkeletonRow } from '@/components/inventory/SkeletonRow';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EditCategoryModal } from '@/components/category/EditCategoryModal';
import { Category } from '@/types/Category';
import { Edit2, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const PAGE_SIZE = 10;

export default function CategoryManagementPage() {
    const [page, setPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

    const { data, isLoading, isError, error } = useCategories(page, PAGE_SIZE);
    const deleteCategory = useDeleteCategory();

    const categories = data?.listPayload ?? [];
    const totalPages = data?.totalPages ?? 0;
    const totalElement = data?.totalElement ?? 0;

    const confirmDelete = () => {
        if (!deletingCategory) return;
        deleteCategory.mutate(deletingCategory.categoryId, {
            onSuccess: (res) => {
                if (res.success) {
                    toast.success("Category deleted successfully");
                    setDeletingCategory(null);
                } else {
                    toast.error(res.message ?? "Failed to delete category");
                }
            },
            onError: () => toast.error("An error occurred while deleting the category")
        });
    };

    return (
        <RoleGuard allowedRoles={['Manager']}>
            <div className="flex h-full flex-col gap-6 p-6 lg:p-8">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                            Category Management
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {totalElement > 0
                                ? `${totalElement} categories in the system`
                                : 'Manage your menu categories'}
                        </p>
                    </div>
                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        >
                            <Plus className="h-5 w-5" />
                            New Category
                        </button>
                    </div>
                </header>

                <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/60">
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">ID</th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center w-28">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    Array.from({ length: Math.min(PAGE_SIZE, 5) }).map((_, i) => (
                                        <SkeletonRow key={i} />
                                    ))
                                ) : isError ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-16 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="rounded-full bg-red-50 p-3">
                                                    <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-medium text-slate-700">Failed to load categories</p>
                                                <p className="text-xs text-slate-500">
                                                    {error instanceof Error ? error.message : 'Unexpected error'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-16 text-center">
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                                </svg>
                                                <p className="mt-2 text-sm font-medium text-slate-600">No categories found</p>
                                                <p className="text-xs">Click "New Category" to create one.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.categoryId} className="group border-b border-slate-100 transition-colors hover:bg-slate-50 last:border-0">
                                            <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-medium text-slate-500">
                                                #{category.categoryId}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">
                                                {category.name}
                                            </td>
                                            <td className="px-5 py-4 text-slate-600 truncate max-w-xs">
                                                {category.description || <span className="text-slate-400 italic">No description</span>}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                                                    <button
                                                        onClick={() => setEditingCategory(category)}
                                                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors tooltip"
                                                        title="Edit Category"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingCategory(category)}
                                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors tooltip"
                                                        title="Delete Category"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!isLoading && !isError && totalPages > 1 && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            totalElement={totalElement}
                            onPageChange={setPage}
                        />
                    )}
                </div>

                <EditCategoryModal
                    isOpen={isCreateModalOpen || !!editingCategory}
                    onClose={() => {
                        setIsCreateModalOpen(false);
                        setEditingCategory(null);
                    }}
                    category={editingCategory}
                />

                <ConfirmModal
                    isOpen={!!deletingCategory}
                    onClose={() => setDeletingCategory(null)}
                    onConfirm={confirmDelete}
                    title="Delete Category"
                    description={`Are you sure you want to delete "${deletingCategory?.name}"? This will fail if items are currently assigned to it.`}
                    confirmText="Yes, delete it"
                    isDestructive={true}
                    isLoading={deleteCategory.isPending}
                />
            </div>
        </RoleGuard>
    );
}
