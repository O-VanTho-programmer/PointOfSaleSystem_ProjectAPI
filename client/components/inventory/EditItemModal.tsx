"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useUpdateItem } from "@/hooks/useItems";
import { Item, ItemUploadDTO } from "@/types/Item";
import toast from "react-hot-toast";
import { ImagePreview } from "../ui/ImagePreview";
import { Loader2, X } from "lucide-react";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
}

export function EditItemModal({ isOpen, onClose, item }: EditItemModalProps) {
  const [form, setForm] = useState<ItemUploadDTO>({
    name: "",
    isSoldOut: false,
    price: 0,
    categoryId: 0,
    image: undefined,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { data: categoriesData } = useCategories(1, 100);
  const categories = categoriesData?.listPayload ?? [];
  const updateItem = useUpdateItem();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && item) {
      setForm({
        name: item.name,
        isSoldOut: item.quantityInStock <= 0,
        price: item.price,
        categoryId: item.categoryId,
        image: undefined,
      });
      setSelectedImage(null);
    }
  }, [isOpen, item]);

  const handleClose = useCallback(() => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  }, [onClose]);

  const handleChange = useCallback(
    (field: keyof ItemUploadDTO) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        if (field === "isSoldOut") {
          setForm((prev) => ({ ...prev, isSoldOut: value === "1" }));
        } else if (field === "price") {
          const n = parseFloat(value) || 0;
          setForm((prev) => ({ ...prev, price: n }));
        } else if (field === "categoryId") {
          setForm((prev) => ({
            ...prev,
            categoryId: parseInt(value, 10) || 0,
          }));
        } else if (field === "name") {
          setForm((prev) => ({ ...prev, [field]: value }));
        } else if (field === "image") {
          const target = e.target as HTMLInputElement;
          const file = target.files?.[0] || undefined;
          setForm((prev) => ({ ...prev, [field]: file }));
          setSelectedImage(file || null);
        }
      },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!item) return;

      if (!form.name.trim()) return toast.error("Name is required");
      if (form.categoryId <= 0) return toast.error("Please select a category");
      if (form.price <= 0) return toast.error("Price must be greater than 0");

      updateItem.mutate(
        { id: item.itemId, dto: form },
        {
          onSuccess: (res) => {
            if (res.success) {
              toast.success("Item updated successfully");
              handleClose();
            } else {
              toast.error(res.message ?? "Failed to update item");
            }
          },
          onError: () => {
            toast.error("Failed to update item");
          },
        }
      );
    },
    [form, updateItem, item, handleClose]
  );

  if (!isOpen || !item) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[2px] transition-opacity" onClick={handleClose} />
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl sm:max-w-lg animate-in slide-in-from-right duration-300">
        <div className="shrink-0 border-b border-slate-200 bg-linear-to-br from-slate-50 to-slate-100/80 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold tracking-tight text-slate-900">Edit Item</h2>
            <button type="button" onClick={handleClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-200/80 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
              <input type="text" value={form.name} onChange={handleChange("name")} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors text-slate-600" required />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
              <select value={form.categoryId || ""} onChange={handleChange("categoryId")} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors text-slate-600" required>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Price</label>
                <input type="number" min="0" step="0.01" value={form.price || ""} onChange={handleChange("price")} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors text-slate-600" required />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Availability</label>
                <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="0" checked={form.isSoldOut === false} onChange={handleChange("isSoldOut")} className="h-4 w-4 text-amber-500 border-slate-300 focus:ring-amber-500" />
                    <span className="text-sm text-slate-600">In stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="1" checked={form.isSoldOut === true} onChange={handleChange("isSoldOut")} className="h-4 w-4 text-amber-500 border-slate-300 focus:ring-amber-500" />
                    <span className="text-sm text-slate-600">Sold out</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Image Update <span className="text-slate-400">(optional)</span></label>
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleChange("image")} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors text-slate-600" />
              {selectedImage && (
                <div className="mt-2">
                  <ImagePreview file={selectedImage} onClear={() => {
                    setSelectedImage(null);
                    setForm(p => ({ ...p, image: undefined }));
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }} />
                </div>
              )}
              {!selectedImage && item.imageUrl && (
                <div className="mt-2 flex items-center justify-between border border-slate-200 bg-slate-50 rounded-lg p-2">
                  <span className="text-xs font-semibold text-slate-500 px-2">Current Image</span>
                  <img src={item.imageUrl} alt="Current" className="h-14 w-14 rounded-md object-cover border border-slate-200" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto flex gap-3 pt-6">
            <button type="button" onClick={handleClose} className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors text-slate-600 cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={updateItem.isPending} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50 transition-colors cursor-pointer">
              {updateItem.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
