import type { PhaseStatus } from "@/lib/types";
import { phaseStatusBar } from "@/lib/status";

const STATUSES: PhaseStatus[] = ["Done", "In Progress", "At Risk", "Delayed", "Pending"];

export function GanttLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
      {STATUSES.map((s) => (
        <span key={s} className="inline-flex items-center gap-1.5">
          <span className={`h-2.5 w-3.5 rounded-sm ${phaseStatusBar[s]}`} />
          {s}
        </span>
      ))}
      <span className="ml-2 inline-flex items-center gap-1.5">
        <span className="h-3 w-px bg-indigo-500" />
        Today
      </span>
    </div>
  );
}
