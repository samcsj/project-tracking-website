"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  KanbanSquare,
  GanttChartSquare,
  Table2,
  Users,
  ShieldCheck,
  BarChart3,
  RefreshCw,
  Settings,
  Boxes,
} from "lucide-react";

const nav = [
  { href: "/",            label: "Dashboard",     icon: LayoutDashboard },
  { href: "/projects",    label: "Projects",      icon: KanbanSquare },
  { href: "/master-view", label: "Master View",   icon: Table2 },
  { href: "/timeline",    label: "Timeline",      icon: GanttChartSquare },
  { href: "/resources",   label: "Resources",     icon: Users },
  { href: "/qa",          label: "QA Monitoring", icon: ShieldCheck },
  { href: "/reports",     label: "Reports",       icon: BarChart3 },
  { href: "/jira-logs",   label: "Jira Sync Logs",icon: RefreshCw },
  { href: "/settings",    label: "Settings",      icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-slate-200">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <Boxes size={18} />
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">PTS</div>
          <div className="text-[11px] text-slate-500 leading-tight">
            Production Command Center
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "nav-item-active" : ""}`}
            >
              <Icon size={16} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-700">
            SC
          </div>
          <div className="text-xs leading-tight">
            <div className="font-medium text-slate-800">Sam Chow</div>
            <div className="text-slate-500">Production Ops</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
