import { AlertTriangle } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { ResourceHeatmap } from "@/components/resources/ResourceHeatmap";
import { workload } from "@/lib/data";
import { weeksOfCurrentMonth } from "@/lib/date";

export const metadata = { title: "Resources · PTS" };

export default function ResourcesPage() {
  const weeks = weeksOfCurrentMonth();
  const labels = weeks.map((w) => w.label);

  const overloaded = workload.flatMap((r) =>
    r.weeks
      .map((u, i) => ({ role: r.role, week: labels[i], util: u }))
      .filter((c) => c.util >= 100)
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="h1">Resource Workload</h1>
        <p className="muted mt-1">
          Team utilization for the current month. Cells turn warm as a discipline approaches capacity.
        </p>
      </header>

      <ResourceHeatmap rows={workload} weeks={labels} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Legend" subtitle="Utilization color scale" />
          <ul className="space-y-2 text-sm">
            {[
              { label: "< 30% · idle",     cls: "bg-slate-100 text-slate-500" },
              { label: "30–59% · healthy", cls: "bg-emerald-100 text-emerald-800" },
              { label: "60–79% · busy",    cls: "bg-emerald-200 text-emerald-900" },
              { label: "80–94% · stretched",cls: "bg-amber-300 text-amber-900" },
              { label: "95–109% · at cap", cls: "bg-orange-400 text-white" },
              { label: "110%+ · overloaded",cls: "bg-red-500 text-white" },
            ].map((s) => (
              <li key={s.label} className="flex items-center gap-3">
                <span className={`inline-flex h-7 w-12 items-center justify-center rounded-md text-xs font-semibold ${s.cls}`}>
                  %
                </span>
                <span className="text-slate-700">{s.label}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-500" /> Overloaded Weeks
              </span>
            }
            subtitle="Anything at 100%+ utilization this month"
          />
          {overloaded.length === 0 ? (
            <div className="muted">No overloads — team has headroom this month.</div>
          ) : (
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {overloaded.map((o) => (
                <li
                  key={`${o.role}-${o.week}`}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-800">{o.role}</div>
                    <div className="muted">{o.week}</div>
                  </div>
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${o.util >= 110 ? "bg-red-500 text-white" : "bg-orange-400 text-white"}`}>
                    {o.util}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
