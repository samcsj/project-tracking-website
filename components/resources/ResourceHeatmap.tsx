import type { Workload } from "@/lib/types";
import { heatmapCell } from "@/lib/status";

export function ResourceHeatmap({
  rows,
  weeks,
}: {
  rows: Workload[];
  weeks: string[];
}) {
  return (
    <div className="card overflow-hidden p-0">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-slate-50 px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 border-b border-r border-slate-200">
              Role
            </th>
            {weeks.map((w) => (
              <th
                key={w}
                className="bg-slate-50 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-200"
              >
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.role}>
              <td className="sticky left-0 z-10 bg-white px-4 py-2 text-sm font-medium text-slate-800 border-b border-r border-slate-100">
                {r.role}
              </td>
              {r.weeks.map((util, idx) => (
                <td key={idx} className="p-1 border-b border-slate-100 align-middle">
                  <div
                    className={`mx-auto flex h-10 w-full max-w-[120px] items-center justify-center rounded-md text-sm font-semibold ${heatmapCell(util)}`}
                  >
                    {util}%
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
