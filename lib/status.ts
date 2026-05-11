import type {
  PhaseStatus,
  ProjectStatus,
  RiskLevel,
} from "@/lib/types";

/**
 * Status → Tailwind class tokens. The badge variant maps to background + text + ring.
 * The dot variant maps to a small solid swatch.
 */

export const phaseStatusBadge: Record<PhaseStatus, string> = {
  Done: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "In Progress": "bg-blue-50 text-blue-700 ring-blue-200",
  "At Risk": "bg-amber-50 text-amber-800 ring-amber-200",
  Delayed: "bg-red-50 text-red-700 ring-red-200",
  Pending: "bg-slate-100 text-slate-600 ring-slate-200",
};

export const phaseStatusDot: Record<PhaseStatus, string> = {
  Done: "bg-emerald-500",
  "In Progress": "bg-blue-500",
  "At Risk": "bg-amber-500",
  Delayed: "bg-red-500",
  Pending: "bg-slate-400",
};

export const phaseStatusBar: Record<PhaseStatus, string> = {
  Done: "bg-emerald-500",
  "In Progress": "bg-blue-500",
  "At Risk": "bg-amber-500",
  Delayed: "bg-red-500",
  Pending: "bg-slate-300",
};

export const phaseStatusBarText: Record<PhaseStatus, string> = {
  Done: "text-white",
  "In Progress": "text-white",
  "At Risk": "text-white",
  Delayed: "text-white",
  Pending: "text-slate-600",
};

export const projectStatusBadge: Record<ProjectStatus, string> = {
  Planning: "bg-slate-100 text-slate-700 ring-slate-200",
  "In Development": "bg-blue-50 text-blue-700 ring-blue-200",
  "UAT Env": "bg-amber-50 text-amber-800 ring-amber-200",
  "Production Env": "bg-violet-50 text-violet-700 ring-violet-200",
  Live: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "On Hold": "bg-slate-100 text-slate-500 ring-slate-200",
  Cancelled: "bg-red-50 text-red-700 ring-red-200",
};

export const riskBadge: Record<RiskLevel, string> = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Medium: "bg-amber-50 text-amber-800 ring-amber-200",
  High: "bg-orange-50 text-orange-700 ring-orange-200",
  Critical: "bg-red-50 text-red-700 ring-red-200",
};

export const riskDot: Record<RiskLevel, string> = {
  Low: "bg-emerald-500",
  Medium: "bg-amber-500",
  High: "bg-orange-500",
  Critical: "bg-red-500",
};

/** Utilization % → cell color for the resource heatmap. */
export function heatmapCell(util: number): string {
  if (util >= 110) return "bg-red-500 text-white";
  if (util >= 95) return "bg-orange-400 text-white";
  if (util >= 80) return "bg-amber-300 text-amber-900";
  if (util >= 60) return "bg-emerald-200 text-emerald-900";
  if (util >= 30) return "bg-emerald-100 text-emerald-800";
  return "bg-slate-100 text-slate-500";
}
