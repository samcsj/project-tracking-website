import { BarChart3, FileBarChart, Gauge, TrendingUp } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";

export const metadata = { title: "Reports · PTS" };

const REPORTS = [
  {
    icon: TrendingUp,
    title: "Delivery Velocity",
    desc: "Phases completed per sprint across all brands, with trailing 8-week trend.",
  },
  {
    icon: Gauge,
    title: "On-Time Delivery",
    desc: "Share of projects that hit their target live date, broken down by brand and type.",
  },
  {
    icon: BarChart3,
    title: "QA Throughput",
    desc: "Tickets opened, closed, and reopened per week. Flags rising blocked counts.",
  },
  {
    icon: FileBarChart,
    title: "Resource Utilization",
    desc: "Per-discipline utilization vs capacity over the trailing quarter.",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="h1">Reports</h1>
        <p className="muted mt-1">
          Production analytics. Click any report to drill in.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {REPORTS.map((r) => {
          const Icon = r.icon;
          return (
            <Card key={r.title} className="hover:shadow-pop transition cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{r.title}</div>
                  <div className="muted mt-0.5">{r.desc}</div>
                </div>
              </div>
              <div className="mt-4 h-24 rounded-lg bg-gradient-to-tr from-slate-100 to-slate-50" />
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader title="Custom Report Builder" subtitle="Coming soon" />
        <p className="muted">
          Compose ad-hoc reports from any combination of brand, project type, phase status, PIC, and date range.
        </p>
      </Card>
    </div>
  );
}
