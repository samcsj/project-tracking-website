import type { Phase } from "@/lib/types";
import { fmtShort, daysBetween } from "@/lib/date";

export function DateComparisonTable({ phases }: { phases: Phase[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Phase</th>
            <th>Expected</th>
            <th>Latest</th>
            <th>Actual</th>
            <th>Variance</th>
          </tr>
        </thead>
        <tbody>
          {phases.map((p) => {
            const variance = p.actualEndDate
              ? daysBetween(p.expectedEndDate, p.actualEndDate)
              : daysBetween(p.expectedEndDate, p.latestEndDate);
            const varianceTone =
              variance > 5 ? "text-red-600" :
              variance > 0 ? "text-amber-600" :
              variance < 0 ? "text-emerald-600" : "text-slate-500";
            return (
              <tr key={p.id}>
                <td className="font-medium text-slate-800">{p.name}</td>
                <td>
                  <div>{fmtShort(p.expectedStartDate)} → {fmtShort(p.expectedEndDate)}</div>
                </td>
                <td>
                  <div>{fmtShort(p.latestStartDate)} → {fmtShort(p.latestEndDate)}</div>
                </td>
                <td>
                  {p.actualStartDate ? (
                    <div>
                      {fmtShort(p.actualStartDate)} → {p.actualEndDate ? fmtShort(p.actualEndDate) : "in progress"}
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className={varianceTone + " font-medium"}>
                  {variance === 0 ? "On track" : variance > 0 ? `+${variance}d` : `${variance}d`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
