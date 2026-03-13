import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChefHat, LayoutGrid, BarChart3, Clock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-200">
      {/* Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
              <LayoutGrid strokeWidth={2.5} className="h-4 w-4" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">TouchPOS</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-600 transition-colors hover:text-slate-900">
              Sign In
            </Link>
            <Link href="/register" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-md shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-slate-900/20">
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden items-center justify-center flex flex-col px-6 text-center">
        {/* Background Decor */}
        <div className="absolute top-0 -translate-y-12 lg:-translate-y-24 left-1/2 -translate-x-1/2 w-full max-w-3xl aspect-square rounded-full bg-gradient-to-tr from-emerald-100/40 via-blue-50/40 to-slate-100/40 blur-3xl -z-10" />

        <div className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Now available for seamless service
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-6 duration-700">
          Run your restaurant <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">beautifully.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          A lightning-fast, highly intuitive Point of Sale system tailored for modern culinary teams. Manage tables, blast through orders, and perfectly sync front-of-house with the kitchen.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
          <Link href="/register" className="group flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 text-base font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1 hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/30">
            Place Orders
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Metric Strip */}
        <div className="mt-20 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 max-w-5xl mx-auto border-t border-slate-200/60 pt-10 px-6 sm:px-0">
          <Metric title="Lightning Fast" desc="Sub-second order syncing" icon={Clock} />
          <Metric title="Table Mapping" desc="Live floor awareness" icon={LayoutGrid} />
          <Metric title="Kitchen Flow" desc="Streamlined KDS tickets" icon={ChefHat} />
          <Metric title="Deep Insights" desc="Real-time analytics" icon={BarChart3} />
        </div>
      </section>
    </div>
  );
}

function Metric({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) {
  return (
    <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-sm border border-slate-200/60">
        <Icon strokeWidth={2.5} className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-sm font-medium text-slate-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
