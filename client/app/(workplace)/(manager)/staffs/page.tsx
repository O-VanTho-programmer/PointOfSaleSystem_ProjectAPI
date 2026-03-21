"use client";

import { useState } from 'react';
import { RoleGuard } from '@/components/RoleGuard';
import { useUsers } from '@/hooks/useUsers';

type Role = 'Manager' | 'Cashier' | 'Chef' | 'Waiter';

interface StaffMember {
    id: number;
    name: string;
    phone: string;
    email: string;
    role: Role;
    status: 'active' | 'off-duty';
    avatar: string;
}

const ROLE_CONFIG: Record<Role, { bg: string; text: string; ring: string }> = {
    Manager: { bg: 'bg-violet-50', text: 'text-violet-700', ring: 'ring-violet-200' },
    Cashier: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
    Chef: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
    Waiter: { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-200' },
};

export default function StaffsPage() {
    const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
    
    const { data: usersData, isLoading } = useUsers();
    
    const staffMembers: StaffMember[] = (usersData?.listPayload || []).map(u => {
        const initials = u.name ? u.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase() : 'U';
        
        let validRole: Role = 'Waiter'; // Default fallback
        if (['Manager', 'Cashier', 'Chef', 'Waiter'].includes(u.role)) {
            validRole = u.role as Role;
        }

        return {
            id: u.userId,
            name: u.name || 'Unknown User',
            phone: u.phone || 'N/A',
            email: u.email || 'N/A',
            role: validRole,
            status: 'active', // DB doesn't track shift status currently
            avatar: initials
        };
    });

    const filtered = roleFilter === 'all'
        ? staffMembers
        : staffMembers.filter(m => m.role === roleFilter);

    const activeCount = staffMembers.filter(m => m.status === 'active').length;

    return (
        <RoleGuard allowedRoles={['Manager']}>
            <div className="flex h-full flex-col gap-6 p-6 lg:p-8">
                {/* Header */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                            Staff Management
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {staffMembers.length} members · {activeCount} on shift
                        </p>
                    </div>
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setRoleFilter('all')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${roleFilter === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            All
                        </button>
                        {(Object.keys(ROLE_CONFIG) as Role[]).map(role => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${roleFilter === role ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto flex-1">
                    {filtered.map(member => {
                        const config = ROLE_CONFIG[member.role];
                        return (
                            <div
                                key={member.id}
                                className={`flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${member.status === 'off-duty' ? 'border-slate-200 opacity-60' : 'border-slate-200'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-mono text-sm font-black ${config.bg} ${config.text} ring-2 ${config.ring}`}>
                                        {member.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-slate-900 truncate">{member.name}</h3>
                                            <span className={`h-2 w-2 rounded-full shrink-0 ${member.status === 'active' ? 'bg-emerald-400' : 'bg-slate-300'
                                                }`} />
                                        </div>
                                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider mt-0.5 ${config.bg} ${config.text}`}>
                                            {member.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1.5 border-t border-slate-100 pt-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                        </svg>
                                        <span className="font-mono text-xs">{member.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                        <span className="text-xs truncate">{member.email}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {isLoading && (
                        <div className="col-span-full flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-slate-900"></div>
                                <p className="text-sm font-medium text-slate-500">Loading team members...</p>
                            </div>
                        </div>
                    )}
                    
                    {!isLoading && filtered.length === 0 && (
                        <div className="col-span-full flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                            <p className="text-sm font-medium text-slate-400">No team members match this filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </RoleGuard>
    );
}
