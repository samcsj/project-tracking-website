"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import type { Phase, Project } from "@/lib/types";
import { phaseStatusBar, phaseStatusBadge, phaseStatusDot } from "@/lib/status";
import { Badge, Dot } from "@/components/ui/Badge";
import { fmtShort } from "@/lib/date";

interface Props {
  projects: Project[];
  phases: Phase[];
  rangeStart: string; // ISO
  rangeEnd: string;   // ISO
  today: string;      // ISO
}

export function GanttChart({ projects, phases, rangeStart, rangeEnd, today }: Props) {
  const [hover, setHover] = useState<Phase | null>(null);

  const start = parseISO(rangeStart);
  const end = parseISO(rangeEnd);
  const totalDays = differenceInCalendarDays(end, start);

  const pct = (dateIso: string) => {
    const d = differenceInCalendarDays(parseISO(dateIso), start);
    return Math.max(0, Math.min(100, (d / totalDays) * 100));
  };

  const months = useMemo(() => {
    const out: { label: string; left: number }[] = [];
    const cursor = new Date(start);
    cursor.setDate(1);
    while (cursor <= end) {
      out.push({
        label: format(cursor, "MMM yyyy"),
        left: (differenceInCalendarDays(cursor, start) / totalDays) * 100,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return out;
  }, [start, end, totalDays]);

  const todayPct = pct(today);

  return (
    <div className="card overflow-hidden p-0">
      <div className="grid grid-cols-[260px_1fr]">
        {/* Left rail header */}
        <div className="border-b border-r border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Project
        </div>
        {/* Right timeline header — month ticks */}
        <div className="relative border-b border-slate-200 bg-slate-50">
          <div className="relative h-10">
            {months.map((m) => (
              <div
                key={m.label}
                className="absolute top-0 h-full border-l border-slate-200 pl-2 pt-2 text-[11px] font-medium text-slate-500"
                style={{ left: `${m.left}%` }}
              >
                {m.label}
              </div>
            ))}
            <div
              className="absolute top-0 z-10 h-full w-px bg-indigo-500"
              style={{ left: `${todayPct}%` }}
            >
              <span className="absolute -top-0.5 -translate-x-1/2 rounded bg-indigo-500 px-1 py-0.5 text-[10px] font-medium text-white">
                Today
              </span>
            </div>
          </div>
        </div>

        {/* Rows */}
        {projects.map((p, projIdx) => {
          const projectPhases = phases.filter((ph) => ph.projectId === p.id);
          return (
            <div key={p.id} className="contents">
              <div className={`border-r border-b border-slate-200 px-4 py-3 ${projIdx % 2 ? "bg-slate-50/40" : "bg-white"}`}>
                <Link href={`/projects/${p.id}`} className="block">
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {p.name}
                  </div>
                  <div className="muted truncate">
                    {p.currentPhase} · {p.pic}
                  </div>
                </Link>
              </div>
              <div
                className={`relative border-b border-slate-200 ${projIdx % 2 ? "bg-slate-50/40" : "bg-white"}`}
                style={{ height: 56 }}
              >
                {/* faint vertical month gridlines */}
                {months.map((m) => (
                  <div
                    key={m.label}
                    className="absolute top-0 h-full border-l border-slate-100"
                    style={{ left: `${m.left}%` }}
                  />
                ))}
                {/* today line */}
                <div
                  className="absolute top-0 z-10 h-full w-px bg-indigo-500/60"
                  style={{ left: `${todayPct}%` }}
                />
                {/* phase bars */}
                {projectPhases.map((ph) => {
                  const leftPct = pct(ph.latestStartDate);
                  const widthPct = Math.max(
                    1.5,
                    pct(ph.latestEndDate) - leftPct
                  );
                  return (
                    <button
                      key={ph.id}
                      type="button"
                      onMouseEnter={() => setHover(ph)}
                      onMouseLeave={() => setHover((cur) => (cur?.id === ph.id ? null : cur))}
                      className={`absolute top-1/2 -translate-y-1/2 h-5 rounded-md ring-1 ring-white/40 ${phaseStatusBar[ph.status]} hover:ring-2 hover:ring-slate-900/10 transition`}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      title={`${ph.name} — ${ph.status}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover tooltip card (anchored to chart bottom) */}
      {hover ? (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-slate-900">{hover.name}</span>
            <Badge className={phaseStatusBadge[hover.status]}>
              <Dot className={phaseStatusDot[hover.status]} />
              {hover.status}
            </Badge>
            <span className="chip">{hover.function}</span>
          </div>
          <div className="muted mt-1">
            Expected {fmtShort(hover.expectedStartDate)} → {fmtShort(hover.expectedEndDate)} ·
            Latest {fmtShort(hover.latestStartDate)} → {fmtShort(hover.latestEndDate)}
            {hover.actualStartDate ? ` · Actual ${fmtShort(hover.actualStartDate)} → ${hover.actualEndDate ? fmtShort(hover.actualEndDate) : "in progress"}` : ""}
          </div>
        </div>
      ) : null}
    </div>
  );
}
