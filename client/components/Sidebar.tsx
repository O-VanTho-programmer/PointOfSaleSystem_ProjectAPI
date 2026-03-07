"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Settings,
    Users,
    Package,
    ClipboardList,
    Coffee,
    UtensilsCrossed,
    LogOut,
    UserCircle,
    Utensils
} from 'lucide-react';
import { UserRole } from '../models/User';
import { useAuthStore } from '@/store/authStore';

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    allowedRoles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
    // Cashier & Waiter workspace
    { label: 'Register', href: '/register', icon: Coffee, allowedRoles: ['Cashier', 'Waiter', 'Manager'] },
    { label: 'Orders', href: '/orders', icon: ClipboardList, allowedRoles: ['Cashier', 'Waiter', 'Manager'] },

    // Chef workspace
    { label: 'Kitchen Display', href: '/kds', icon: UtensilsCrossed, allowedRoles: ['Chef'] },

    // Manager workspace
    { label: 'Activity Logs', href: '/activity', icon: LayoutDashboard, allowedRoles: ['Manager'] },
    { label: 'Sales Reports', href: '/reports', icon: ClipboardList, allowedRoles: ['Manager'] },
    { label: 'Team', href: '/teams', icon: Users, allowedRoles: ['Manager'] },
    { label: 'Inventory', href: '/inventory', icon: Package, allowedRoles: ['Manager'] },
    { label: 'Settings', href: '/settings', icon: Settings, allowedRoles: ['Manager'] },
];

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const visibleNavItems = NAV_ITEMS.filter(item =>
        user?.role ? item.allowedRoles.includes(user.role) : false
    );

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <aside className="flex h-screen w-[15%] min-w-[200px] max-w-[280px] flex-col bg-slate-900 text-slate-300 transition-all duration-300">
            {/* Brand Header */}
            <div className="flex h-16 shrink-0 items-center justify-center border-b border-slate-800 bg-slate-950 px-6">
                <span className="font-serif text-2xl font-bold tracking-wider text-white">POS</span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 border-b border-slate-800 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <UserCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-100">
                        {user?.name || user?.phone || 'Staff'}
                    </p>
                    <p className="text-xs font-medium uppercase tracking-wider text-emerald-500">
                        {user?.role || '—'}
                    </p>
                </div>
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

            {/* Logout */}
            <div className="shrink-0 border-t border-slate-800 p-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 touch-manipulation"
                >
                    <LogOut className="h-5 w-5" />
                    End Shift &amp; Log Out
                </button>
            </div>
        </aside>
    );
}
