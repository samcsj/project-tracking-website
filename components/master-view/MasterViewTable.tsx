"use client";

import Link from "next/link";
import { Badge, Dot } from "@/components/ui/Badge";
import { getBrand } from "@/lib/data";
import { fmtDate } from "@/lib/date";
import {
  getCellValue,
  type ColumnGroup,
  type MasterViewColumn,
  type MasterViewRow,
} from "@/lib/master-view";
import {
  phaseStatusBadge,
  projectStatusBadge,
  riskBadge,
  riskDot,
} from "@/lib/status";
import type { PhaseStatus, RiskLevel } from "@/lib/types";

const STICKY_NAME_CLASS =
  "sticky left-0 z-20 bg-white shadow-[1px_0_0_0_rgb(226_232_240)]";
const STICKY_NAME_HEADER_CLASS =
  "sticky top-[36px] left-0 z-30 bg-slate-50/95 backdrop-blur shadow-[1px_0_0_0_rgb(226_232_240)]";

export function MasterViewTable({
  columns,
  rows,
}: {
  columns: ColumnGroup[];
  rows: MasterViewRow[];
}) {
  const flatColumns = columns.flatMap((g) => g.columns);
  const colCount = flatColumns.length;

  return (
    <div className="card overflow-hidden p-0">
      <div className="max-h-[calc(100vh-340px)] overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            {/* Group header row — phase / milestone names spanning their columns */}
            <tr>
              {columns.map((g) => (
                <th
                  key={`g:${g.key}`}
                  colSpan={g.columns.length}
                  className={
                    g.kind === "static"
                      ? "sticky top-0 z-20 border-b border-slate-200 bg-slate-50/95 backdrop-blur px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                      : g.kind === "phase"
                      ? "sticky top-0 z-10 border-b border-l border-slate-200 bg-indigo-50/70 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-indigo-700"
                      : "sticky top-0 z-10 border-b border-l border-slate-200 bg-violet-50/70 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-violet-700"
                  }
                >
                  {g.label || ""}
                </th>
              ))}
            </tr>
            {/* Column header row */}
            <tr>
              {columns.map((g, gi) =>
                g.columns.map((col, ci) => {
                  const isFirstStatic = gi === 0 && ci === 0;
                  const isGroupFirst = ci === 0 && g.kind !== "static";
                  return (
                    <th
                      key={`c:${columnKey(col)}`}
                      className={
                        (isFirstStatic ? STICKY_NAME_HEADER_CLASS : "sticky top-[36px] z-10 bg-slate-50/95 backdrop-blur") +
                        " border-b border-slate-200 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap" +
                        (isGroupFirst ? " border-l" : "")
                      }
                    >
                      {col.label}
                    </th>
                  );
                }),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={Math.max(colCount, 1)}
                  className="py-10 text-center text-sm text-slate-500"
                >
                  No projects match these filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.project.id} className="hover:bg-slate-50/70">
                  {columns.map((g, gi) =>
                    g.columns.map((col, ci) => (
                      <Cell
                        key={`${row.project.id}:${columnKey(col)}`}
                        row={row}
                        col={col}
                        isFirstStatic={gi === 0 && ci === 0}
                        isGroupFirst={ci === 0 && g.kind !== "static"}
                      />
                    )),
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Cell({
  row,
  col,
  isFirstStatic,
  isGroupFirst,
}: {
  row: MasterViewRow;
  col: MasterViewColumn;
  isFirstStatic: boolean;
  isGroupFirst: boolean;
}) {
  const base =
    "px-3 py-2 border-b border-slate-100 align-top text-slate-700 whitespace-nowrap" +
    (isGroupFirst ? " border-l border-slate-200" : "");

  const className = isFirstStatic ? `${STICKY_NAME_CLASS} ${base}` : base;

  return <td className={className}>{renderCellContent(row, col)}</td>;
}

function renderCellContent(row: MasterViewRow, col: MasterViewColumn) {
  const value = getCellValue(row, col);

  // Static columns get richer rendering (badges, brand-name lookup, link).
  if (col.kind === "static") {
    if (col.key === "name") {
      return (
        <Link
          href={`/projects/${row.project.id}`}
          className="font-medium text-slate-900 hover:text-indigo-600"
        >
          {row.project.name}
        </Link>
      );
    }
    if (col.key === "brand") {
      return <span>{getBrand(row.project.brandId)?.name ?? value ?? "—"}</span>;
    }
    if (col.key === "type" || col.key === "team") {
      return value ? <span className="chip">{value}</span> : <Dash />;
    }
    if (col.key === "status") {
      return (
        <Badge className={projectStatusBadge[row.project.status]}>
          {row.project.status}
        </Badge>
      );
    }
    if (col.key === "health") {
      const r = row.project.riskLevel as RiskLevel;
      return (
        <Badge className={riskBadge[r]}>
          <Dot className={riskDot[r]} />
          {r}
        </Badge>
      );
    }
    if (col.key === "targetLiveDate") {
      return value ? fmtDate(value) : <Dash />;
    }
    return value ?? <Dash />;
  }

  // Phase / milestone status uses the phase status badge.
  const fieldKind = (col as { field: string }).field;

  if (fieldKind === "status") {
    if (!value) return <Dash />;
    return (
      <Badge className={phaseStatusBadge[value as PhaseStatus]}>{value}</Badge>
    );
  }

  // Dates — anything ending with Start/End/Date.
  if (/Date$|Start$|End$/.test(fieldKind)) {
    return value ? fmtDate(value) : <Dash />;
  }

  if (fieldKind === "remark") {
    return value ? (
      <span className="block max-w-[18rem] truncate text-slate-600" title={value}>
        {value}
      </span>
    ) : (
      <Dash />
    );
  }

  // pic and anything else — plain text.
  return value ? <span>{value}</span> : <Dash />;
}

function Dash() {
  return <span className="text-slate-300">—</span>;
}

function columnKey(col: MasterViewColumn): string {
  if (col.kind === "static") return `s:${col.key}`;
  if (col.kind === "phase") return `p:${col.phaseName}:${col.field}`;
  return `m:${col.milestoneName}:${col.field}`;
}
