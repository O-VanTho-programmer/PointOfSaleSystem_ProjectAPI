"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";

export default function WorkplaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Workplace Layout handles the main application shell (Sidebar + strict flex constraints)
    // and hides overflowing content to keep the application feeling like an app rather than a scrolling website.
    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50">
            {/* Global Persistent Sidebar Navigation */}
            <Sidebar />

            {/* Main Application Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {children}
            </div>
        </div>
    );
}
