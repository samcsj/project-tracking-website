"use client";

import { Filter, EyeOff, RotateCcw } from "lucide-react";
import { allPics, brands } from "@/lib/data";
import {
  DATE_TYPES,
  DATE_TYPE_LABEL,
  FIELD_TYPES,
  FIELD_TYPE_LABEL,
  type DateType,
  type FieldType,
  type MasterViewConfig,
  type MasterViewProjectFilters,
  type MilestoneDefinition,
  type PhaseDefinition,
} from "@/lib/master-view";
import type {
  FunctionTeam,
  ProjectStatus,
  ProjectType,
  RiskLevel,
} from "@/lib/types";

const PROJECT_TYPES: ProjectType[] = ["Game", "Feature", "Campaign"];
const TEAMS: FunctionTeam[] = ["Art", "Animation", "Sound", "Frontend", "Engine", "QA", "Product"];
const PROJECT_STATUSES: ProjectStatus[] = [
  "Planning", "In Development", "UAT Env", "Production Env", "Live", "On Hold", "Cancelled",
];
const RISK_LEVELS: RiskLevel[] = ["Low", "Medium", "High", "Critical"];

export function MasterViewFilters({
  config,
  onChange,
  phaseDefs,
  milestoneDefs,
  total,
  filtered,
}: {
  config: MasterViewConfig;
  onChange: (next: MasterViewConfig) => void;
  phaseDefs: PhaseDefinition[];
  milestoneDefs: MilestoneDefinition[];
  total: number;
  filtered: number;
}) {
  const setProjectFilters = (patch: Partial<MasterViewProjectFilters>) =>
    onChange({ ...config, projectFilters: { ...config.projectFilters, ...patch } });

  const toggleSet = <T,>(set: Set<T>, value: T): Set<T> => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  const togglePhase = (name: string) =>
    onChange({ ...config, visiblePhases: toggleSet(config.visiblePhases, name) });

  const toggleMilestone = (name: string) =>
    onChange({ ...config, visibleMilestones: toggleSet(config.visibleMilestones, name) });

  const toggleDateType = (dt: DateType) =>
    onChange({ ...config, visibleDateTypes: toggleSet(config.visibleDateTypes, dt) });

  const toggleField = (f: FieldType) =>
    onChange({ ...config, visibleFields: toggleSet(config.visibleFields, f) });

  const setAllPhases = (visible: boolean) =>
    onChange({
      ...config,
      visiblePhases: new Set(visible ? phaseDefs.map((d) => d.name) : []),
    });

  const setAllMilestones = (visible: boolean) =>
    onChange({
      ...config,
      visibleMilestones: new Set(visible ? milestoneDefs.map((d) => d.name) : []),
    });

  const resetAll = () =>
    onChange({
      visiblePhases: new Set(phaseDefs.map((d) => d.name)),
      visibleMilestones: new Set(milestoneDefs.map((d) => d.name)),
      visibleDateTypes: new Set(DATE_TYPES),
      visibleFields: new Set(FIELD_TYPES),
      projectFilters: {
        type: "", brand: "", team: "", pic: "", status: "", health: "",
      },
    });

  const f = config.projectFilters;

  return (
    <div className="card card-pad space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex items-center gap-2 pr-2 text-slate-600">
          <Filter size={14} />
          <span className="text-xs font-medium uppercase tracking-wide">Project filters</span>
        </div>
        <Select
          label="Type"
          value={f.type}
          onChange={(v) => setProjectFilters({ type: v as ProjectType | "" })}
          options={[{ value: "", label: "All types" }, ...PROJECT_TYPES.map((t) => ({ value: t, label: t }))]}
        />
        <Select
          label="Brand"
          value={f.brand}
          onChange={(v) => setProjectFilters({ brand: v })}
          options={[{ value: "", label: "All brands" }, ...brands.map((b) => ({ value: b.id, label: b.name }))]}
        />
        <Select
          label="Team"
          value={f.team}
          onChange={(v) => setProjectFilters({ team: v as FunctionTeam | "" })}
          options={[{ value: "", label: "All teams" }, ...TEAMS.map((t) => ({ value: t, label: t }))]}
        />
        <Select
          label="PIC"
          value={f.pic}
          onChange={(v) => setProjectFilters({ pic: v })}
          options={[{ value: "", label: "All PICs" }, ...allPics.map((p) => ({ value: p, label: p }))]}
        />
        <Select
          label="Status"
          value={f.status}
          onChange={(v) => setProjectFilters({ status: v as ProjectStatus | "" })}
          options={[{ value: "", label: "All statuses" }, ...PROJECT_STATUSES.map((s) => ({ value: s, label: s }))]}
        />
        <Select
          label="Health"
          value={f.health}
          onChange={(v) => setProjectFilters({ health: v as RiskLevel | "" })}
          options={[{ value: "", label: "All health" }, ...RISK_LEVELS.map((r) => ({ value: r, label: r }))]}
        />
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-800">{filtered}</span> of {total}
          </span>
          <button className="btn-ghost" onClick={resetAll}>
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ToggleGroup
          title="Phases"
          items={phaseDefs.map((d) => d.name)}
          visible={config.visiblePhases}
          onToggle={togglePhase}
          onShowAll={() => setAllPhases(true)}
          onHideAll={() => setAllPhases(false)}
        />
        <ToggleGroup
          title="Milestones"
          items={milestoneDefs.map((d) => d.name)}
          visible={config.visibleMilestones}
          onToggle={toggleMilestone}
          onShowAll={() => setAllMilestones(true)}
          onHideAll={() => setAllMilestones(false)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ChipGroup
          title="Date types"
          items={DATE_TYPES.map((d) => ({ value: d, label: DATE_TYPE_LABEL[d] }))}
          visible={config.visibleDateTypes}
          onToggle={(v) => toggleDateType(v as DateType)}
        />
        <ChipGroup
          title="Fields"
          items={FIELD_TYPES.map((f) => ({ value: f, label: FIELD_TYPE_LABEL[f] }))}
          visible={config.visibleFields}
          onToggle={(v) => toggleField(v as FieldType)}
        />
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
        className="input min-w-[9rem]"
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

function ToggleGroup({
  title,
  items,
  visible,
  onToggle,
  onShowAll,
  onHideAll,
}: {
  title: string;
  items: string[];
  visible: Set<string>;
  onToggle: (name: string) => void;
  onShowAll: () => void;
  onHideAll: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </span>
        <div className="flex items-center gap-2">
          <button type="button" className="text-[11px] text-indigo-600 hover:underline" onClick={onShowAll}>
            Show all
          </button>
          <span className="text-slate-300">·</span>
          <button type="button" className="text-[11px] text-slate-500 hover:underline" onClick={onHideAll}>
            <span className="inline-flex items-center gap-1"><EyeOff size={11} /> Hide all</span>
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((name) => {
          const on = visible.has(name);
          return (
            <button
              key={name}
              type="button"
              onClick={() => onToggle(name)}
              className={
                on
                  ? "rounded-full border border-indigo-300 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                  : "rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-500 line-through decoration-slate-300"
              }
            >
              {name}
            </button>
          );
        })}
        {items.length === 0 ? (
          <span className="text-xs text-slate-400">No {title.toLowerCase()} defined.</span>
        ) : null}
      </div>
    </div>
  );
}

function ChipGroup({
  title,
  items,
  visible,
  onToggle,
}: {
  title: string;
  items: { value: string; label: string }[];
  visible: Set<string>;
  onToggle: (value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const on = visible.has(item.value);
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onToggle(item.value)}
              className={
                on
                  ? "rounded-md border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                  : "rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-500"
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
