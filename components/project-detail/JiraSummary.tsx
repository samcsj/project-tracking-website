import type { JiraSummary as JiraSummaryT } from "@/lib/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { ExternalLink } from "lucide-react";

export function JiraSummary({ summary }: { summary: JiraSummaryT }) {
  const total = summary.open + summary.inProgress + summary.blocked + summary.done;
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

  const buckets: { label: string; value: number; tone: string }[] = [
    { label: "Open",        value: summary.open,       tone: "bg-slate-300"   },
    { label: "In Progress", value: summary.inProgress, tone: "bg-blue-500"    },
    { label: "Blocked",     value: summary.blocked,    tone: "bg-red-500"     },
    { label: "Done",        value: summary.done,       tone: "bg-emerald-500" },
  ];

  return (
    <Card>
      <CardHeader
        title="Jira Tasks"
        subtitle={`${total} linked issues`}
        actions={
          <a className="text-xs font-medium text-indigo-600 hover:underline inline-flex items-center gap-1">
            Open in Jira <ExternalLink size={11} />
          </a>
        }
      />
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
        {buckets.map((b) => (
          <div
            key={b.label}
            className={`${b.tone}`}
            style={{ width: `${pct(b.value)}%` }}
            title={`${b.label}: ${b.value}`}
          />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        {buckets.map((b) => (
          <li key={b.label} className="rounded-lg bg-slate-50 px-3 py-2">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-500">
              <span className={`h-2 w-2 rounded-full ${b.tone}`} />
              {b.label}
            </div>
            <div className="mt-1 text-xl font-semibold text-slate-900">{b.value}</div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
