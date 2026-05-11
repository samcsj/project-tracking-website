"use client";

import { Bell, Command, Plus, Search } from "lucide-react";

export function TopBar() {
  return (
    <div className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/80 px-6 backdrop-blur">
      <div className="relative max-w-md flex-1">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          className="input pl-9 pr-16"
          placeholder="Search projects, phases, people…"
        />
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
          <Command size={10} /> K
        </span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button className="btn-outline">
          <Plus size={14} /> New Project
        </button>
        <button
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell size={15} />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
      </div>
    </div>
  );
}
