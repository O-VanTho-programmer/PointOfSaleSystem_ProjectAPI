"use client";

import { useCallback, useMemo, useState } from "react";
import { useCategories, useCreateCategory } from "@/hooks/useCategories";
import { useCreateItem } from "@/hooks/useItems";
import { ItemUploadDTO } from "@/types/Item";
import { CategoryUploadDTO } from "@/types/Category";
import toast from "react-hot-toast";

const DEFAULT_ITEM_FORM: ItemUploadDTO = {
  name: "",
  isSoldOut: 0,
  price: 0,
  imageUrl: "",
  categoryId: 0,
};

const DEFAULT_CATEGORY_FORM: CategoryUploadDTO = {
  name: "",
  description: "",
};

interface InventoryManageProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InventoryManage({ isOpen, onClose }: InventoryManageProps) {
  const [mode, setMode] = useState<"item" | "category">("item");
  const [itemForm, setItemForm] = useState<ItemUploadDTO>(DEFAULT_ITEM_FORM);
  const [categoryForm, setCategoryForm] =
    useState<CategoryUploadDTO>(DEFAULT_CATEGORY_FORM);
  const { data: categoriesData } = useCategories(1, 100);
  const createItem = useCreateItem();
  const createCategory = useCreateCategory();

  const categories = categoriesData?.listPayload ?? [];

  const canSubmit = useMemo(() => {
    if (mode === "item") {
      return (
        itemForm.name.trim().length > 0 &&
        itemForm.categoryId > 0 &&
        itemForm.price > 0
      );
    }
    return categoryForm.name.trim().length > 0;
  }, [mode, itemForm, categoryForm]);

  const handleItemSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!itemForm.name.trim()) {
        toast.error("Name is required");
        return;
      }
      if (itemForm.categoryId <= 0) {
        toast.error("Please select a category");
        return;
      }
      if (itemForm.price <= 0) {
        toast.error("Price must be greater than 0");
        return;
      }

      createItem.mutate(
        {
          ...itemForm,
          imageUrl: itemForm.imageUrl?.trim() || undefined,
        },
        {
          onSuccess: (res) => {
            if (res.success) {
              toast.success(res.message ?? "Item created");
              setItemForm(DEFAULT_ITEM_FORM);
              onClose();
            } else {
              toast.error(res.message ?? "Failed to create item");
            }
          },
          onError: () => {
            toast.error("Failed to create item");
          },
        }
      );
    },
    [itemForm, createItem, onClose]
  );

  const handleCategorySubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!categoryForm.name.trim()) {
        toast.error("Category name is required");
        return;
      }

      createCategory.mutate(
        {
          name: categoryForm.name.trim(),
          description: categoryForm.description?.trim() || undefined,
        },
        {
          onSuccess: () => {
            toast.success("Category created");
            setCategoryForm(DEFAULT_CATEGORY_FORM);
            setMode("item");
          },
          onError: () => {
            toast.error("Failed to create category");
          },
        }
      );
    },
    [categoryForm, createCategory]
  );

  const handleItemChange = useCallback(
    (field: keyof ItemUploadDTO) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        if (field === "isSoldOut") {
          setItemForm((prev) => ({ ...prev, isSoldOut: value === "1" ? 1 : 0 }));
        } else if (field === "price") {
          const n = parseFloat(value) || 0;
          setItemForm((prev) => ({ ...prev, price: n }));
        } else if (field === "categoryId") {
          setItemForm((prev) => ({
            ...prev,
            categoryId: parseInt(value, 10) || 0,
          }));
        } else if (field === "name" || field === "imageUrl") {
          setItemForm((prev) => ({ ...prev, [field]: value }));
        }
      },
    []
  );

  const handleCategoryChange = useCallback(
    (field: keyof CategoryUploadDTO) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setCategoryForm((prev) => ({ ...prev, [field]: value }));
      },
    []
  );

  if (!isOpen) return null;

  const isBusy = createItem.isPending || createCategory.isPending;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[2px] transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl sm:max-w-lg"
        role="dialog"
        aria-labelledby="inventory-manage-title"
      >
        <div className="shrink-0 border-b border-slate-200 bg-linear-to-br from-slate-50 to-slate-100/80 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2
              id="inventory-manage-title"
              className="font-semibold tracking-tight text-slate-900"
            >
              Inventory Manage
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200/80 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div
              className="flex w-full items-center rounded-xl bg-white/70 p-1 ring-1 ring-slate-200 backdrop-blur"
              role="tablist"
              aria-label="Create mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "item"}
                onClick={() => setMode("item")}
                className={[
                  "flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition-all",
                  mode === "item"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100/80",
                ].join(" ")}
              >
                Create Item
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "category"}
                onClick={() => setMode("category")}
                className={[
                  "flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition-all",
                  mode === "category"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100/80",
                ].join(" ")}
              >
                Create Category
              </button>
            </div>
          </div>
        </div>

        <form
          onSubmit={mode === "item" ? handleItemSubmit : handleCategorySubmit}
          className="flex flex-1 flex-col overflow-y-auto px-6 py-6"
        >
          <div className="flex flex-col gap-5">
            {mode === "item" ? (
              <>
                <div>
                  <label
                    htmlFor="item-name"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Name
                  </label>
                  <input
                    id="item-name"
                    type="text"
                    value={itemForm.name}
                    onChange={handleItemChange("name")}
                    placeholder="e.g. Espresso"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-end justify-between gap-3">
                    <label
                      htmlFor="item-category"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode("category")}
                      className="mb-1.5 text-xs font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
                    >
                      + New category
                    </button>
                  </div>
                  <select
                    id="item-category"
                    value={itemForm.categoryId || ""}
                    onChange={handleItemChange("categoryId")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="item-price"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Price
                    </label>
                    <input
                      id="item-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={itemForm.price || ""}
                      onChange={handleItemChange("price")}
                      placeholder="0.00"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Availability
                    </label>
                    <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="isSoldOut"
                          value="0"
                          checked={itemForm.isSoldOut === 0}
                          onChange={handleItemChange("isSoldOut")}
                          className="h-4 w-4 border-slate-300 text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-sm text-slate-700">In stock</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="isSoldOut"
                          value="1"
                          checked={itemForm.isSoldOut === 1}
                          onChange={handleItemChange("isSoldOut")}
                          className="h-4 w-4 border-slate-300 text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-sm text-slate-700">Sold out</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="item-image"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Image URL <span className="text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="item-image"
                    type="url"
                    value={itemForm.imageUrl ?? ""}
                    onChange={handleItemChange("imageUrl")}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="category-name"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Category name
                  </label>
                  <input
                    id="category-name"
                    type="text"
                    value={categoryForm.name}
                    onChange={handleCategoryChange("name")}
                    placeholder="e.g. Beverages"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="category-description"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Description <span className="text-slate-400">(optional)</span>
                  </label>
                  <textarea
                    id="category-description"
                    value={categoryForm.description ?? ""}
                    onChange={handleCategoryChange("description")}
                    placeholder="Short note for staff (optional)"
                    rows={4}
                    className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-slate-900 p-2 text-white">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6m0 6h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Tip
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                        Create categories first so item creation stays fast and
                        consistent.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-auto flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || isBusy}
              className={[
                "flex-1 cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60",
                mode === "item"
                  ? "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
                  : "bg-slate-900 hover:bg-slate-800 focus:ring-slate-900",
              ].join(" ")}
            >
              {isBusy
                ? "Working…"
                : mode === "item"
                  ? "Create Item"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
