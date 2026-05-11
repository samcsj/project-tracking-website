import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  Rocket,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RiskAlertPanel } from "@/components/dashboard/RiskAlertPanel";
import { UpcomingMilestones } from "@/components/dashboard/UpcomingMilestones";
import { StatusOverviewChart } from "@/components/dashboard/StatusOverviewChart";
import { jiraSummaries, phases, projects } from "@/lib/data";
import { daysFromToday } from "@/lib/date";
import type { ProjectStatus } from "@/lib/types";

export default function DashboardPage() {
  const activeProjects = projects.filter(
    (p) => p.status !== "Live" && p.status !== "Cancelled" && p.status !== "On Hold"
  ).length;

  const delayedMilestones = phases.filter(
    (p) => p.status === "Delayed" || (p.status === "At Risk" && p.category === "Milestone")
  ).length;

  const qaLoad =
    jiraSummaries.reduce((acc, j) => acc + j.open + j.inProgress + j.blocked, 0);

  const productionThisMonth = projects.filter((p) => {
    const d = daysFromToday(p.targetLiveDate);
    return d >= -7 && d <= 30;
  }).length;

  const statusBuckets = Object.entries(
    projects.reduce<Record<string, number>>((acc, p) => {
      acc[p.status] = (acc[p.status] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name as ProjectStatus, value }));

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="h1">Production Command Center</h1>
          <p className="muted mt-1">
            Real-time view of every live, in-development, and at-risk project across all brands.
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div>Today</div>
          <div className="font-medium text-slate-700">Mon, May 11 2026</div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Active Projects"
          value={activeProjects}
          hint="In development, UAT, or production"
          icon={Activity}
          tone="neutral"
          delta={{ value: "+2 wk/wk", positive: true }}
        />
        <KpiCard
          label="Delayed Milestones"
          value={delayedMilestones}
          hint="Across all active phases"
          icon={AlertOctagon}
          tone="danger"
          delta={{ value: "+3", positive: false }}
        />
        <KpiCard
          label="QA Load"
          value={qaLoad}
          hint="Open + in-progress + blocked tickets"
          icon={CheckCircle2}
          tone="warning"
          delta={{ value: "-8", positive: true }}
        />
        <KpiCard
          label="Production This Month"
          value={productionThisMonth}
          hint="Targeting live within ±30 days"
          icon={Rocket}
          tone="success"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <RiskAlertPanel />
          <UpcomingMilestones />
        </div>
        <div>
          <StatusOverviewChart data={statusBuckets} />
        </div>
      </section>
    </div>
  );
}
