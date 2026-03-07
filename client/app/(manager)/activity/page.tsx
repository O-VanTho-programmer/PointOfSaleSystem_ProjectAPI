"use client";

import { RoleGuard } from '../../../components/RoleGuard';

export default function ActivityLogsPage() {
    return (
        <RoleGuard allowedRoles={['Manager']}>
            <div className="flex h-full flex-col p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Activity Logs</h1>
                    <p className="mt-2 text-slate-500">System audit trail and employee actions.</p>
                </header>
                <div className="flex-1 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                    <span className="text-slate-400 font-medium">Activity Logs module placeholder</span>
                </div>
            </div>
        </RoleGuard>
    );
}
