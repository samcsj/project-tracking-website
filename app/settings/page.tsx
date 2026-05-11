import { Card, CardHeader } from "@/components/ui/Card";

export const metadata = { title: "Settings · PTS" };

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="h1">Settings</h1>
        <p className="muted mt-1">Workspace, integrations, and notification preferences.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Workspace" subtitle="Organisation-level defaults" />
          <ul className="space-y-3 text-sm">
            <Row label="Workspace name"  value="PTS — Internal" />
            <Row label="Default brand"   value="Nova Arcade" />
            <Row label="Fiscal year"     value="Apr 2026 – Mar 2027" />
            <Row label="Working week"    value="Mon – Fri" />
          </ul>
        </Card>
        <Card>
          <CardHeader title="Integrations" subtitle="External systems connected" />
          <ul className="space-y-3 text-sm">
            <Row label="Jira"          value="Connected · last sync 08:02" tone="ok" />
            <Row label="Slack"         value="Connected · #pts-alerts"     tone="ok" />
            <Row label="GitHub"        value="Not connected"               tone="off" />
            <Row label="Google Drive"  value="Connected"                   tone="ok" />
          </ul>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Notifications" subtitle="What gets emailed and to whom" />
          <p className="muted">
            Notification rules will live here in the next iteration: per-risk-level digests, weekly status, and per-PIC delay alerts.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "ok" | "off" }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span
        className={`text-sm font-medium ${
          tone === "ok"  ? "text-emerald-700" :
          tone === "off" ? "text-slate-400"   : "text-slate-800"
        }`}
      >
        {value}
      </span>
    </li>
  );
}
