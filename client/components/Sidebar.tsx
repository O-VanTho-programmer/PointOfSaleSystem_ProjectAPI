"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Settings,
    Users,
    Package,
    ClipboardList,
    Coffee,
    UtensilsCrossed,
    LogOut,
    UserCircle
} from 'lucide-react';
import { UserRole } from '../models/User';
import { useAuthStore } from '@/store/authStore';

const NAV_ITEMS = [
    // Cashier Role
    { role: 'Cashier', label: 'Register', href: '/register', icon: Coffee },
    { role: 'Cashier', label: 'Orders', href: '/orders', icon: ClipboardList },

    // Chef Role
    { role: 'Chef', label: 'Kitchen Display', href: '/kds', icon: UtensilsCrossed },

    // Manager Role 
    { role: 'Manager', label: 'Activity Logs', href: '/activity', icon: LayoutDashboard },
    { role: 'Manager', label: 'Sales Reports', href: '/reports', icon: ClipboardList },
    { role: 'Manager', label: 'Team', href: '/teams', icon: Users },
    { role: 'Manager', label: 'Inventory', href: '/inventory', icon: Package },
    { role: 'Manager', label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const { user, isAuthenticated } = useAuthStore();

    const pathname = usePathname();
    // Mock role state toggle for development/testing
    const [role, setRole] = useState<UserRole>(user?.role || 'Cashier');

    // Also include Manager routes if role is manager, but for a real app, Managers usually see everything or Cashiers only see Cashier stuff.
    // Here we explicitly filter by the exact role just for this mock toggle feature to be clear.
    const visibleNavItems = NAV_ITEMS.filter(item => item.role === role || role === 'Manager');

    return (
        <aside className="flex h-screen w-[15%] min-w-[200px] max-w-[280px] flex-col bg-slate-900 text-slate-300 transition-all duration-300">
            {/* Brand Header */}
            <div className="flex h-16 shrink-0 items-center justify-center border-b border-slate-800 bg-slate-950 px-6">
                <span className="font-serif text-2xl font-bold tracking-wider text-white">POS</span>
            </div>

            {/* Role Toggle (Development Only feature embedded into the UI profile section) */}
            <div className="flex flex-col gap-2 border-b border-slate-800 p-4">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                    <UserCircle className="h-5 w-5 text-emerald-500" />
                    <span className="font-medium text-slate-200">Current Role</span>
                </div>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="mt-1 w-full rounded-md border-0 bg-slate-800 py-1.5 pl-3 pr-8 text-sm text-white focus:ring-2 focus:ring-emerald-500"
                >
                    <option value="Cashier">Cashier</option>
                    <option value="Chef">Chef</option>
                    <option value="Manager">Manager</option>
                </select>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-hide">
                {visibleNavItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                ${isActive
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'hover:bg-slate-800 hover:text-white'
                                }
              `}
                        >
                            <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-white'}`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer System Actions */}
            <div className="shrink-0 border-t border-slate-800 p-4">
                <Link
                    href="/login"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </Link>
            </div>
        </aside>
    );
}
