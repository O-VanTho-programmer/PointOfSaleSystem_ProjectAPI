"use client";

import React, { useState, useCallback, useMemo } from "react";
import { MenuItemCard } from "../../../components/MenuItemCard";
import { MenuItemDTO } from "../../../types/MenuItemDTO";
import { OrderType } from "../../../types/OrderDTO";
import { CartSidebar } from "../../../components/CartSidebar";
import { usePosStore } from "../../../store/posStore";

const MOCK_MENU_ITEMS: MenuItemDTO[] = [
    {
        id: 1,
        name: "Classic Cheeseburger",
        description: "1/4 lb beef patty with american cheese, lettuce, tomato, and house sauce.",
        price: 8.99,
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
        category: "Mains"
    },
    {
        id: 2,
        name: "Double Smash Burger",
        description: "Two 4oz beef patties, double american cheese, pickles on a buttered brioche bun.",
        price: 12.99,
        stock: 30,
        imageUrl: "https://images.unsplash.com/photo-1594212202715-eeab4ac352c3?auto=format&fit=crop&q=80&w=800",
        category: "Mains"
    },
    {
        id: 3,
        name: "Crispy Chicken Sandwich",
        description: "Buttermilk fried chicken breast, spicy mayo, shredded lettuce.",
        price: 10.99,
        stock: 20,
        imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800",
        category: "Mains"
    },
    {
        id: 4,
        name: "Shoestring Fries",
        description: "Crispy thin fries tossed in sea salt.",
        price: 3.99,
        stock: 100,
        imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=800",
        category: "Sides"
    },
    {
        id: 5,
        name: "Truffle Parm Fries",
        description: "Shoestring fries tossed with white truffle oil and fresh parmesan.",
        price: 5.99,
        stock: 4,
        imageUrl: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80&w=800",
        category: "Sides"
    },
    {
        id: 6,
        name: "Vanilla Bean Shake",
        description: "Hand-spun milkshake with real vanilla bean and whole milk.",
        price: 5.49,
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800",
        category: "Drinks"
    },
    {
        id: 7,
        name: "Draft Cola",
        description: "Classic cola over ice.",
        price: 2.49,
        stock: 200,
        imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800",
        category: "Drinks"
    },
    {
        id: 8,
        name: "Cold Brew Coffee",
        description: "House blend cold-steeped for 16 hours.",
        price: 4.00,
        stock: 0,
        imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800",
        category: "Drinks"
    }
];

export default function RegisterScreen() {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const categories = useMemo(() => {
        return ["All", ...Array.from(new Set(MOCK_MENU_ITEMS.map(item => item.category!).filter(Boolean)))];
    }, []);

    const filteredItems = useMemo(() => {
        return selectedCategory === "All"
            ? MOCK_MENU_ITEMS
            : MOCK_MENU_ITEMS.filter(item => item.category === selectedCategory);
    }, [selectedCategory]);

    const { addItem, order, setOrderType, setTableNumber } = usePosStore();

    const handleItemClick = useCallback((item: MenuItemDTO) => {
        addItem(item);
    }, [addItem]);

    // Generate Mock Tables 1-10
    const TABLES = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1), []);

    return (
        <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
            {/* Left Column: Menu Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="sticky top-0 z-10 flex shrink-0 flex-col border-b border-slate-200 bg-white shadow-sm">
                    {/* Top Row: Categories and Order Type Toggle */}
                    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {categories.map(category => {
                                const isSelected = selectedCategory === category;
                                return (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`
                      min-h-[48px] shrink-0 rounded-lg px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors duration-75 touch-manipulation tap-highlight-transparent select-none
                      ${isSelected
                                                ? "bg-slate-800 text-white shadow-sm"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300"
                                            }
                    `}
                                    >
                                        {category}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Order Type Toggle */}
                        <div className="flex shrink-0 items-center justify-center rounded-lg bg-slate-100 p-1 ml-4 border border-slate-200">
                            {(['Dine-In', 'Takeaway'] as OrderType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setOrderType(type)}
                                    className={`
                                        rounded-md px-4 py-2 text-sm font-bold transition-all duration-200 touch-manipulation tap-highlight-transparent select-none whitespace-nowrap
                                        ${order.orderType === type
                                            ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50'
                                            : 'text-slate-500 hover:text-slate-700'
                                        }
                                    `}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table Selection Grid (renders only if Dine-In) */}
                    <div className={`
                        overflow-hidden transition-all duration-300 ease-in-out bg-slate-50/50 border-t border-slate-100 px-4 sm:px-6
                        ${order.orderType === 'Dine-In' ? 'max-h-32 py-3 opacity-100' : 'max-h-0 py-0 opacity-0'}
                    `}>
                        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                            <span className="shrink-0 text-xs font-bold uppercase text-slate-400 tracking-wider">Select Table:</span>
                            {TABLES.map(table => (
                                <button
                                    key={table}
                                    onClick={() => setTableNumber(table)}
                                    className={`
                                        flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all border
                                        ${order.tableNumber === table
                                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-110'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-500'
                                        }
                                    `}
                                >
                                    {table}
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
                                key={item.id}
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
