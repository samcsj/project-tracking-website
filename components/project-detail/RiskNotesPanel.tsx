import type { Project, RiskNote } from "@/lib/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, Dot } from "@/components/ui/Badge";
import { riskBadge, riskDot } from "@/lib/status";
import { format, parseISO } from "date-fns";
import { AlertTriangle, MessageSquarePlus } from "lucide-react";

export function RiskNotesPanel({
  project,
  notes,
}: {
  project: Project;
  notes: RiskNote[];
}) {
  return (
    <div className="sticky top-20 space-y-4">
      <Card>
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-red-500" />
              Risk & Notes
            </span>
          }
          subtitle={`Overall risk: `}
          actions={
            <Badge className={riskBadge[project.riskLevel]}>
              <Dot className={riskDot[project.riskLevel]} />
              {project.riskLevel}
            </Badge>
          }
        />
        <ul className="space-y-3">
          {notes.length === 0 ? (
            <li className="muted">No risk notes filed.</li>
          ) : (
            notes.map((n) => (
              <li key={n.id} className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700">{n.author}</span>
                  <span>{format(parseISO(n.at), "MMM d, HH:mm")}</span>
                </div>
                <div className="mt-1 text-sm text-slate-700">{n.body}</div>
                <div className="mt-2">
                  <Badge className={riskBadge[n.severity]}>{n.severity}</Badge>
                </div>
              </li>
            ))
          )}
        </ul>
        <button className="btn-outline mt-4 w-full justify-center">
          <MessageSquarePlus size={13} /> Add note
        </button>
      </Card>

      <Card>
        <CardHeader title="Production readiness" subtitle="Auto-evaluated checks" />
        <ul className="space-y-2 text-sm">
          {[
            { label: "Spec sign-off",      ok: true },
            { label: "Art approved",       ok: project.currentPhase !== "Art Development" },
            { label: "Engine load test",   ok: project.riskLevel !== "Critical" },
            { label: "QA regression pass", ok: ["Production Env", "Live"].includes(project.status) },
            { label: "Go-live runbook",    ok: project.status === "Live" || project.status === "Production Env" },
          ].map((c) => (
            <li key={c.label} className="flex items-center justify-between">
              <span className="text-slate-700">{c.label}</span>
              <span className={`text-xs font-medium ${c.ok ? "text-emerald-600" : "text-amber-600"}`}>
                {c.ok ? "Ready" : "Pending"}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
