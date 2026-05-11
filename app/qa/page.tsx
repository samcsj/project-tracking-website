import Link from "next/link";
import { ShieldAlert, ShieldCheck, Bug } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, Dot } from "@/components/ui/Badge";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { jiraSummaries, projects, getProject } from "@/lib/data";
import { riskBadge, riskDot } from "@/lib/status";

export const metadata = { title: "QA Monitoring · PTS" };

export default function QaPage() {
  const totalOpen      = jiraSummaries.reduce((a, b) => a + b.open, 0);
  const totalBlocked   = jiraSummaries.reduce((a, b) => a + b.blocked, 0);
  const totalInProg    = jiraSummaries.reduce((a, b) => a + b.inProgress, 0);

  const bottlenecks = jiraSummaries
    .map((j) => ({ ...j, project: getProject(j.projectId)! }))
    .sort((a, b) => b.blocked + b.open - (a.blocked + a.open))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="h1">QA Monitoring</h1>
        <p className="muted mt-1">
          Pipeline health, blocked tickets, and projects backing up in QA.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard label="Open Tickets"     value={totalOpen}    icon={Bug}        tone="warning" />
        <KpiCard label="In Progress"      value={totalInProg}  icon={ShieldCheck} tone="neutral" />
        <KpiCard label="Blocked Tickets"  value={totalBlocked} icon={ShieldAlert} tone="danger"  />
      </section>

      <Card>
        <CardHeader
          title="QA Bottlenecks"
          subtitle="Projects with the largest open + blocked load"
        />
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Open</th>
                <th>In Progress</th>
                <th>Blocked</th>
                <th>Done</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {bottlenecks.map((b) => (
                <tr key={b.projectId}>
                  <td>
                    <Link href={`/projects/${b.projectId}`} className="font-medium text-slate-900 hover:text-indigo-600">
                      {b.project.name}
                    </Link>
                    <div className="muted">{b.project.currentPhase}</div>
                  </td>
                  <td>{b.open}</td>
                  <td>{b.inProgress}</td>
                  <td className={b.blocked > 0 ? "font-semibold text-red-600" : ""}>{b.blocked}</td>
                  <td className="text-slate-500">{b.done}</td>
                  <td>
                    <Badge className={riskBadge[b.project.riskLevel]}>
                      <Dot className={riskDot[b.project.riskLevel]} />
                      {b.project.riskLevel}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

void projects;
