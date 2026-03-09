"use client";

import { useState } from 'react';
import { RoleGuard } from '../../../components/RoleGuard';

interface SettingSection {
    id: string;
    title: string;
    description: string;
    icon: string;
}

const SECTIONS: SettingSection[] = [
    { id: 'store', title: 'Store Information', description: 'Business name, address, and operating hours', icon: '🏪' },
    { id: 'tax', title: 'Tax Configuration', description: 'Tax rates, rounding rules, and tax IDs', icon: '🧾' },
    { id: 'payment', title: 'Payment Methods', description: 'Cash, cards, and digital wallet settings', icon: '💳' },
    { id: 'receipt', title: 'Receipt Templates', description: 'Customize receipt layout and footer message', icon: '🖨️' },
    { id: 'notifications', title: 'Notifications', description: 'Alert preferences for low stock and system events', icon: '🔔' },
    { id: 'security', title: 'Security', description: 'Password policy, session timeout, and 2FA', icon: '🔒' },
];

function SettingCard({ section, isActive, onClick }: { section: SettingSection; isActive: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-4 rounded-xl border bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${isActive
                    ? 'border-slate-900 shadow-md ring-1 ring-slate-900'
                    : 'border-slate-200 shadow-sm'
                }`}
        >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-xl">
                {section.icon}
            </div>
            <div className="min-w-0">
                <h3 className="font-semibold text-slate-900">{section.title}</h3>
                <p className="mt-0.5 text-xs text-slate-400">{section.description}</p>
            </div>
            <svg className="ml-auto h-4 w-4 shrink-0 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        </button>
    );
}

function StoreSettingsPanel() {
    return (
        <div className="space-y-5">
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Store Name</label>
                <input type="text" defaultValue="POS Restaurant" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors" />
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Address</label>
                <input type="text" defaultValue="123 Le Loi Street, District 1, HCMC" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Opening Time</label>
                    <input type="time" defaultValue="08:00" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors" />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Closing Time</label>
                    <input type="time" defaultValue="22:00" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Phone</label>
                <input type="tel" defaultValue="+84 28 1234 5678" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors" />
            </div>
            <button className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0">
                Save Changes
            </button>
        </div>
    );
}

function TaxSettingsPanel() {
    return (
        <div className="space-y-5">
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Tax Rate (%)</label>
                <input type="number" defaultValue="10" min={0} max={100} step={0.5} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors" />
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Tax ID</label>
                <input type="text" defaultValue="VN-0312345678" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors" />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <div>
                    <p className="text-sm font-semibold text-slate-800">Include Tax in Price</p>
                    <p className="text-xs text-slate-400 mt-0.5">Display prices with tax already included</p>
                </div>
                <div className="h-6 w-11 rounded-full bg-emerald-500 p-0.5 cursor-pointer transition-colors">
                    <div className="h-5 w-5 rounded-full bg-white shadow-sm translate-x-5 transition-transform" />
                </div>
            </div>
            <button className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0">
                Save Changes
            </button>
        </div>
    );
}

function PlaceholderPanel({ title }: { title: string }) {
    return (
        <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
            <p className="text-sm font-medium text-slate-400">{title} settings coming soon.</p>
        </div>
    );
}

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('store');
    const active = SECTIONS.find(s => s.id === activeSection);

    const renderPanel = () => {
        switch (activeSection) {
            case 'store': return <StoreSettingsPanel />;
            case 'tax': return <TaxSettingsPanel />;
            default: return <PlaceholderPanel title={active?.title ?? 'These'} />;
        }
    };

    return (
        <RoleGuard allowedRoles={['Manager']}>
            <div className="flex h-full flex-col gap-6 p-6 lg:p-8 overflow-y-auto">
                {/* Header */}
                <header>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                        Settings
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Configure your store, taxes, payments, and system preferences.
                    </p>
                </header>

                {/* Split Layout */}
                <div className="flex flex-1 gap-6 min-h-0">
                    {/* Left - Section List */}
                    <div className="w-80 shrink-0 space-y-2 overflow-y-auto">
                        {SECTIONS.map(section => (
                            <SettingCard
                                key={section.id}
                                section={section}
                                isActive={activeSection === section.id}
                                onClick={() => setActiveSection(section.id)}
                            />
                        ))}
                    </div>

                    {/* Right - Active Panel */}
                    <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                            <span className="text-2xl">{active?.icon}</span>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">{active?.title}</h2>
                                <p className="text-xs text-slate-400">{active?.description}</p>
                            </div>
                        </div>
                        {renderPanel()}
                    </div>
                </div>
            </div>
        </RoleGuard>
    );
}
