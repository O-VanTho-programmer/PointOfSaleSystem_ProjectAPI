"use client";

import { RoleGuard } from '../../../components/RoleGuard';

export default function TeamsPage() {
    return (
        <RoleGuard allowedRoles={['Manager']}>
            <div className="flex h-full flex-col p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Team Management</h1>
                    <p className="mt-2 text-slate-500">Manage employee accounts, roles, and shifts.</p>
                </header>
                <div className="flex-1 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                    <span className="text-slate-400 font-medium">Teams Management module placeholder</span>
                </div>
            </div>
        </RoleGuard>
    );
}
