"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { Badge, Dot } from "@/components/ui/Badge";
import { projectStatusBadge, riskBadge, riskDot } from "@/lib/status";
import { getBrand } from "@/lib/data";
import { fmtDate, daysFromToday } from "@/lib/date";

export function ProjectsTable({ rows }: { rows: Project[] }) {
  return (
    <div className="card overflow-hidden p-0">
      <div className="max-h-[calc(100vh-280px)] overflow-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Brand</th>
              <th>Project</th>
              <th>Type</th>
              <th>PIC</th>
              <th>Status</th>
              <th>Target Live</th>
              <th>Current Phase</th>
              <th>Risk</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-sm text-slate-500">
                  No projects match these filters.
                </td>
              </tr>
            ) : (
              rows.map((p) => {
                const brand = getBrand(p.brandId);
                const dt = daysFromToday(p.targetLiveDate);
                return (
                  <tr key={p.id} className="cursor-pointer">
                    <td>
                      <Link href={`/projects/${p.id}`} className="block">
                        <span className="text-slate-700">{brand?.name}</span>
                      </Link>
                    </td>
                    <td>
                      <Link href={`/projects/${p.id}`} className="block">
                        <span className="font-medium text-slate-900">{p.name}</span>
                      </Link>
                    </td>
                    <td>
                      <span className="chip">{p.type}</span>
                    </td>
                    <td>
                      <Link href={`/projects/${p.id}`} className="block">
                        {p.pic}
                      </Link>
                    </td>
                    <td>
                      <Link href={`/projects/${p.id}`} className="block">
                        <Badge className={projectStatusBadge[p.status]}>{p.status}</Badge>
                      </Link>
                    </td>
                    <td>
                      <Link href={`/projects/${p.id}`} className="block">
                        <div className="text-slate-800">{fmtDate(p.targetLiveDate)}</div>
                        <div
                          className={`text-[11px] ${
                            dt < 0 ? "text-red-600" :
                            dt <= 14 ? "text-amber-600" : "text-slate-500"
                          }`}
                        >
                          {dt < 0 ? `${Math.abs(dt)}d past` : dt === 0 ? "today" : `in ${dt}d`}
                        </div>
                      </Link>
                    </td>
                    <td>
                      <Link href={`/projects/${p.id}`} className="block">
                        <span className="text-slate-700">{p.currentPhase}</span>
                      </Link>
                    </td>
                    <td>
                      <Link href={`/projects/${p.id}`} className="block">
                        <Badge className={riskBadge[p.riskLevel]}>
                          <Dot className={riskDot[p.riskLevel]} />
                          {p.riskLevel}
                        </Badge>
                      </Link>
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/projects/${p.id}`}
                        className="inline-flex items-center text-slate-400 hover:text-indigo-600"
                      >
                        <ArrowUpRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
