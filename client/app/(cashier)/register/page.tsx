"use client";

import React, { useState, useCallback, useMemo } from "react";
import { MenuItemCard } from "../../../components/MenuItemCard";
import { SearchBar } from "../../../components/SearchBar";
import { OrderType } from "../../../types/OrderDTO";
import { CartSidebar } from "../../../components/CartSidebar";
import { usePosStore } from "../../../store/posStore";
import { useTables } from "@/hooks/useTables";
import { useItems } from "@/hooks/useItems";
import { Item } from "@/types/Item";
import { useCategories } from "@/hooks/useCategories";

const ORDER_TYPE_OPTIONS: { value: OrderType; label: string }[] = [
    { value: OrderType.DineIn, label: 'Dine-In' },
    { value: OrderType.TakeAway, label: 'Takeaway' },
];

export default function RegisterScreen() {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState("");

    const { data: itemsResult } = useItems();
    const menuItems = itemsResult?.listPayload || [];

    const { data: categoryResult } = useCategories();
    const categories = categoryResult?.listPayload || [];

    const filteredItems = useMemo(() => {
        let items = menuItems || [];

        if (selectedCategory !== "All") {
            items = items.filter(item => item.categoryId === Number(selectedCategory));
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            items = items.filter(item =>
                item.name.toLowerCase().includes(query)
            );
        }

        return items;
    }, [selectedCategory, searchQuery, menuItems]);

    const { addItem, order, setOrderType, setTableNumber } = usePosStore();

    const handleItemClick = useCallback((item: Item) => {
        addItem(item);
    }, [addItem]);

    const { data: tablesResult } = useTables();
    const tables = tablesResult?.listPayload || [];

    return (
        <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
            {/* Left Column: Menu Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="sticky top-0 z-10 flex shrink-0 flex-col border-b border-slate-200 bg-white shadow-sm">
                    {/* Categories and Order Type Toggle */}
                    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">

                            <button
                                onClick={() => setSelectedCategory("All")}
                                className={`
                      min-h-[48px] shrink-0 rounded-lg px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors duration-75 touch-manipulation tap-highlight-transparent select-none
                      ${selectedCategory === "All"
                                        ? "bg-slate-800 text-white shadow-sm"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300"
                                    }
                    `}
                            >
                                All
                            </button>

                            {categories.map(category => {
                                const isSelected = selectedCategory === category.categoryId.toString();
                                return (
                                    <button
                                        key={category.categoryId}
                                        onClick={() => setSelectedCategory(category.categoryId.toString())}
                                        className={`
                      min-h-[48px] shrink-0 rounded-lg px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors duration-75 touch-manipulation tap-highlight-transparent select-none
                      ${isSelected
                                                ? "bg-slate-800 text-white shadow-sm"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300"
                                            }
                    `}
                                    >
                                        {category.name}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Order Type Toggle */}
                        <div className="flex shrink-0 items-center justify-center rounded-lg bg-slate-100 p-1 ml-4 border border-slate-200">
                            {ORDER_TYPE_OPTIONS.map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => setOrderType(value)}
                                    className={`
                                        rounded-md px-4 py-2 text-sm font-bold transition-all duration-200 touch-manipulation tap-highlight-transparent select-none whitespace-nowrap
                                        ${order.orderType === value
                                            ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50'
                                            : 'text-slate-500 hover:text-slate-700'
                                        }
                                    `}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Bar Row */}
                    <div className="flex items-center px-4 pb-3 sm:px-6">
                        <div className="w-full max-w-md">
                            <SearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search menu items or SKU..."
                            />
                        </div>
                    </div>

                    {/* Table Selection Grid (renders only if Dine-In) */}
                    <div className={`
                        overflow-hidden transition-all duration-300 ease-in-out bg-slate-50/50 border-t border-slate-100 px-4 sm:px-6
                        ${order.orderType === OrderType.DineIn ? 'max-h-32 py-3 opacity-100' : 'max-h-0 py-0 opacity-0'}
                    `}>
                        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                            <span className="shrink-0 text-xs font-bold uppercase text-slate-400 tracking-wider">Select Table:</span>
                            {tables?.map(table => (
                                <button
                                    key={table.tableId}
                                    onClick={() => setTableNumber(String(table.tableId))}
                                    disabled={table.status === 'occupied'}
                                    className={`
                                        flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all border
                                        ${order.tableNumber === String(table.tableId)
                                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-110'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-500'
                                        }
                                    `}
                                >
                                    {table.tableId}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Main Grid Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ contentVisibility: 'auto' }}>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 items-stretch">
                        {filteredItems.map(item => (
                            <MenuItemCard
                                key={item.itemId}
                                item={item}
                                onClick={handleItemClick}
                            />
                        ))}
                    </div>
                </main>
            </div>

            {/* Right Column: Order Ticket Sidebar */}
            <div className="w-[30%] min-w-[320px] max-w-[480px] shrink-0 border-l border-slate-200 bg-white shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20">
                <CartSidebar />
            </div>
        </div>
    );
}
