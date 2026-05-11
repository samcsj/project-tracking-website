import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, Dot } from "@/components/ui/Badge";
import { riskBadge, riskDot } from "@/lib/status";
import { brands, projects, riskNotes, getBrand } from "@/lib/data";
import { fmtShort } from "@/lib/date";
import { parseISO } from "date-fns";

export function RiskAlertPanel() {
  // Critical/High projects, paired with their most recent risk note (if any).
  const ranked = projects
    .filter((p) => p.riskLevel === "Critical" || p.riskLevel === "High")
    .sort((a, b) => (a.riskLevel === "Critical" ? -1 : 1) - (b.riskLevel === "Critical" ? -1 : 1))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            Risk Alerts
          </span>
        }
        subtitle={`${ranked.length} project${ranked.length === 1 ? "" : "s"} need attention`}
        actions={
          <Link href="/projects?risk=Critical" className="text-xs font-medium text-indigo-600 hover:underline">
            View all
          </Link>
        }
      />
      <ul className="-mx-2 divide-y divide-slate-100">
        {ranked.map((p) => {
          const brand = getBrand(p.brandId);
          const note = riskNotes
            .filter((n) => n.projectId === p.id)
            .sort((a, b) => parseISO(b.at).getTime() - parseISO(a.at).getTime())[0];
          return (
            <li key={p.id}>
              <Link
                href={`/projects/${p.id}`}
                className="flex items-start gap-3 rounded-lg px-2 py-3 hover:bg-slate-50"
              >
                <Dot className={`${riskDot[p.riskLevel]} mt-1.5`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 truncate">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {brand?.name}
                    </span>
                    <Badge className={`${riskBadge[p.riskLevel]} ml-auto`}>
                      {p.riskLevel}
                    </Badge>
                  </div>
                  <div className="muted mt-0.5 line-clamp-1">
                    {note ? note.body : `Current phase: ${p.currentPhase}`}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    Target live · {fmtShort(p.targetLiveDate)} · PIC {p.pic}
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-300" />
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

// silence unused-import for brands when tree-shaking
void brands;
