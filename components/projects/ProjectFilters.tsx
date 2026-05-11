"use client";

import { Filter, X } from "lucide-react";
import type { ProjectStatus, RiskLevel } from "@/lib/types";
import { brands, allPics } from "@/lib/data";

export interface FiltersState {
  brand: string;
  status: ProjectStatus | "";
  pic: string;
  risk: RiskLevel | "";
}

export function ProjectFilters({
  value,
  onChange,
  total,
  filtered,
}: {
  value: FiltersState;
  onChange: (v: FiltersState) => void;
  total: number;
  filtered: number;
}) {
  const set = (patch: Partial<FiltersState>) => onChange({ ...value, ...patch });
  const isDirty = value.brand || value.status || value.pic || value.risk;

  return (
    <div className="card card-pad flex flex-wrap items-end gap-3">
      <div className="flex items-center gap-2 pr-2 text-slate-600">
        <Filter size={14} />
        <span className="text-xs font-medium uppercase tracking-wide">Filters</span>
      </div>
      <Select
        label="Brand"
        value={value.brand}
        onChange={(v) => set({ brand: v })}
        options={[{ value: "", label: "All brands" }, ...brands.map((b) => ({ value: b.id, label: b.name }))]}
      />
      <Select
        label="Status"
        value={value.status}
        onChange={(v) => set({ status: v as ProjectStatus | "" })}
        options={[
          { value: "", label: "All statuses" },
          ...(["Planning","In Development","UAT Env","Production Env","Live","On Hold","Cancelled"] as ProjectStatus[]).map((s) => ({ value: s, label: s })),
        ]}
      />
      <Select
        label="PIC"
        value={value.pic}
        onChange={(v) => set({ pic: v })}
        options={[{ value: "", label: "All PICs" }, ...allPics.map((p) => ({ value: p, label: p }))]}
      />
      <Select
        label="Risk"
        value={value.risk}
        onChange={(v) => set({ risk: v as RiskLevel | "" })}
        options={[
          { value: "", label: "All risk" },
          ...(["Low","Medium","High","Critical"] as RiskLevel[]).map((r) => ({ value: r, label: r })),
        ]}
      />
      <div className="ml-auto flex items-center gap-3">
        <span className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filtered}</span> of {total}
        </span>
        {isDirty ? (
          <button
            className="btn-ghost"
            onClick={() => onChange({ brand: "", status: "", pic: "", risk: "" })}
          >
            <X size={13} /> Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <select
        className="input min-w-[10rem]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
