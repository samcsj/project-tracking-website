"use client";

import { useMemo, useState } from "react";
import { GanttChart } from "@/components/timeline/GanttChart";
import { GanttLegend } from "@/components/timeline/GanttLegend";
import { brands, phases, projects } from "@/lib/data";

export function TimelineClient() {
  const [brand, setBrand] = useState<string>("");
  const filtered = useMemo(
    () => (brand ? projects.filter((p) => p.brandId === brand) : projects),
    [brand]
  );

  return (
    <div className="space-y-4">
      <div className="card card-pad flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          Brand
          <select
            className="input min-w-[12rem]"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="">All brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </label>
        <div className="ml-auto">
          <GanttLegend />
        </div>
      </div>

      <GanttChart
        projects={filtered}
        phases={phases}
        rangeStart="2026-02-01"
        rangeEnd="2026-09-30"
        today="2026-05-11"
      />
    </div>
  );
}
