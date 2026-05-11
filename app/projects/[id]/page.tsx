import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";
import {
  getProject,
  getBrand,
  getPhases,
  getJiraSummary,
  getRiskNotes,
  getChangeLog,
  projects,
} from "@/lib/data";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, Dot } from "@/components/ui/Badge";
import {
  projectStatusBadge,
  riskBadge,
  riskDot,
} from "@/lib/status";
import { PhaseList } from "@/components/project-detail/PhaseList";
import { DateComparisonTable } from "@/components/project-detail/DateComparisonTable";
import { JiraSummary } from "@/components/project-detail/JiraSummary";
import { RiskNotesPanel } from "@/components/project-detail/RiskNotesPanel";
import { fmtDate } from "@/lib/date";
import { format, parseISO } from "date-fns";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = getProject(params.id);
  if (!project) notFound();
  const brand = getBrand(project.brandId);
  const phases = getPhases(project.id);
  const jira = getJiraSummary(project.id);
  const notes = getRiskNotes(project.id);
  const history = getChangeLog(project.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <Link href="/projects" className="inline-flex items-center gap-1 hover:text-slate-900">
          <ArrowLeft size={14} /> Projects
        </Link>
        <span>/</span>
        <span className="text-slate-700">{brand?.name}</span>
        <span>/</span>
        <span className="text-slate-900">{project.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="h1">{project.name}</h1>
                  <span className="chip">{project.type}</span>
                </div>
                <p className="muted mt-1">
                  {brand?.name} · Owned by {brand?.owner} · PIC {project.pic}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={projectStatusBadge[project.status]}>{project.status}</Badge>
                <Badge className={riskBadge[project.riskLevel]}>
                  <Dot className={riskDot[project.riskLevel]} />
                  {project.riskLevel} risk
                </Badge>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4">
              <Stat label="Target Live Date" value={fmtDate(project.targetLiveDate)} />
              <Stat label="Current Phase" value={project.currentPhase} />
              <Stat label="Phases" value={`${phases.filter((p) => p.status === "Done").length}/${phases.length} done`} />
              <Stat label="Active Risks" value={String(notes.length)} />
            </dl>
          </Card>

          <Card>
            <CardHeader title="Phase & Milestone Plan" subtitle="All 11 stages with status, owner, and dates" />
            <PhaseList phases={phases} />
          </Card>

          <Card>
            <CardHeader title="Date Comparison" subtitle="Expected vs latest vs actual — variance from expected" />
            <DateComparisonTable phases={phases} />
          </Card>

          {jira ? <JiraSummary summary={jira} /> : null}

          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <History size={15} className="text-slate-500" /> Change History
                </span>
              }
              subtitle="Recent edits to dates, status, and risk"
            />
            {history.length === 0 ? (
              <div className="muted">No recorded changes yet.</div>
            ) : (
              <ul className="space-y-2 text-sm">
                {history.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-[11px] text-slate-400">
                      {format(parseISO(c.at), "MMM d, HH:mm")}
                    </span>
                    <span className="font-medium text-slate-700">{c.author}</span>
                    <span className="text-slate-500">changed</span>
                    <span className="chip">{c.field}</span>
                    <span className="text-slate-500">from</span>
                    <span className="text-slate-700">{c.from}</span>
                    <span className="text-slate-500">to</span>
                    <span className="font-medium text-slate-900">{c.to}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <aside>
          <RiskNotesPanel project={project} notes={notes} />
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}
