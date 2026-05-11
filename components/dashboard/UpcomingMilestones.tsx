import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, Dot } from "@/components/ui/Badge";
import { phaseStatusBadge, phaseStatusDot } from "@/lib/status";
import { phases, getProject } from "@/lib/data";
import { daysFromToday, fmtShort } from "@/lib/date";

export function UpcomingMilestones() {
  const upcoming = phases
    .filter((p) => p.category === "Milestone" || p.name === "Go Live" || p.name === "UAT Push" || p.name === "Pre-Production")
    .map((p) => ({ p, dt: daysFromToday(p.latestEndDate) }))
    .filter((x) => x.dt >= -3 && x.dt <= 21)
    .sort((a, b) => a.dt - b.dt)
    .slice(0, 7);

  return (
    <Card>
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            <CalendarClock size={16} className="text-indigo-600" />
            Upcoming Milestones
          </span>
        }
        subtitle="Next three weeks"
      />
      <ul className="-mx-2 divide-y divide-slate-100">
        {upcoming.map(({ p, dt }) => {
          const proj = getProject(p.projectId);
          return (
            <li key={p.id}>
              <Link
                href={`/projects/${p.projectId}`}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-slate-50"
              >
                <div className="flex w-12 shrink-0 flex-col items-center rounded-md bg-slate-50 px-1 py-1 text-center">
                  <span className="text-[10px] font-medium uppercase text-slate-500">
                    {fmtShort(p.latestEndDate).split(" ")[0]}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {fmtShort(p.latestEndDate).split(" ")[1]}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {p.name}
                  </div>
                  <div className="muted truncate">
                    {proj?.name} · {proj?.pic}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={phaseStatusBadge[p.status]}>
                    <Dot className={phaseStatusDot[p.status]} />
                    {p.status}
                  </Badge>
                  <span
                    className={`text-[11px] ${
                      dt < 0 ? "text-red-600" :
                      dt <= 3 ? "text-amber-600" : "text-slate-500"
                    }`}
                  >
                    {dt < 0 ? `${Math.abs(dt)}d overdue` : dt === 0 ? "today" : `in ${dt}d`}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
