import React, { useState, useEffect } from 'react';
import { useUpdateCategory, useCreateCategory } from '@/hooks/useCategories';
import { Category } from '@/types/Category';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface EditCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category?: Category | null;
}

export function EditCategoryModal({ isOpen, onClose, category }: EditCategoryModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const updateCategory = useUpdateCategory();
    const createCategory = useCreateCategory();

    const isEditing = !!category;
    const isPending = updateCategory.isPending || createCategory.isPending;

    useEffect(() => {
        if (isOpen) {
            if (category) {
                setName(category.name);
                setDescription(category.description ?? '');
            } else {
                setName('');
                setDescription('');
            }
        }
    }, [isOpen, category]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        const dto = { name: name.trim(), description: description.trim() || undefined };

        if (isEditing && category) {
            updateCategory.mutate({ id: category.categoryId, dto }, {
                onSuccess: () => {
                    toast.success("Category updated successfully");
                    onClose();
                },
                onError: (error) => {
                    toast.error(error.message || "Failed to update category");
                }
            });
        } else {
            createCategory.mutate(dto, {
                onSuccess: () => {
                    toast.success("Category created successfully");
                    onClose();
                },
                onError: (error) => {
                    toast.error(error.message || "Failed to create category");
                }
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
                    <h3 className="text-xl font-bold text-slate-900">
                        {isEditing ? 'Edit Category' : 'New Category'}
                    </h3>
                    <button 
                        onClick={onClose}
                        disabled={isPending}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors disabled:opacity-50"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
                    <div>
                        <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-900">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Beverages, Desserts"
                            maxLength={50}
                            disabled={isPending}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-900">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description of this category..."
                            rows={3}
                            disabled={isPending}
                            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                        />
                    </div>

                    <div className="mt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !name.trim()}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 font-semibold text-white transition-all hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                        >
                            {isPending ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : isEditing ? 'Save Changes' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
