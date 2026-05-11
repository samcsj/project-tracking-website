import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Jira Sync Logs · PTS" };

const LOGS: { at: string; status: "ok" | "warn" | "fail"; project: string; message: string }[] = [
  { at: "2026-05-11 08:02", status: "ok",   project: "All projects",     message: "Hourly sync · 312 issues pulled, 2 created, 9 updated" },
  { at: "2026-05-11 07:02", status: "ok",   project: "All projects",     message: "Hourly sync · 310 issues pulled, 0 created, 4 updated" },
  { at: "2026-05-11 06:11", status: "warn", project: "Aurora Quest",     message: "Sync delayed 8m — Jira API 429 rate limit" },
  { at: "2026-05-11 06:02", status: "ok",   project: "All projects",     message: "Hourly sync · 308 issues pulled, 1 created, 3 updated" },
  { at: "2026-05-10 23:14", status: "fail", project: "Volt Tower",       message: "Webhook signature mismatch — payload rejected" },
  { at: "2026-05-10 18:02", status: "ok",   project: "All projects",     message: "Hourly sync · 306 issues pulled, 0 created, 7 updated" },
];

function tone(s: "ok" | "warn" | "fail") {
  if (s === "ok")   return { cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: CheckCircle2 };
  if (s === "warn") return { cls: "bg-amber-50 text-amber-800 ring-amber-200",       icon: AlertCircle   };
  return                  { cls: "bg-red-50 text-red-700 ring-red-200",              icon: AlertCircle   };
}

export default function JiraLogsPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="h1">Jira Sync Logs</h1>
          <p className="muted mt-1">
            Bidirectional sync status. Hourly + webhook-triggered, with retries on transient errors.
          </p>
        </div>
        <button className="btn-outline">
          <RefreshCw size={13} /> Trigger sync
        </button>
      </header>

      <Card padded={false}>
        <CardHeader title="Recent activity" />
        <div className="px-5 pb-5">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Status</th>
                <th>Scope</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {LOGS.map((l, i) => {
                const t = tone(l.status);
                const Icon = t.icon;
                return (
                  <tr key={i}>
                    <td className="font-mono text-[12px] text-slate-600">{l.at}</td>
                    <td>
                      <Badge className={t.cls}>
                        <Icon size={11} />
                        {l.status === "ok" ? "Success" : l.status === "warn" ? "Warning" : "Failed"}
                      </Badge>
                    </td>
                    <td className="text-slate-700">{l.project}</td>
                    <td className="text-slate-600">{l.message}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
