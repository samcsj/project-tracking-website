import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  delta,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  delta?: { value: string; positive?: boolean };
  tone?: "neutral" | "warning" | "danger" | "success";
}) {
  const toneRing =
    tone === "warning" ? "ring-amber-100" :
    tone === "danger"  ? "ring-red-100"   :
    tone === "success" ? "ring-emerald-100" :
                         "ring-slate-100";
  const toneIcon =
    tone === "warning" ? "bg-amber-50 text-amber-600" :
    tone === "danger"  ? "bg-red-50 text-red-600"     :
    tone === "success" ? "bg-emerald-50 text-emerald-600" :
                         "bg-indigo-50 text-indigo-600";

  return (
    <div className={`card card-pad ring-1 ${toneRing}`}>
      <div className="flex items-start justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneIcon}`}>
          <Icon size={18} />
        </div>
        {delta ? (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${
              delta.positive ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {delta.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {delta.value}
          </span>
        ) : null}
      </div>
      <div className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </div>
      <div className="mt-1 text-sm font-medium text-slate-700">{label}</div>
      {hint ? <div className="muted mt-0.5">{hint}</div> : null}
    </div>
  );
}
