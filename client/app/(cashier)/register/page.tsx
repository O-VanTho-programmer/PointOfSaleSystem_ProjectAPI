"use client";

import React, { useState, useCallback, useMemo } from "react";
import { MenuItemCard } from "../../../components/MenuItemCard";
import { MenuItemDTO } from "../../../types/MenuItemDTO";
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

    const { addItem } = usePosStore();

    const handleItemClick = useCallback((item: MenuItemDTO) => {
        addItem(item);
    }, [addItem]);

    return (
        <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
            {/* Left Column: Menu Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header / Category Tabs */}
                <header className="sticky top-0 z-10 flex shrink-0 items-center overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6 scrollbar-hide">
                    <div className="flex w-full gap-2">
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
