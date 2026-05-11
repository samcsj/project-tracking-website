import type { Phase } from "@/lib/types";
import { Badge, Dot } from "@/components/ui/Badge";
import { phaseStatusBadge, phaseStatusDot } from "@/lib/status";
import { fmtShort } from "@/lib/date";

export function PhaseList({ phases }: { phases: Phase[] }) {
  return (
    <ol className="relative space-y-3 pl-5">
      <span className="absolute left-2 top-2 bottom-2 w-px bg-slate-200" />
      {phases.map((p) => (
        <li key={p.id} className="relative">
          <span
            className={`absolute -left-3.5 top-2 h-2.5 w-2.5 rounded-full ring-2 ring-white ${phaseStatusDot[p.status]}`}
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-900">{p.name}</span>
            <span className="chip">{p.function}</span>
            <Badge className={phaseStatusBadge[p.status]}>
              <Dot className={phaseStatusDot[p.status]} />
              {p.status}
            </Badge>
          </div>
          <div className="muted mt-0.5">
            {fmtShort(p.latestStartDate)} → {fmtShort(p.latestEndDate)}
            {p.actualEndDate ? ` · actual end ${fmtShort(p.actualEndDate)}` : ""}
          </div>
        </li>
      ))}
    </ol>
  );
}
