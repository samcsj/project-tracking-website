# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**PTS — Project Tracking System.** Internal enterprise "Production Command Center" for game production. Tracks brands, projects, milestones, stages, Jira-linked tasks, expected/latest/actual dates, team workload, QA bottlenecks, production readiness, and delivery risks.

This is the **initial website version**: front-end only, **all data mocked** in `lib/data.ts`. No backend, no auth, no tests.

## Commands

```bash
npm run dev          # Dev server with hot reload at http://localhost:3000
npm run build        # Production build (also runs the TypeScript type-check)
npm run start        # Serve the production build (after `build`)
npm run lint         # Next.js built-in ESLint
```

No test runner is configured.

## Version constraints

- **Node `>= 18.17`** required, but the local dev machine runs **Node 18.17 specifically** (no nvm). This is why **Next.js is pinned to 14.2.18** — Next 15/16 require newer Node. Do not bump Next without first confirming the Node version.
- Folder name contains spaces (`Project Tracking Website`), so `package.json` `"name"` is manually set to kebab-case `project-tracking-website` (npm rejects spaces/capitals).

## Architecture

### Routing — App Router with the server/client-island pattern

Interactive routes split into a server entry + a sibling client island:

- `app/projects/page.tsx` (server, page-level metadata) → renders `app/projects/ProjectsClient.tsx`
- `app/timeline/page.tsx` (server) → renders `app/timeline/TimelineClient.tsx`

Reason: filtering, URL-sync, and the Gantt hover state need `useState` / `useSearchParams`, but keeping the route entry server-rendered preserves Next.js's static optimization. **Follow this pattern when adding a new interactive page.**

`app/projects/[id]/page.tsx` is fully server-rendered and uses `generateStaticParams()` so all detail pages are pre-built. Risk panel and other interactive bits live as small islands.

### Mock data is the single source of truth

`lib/data.ts` exports the canonical arrays (`brands`, `projects`, `phases`, `jiraSummaries`, `workload`, `riskNotes`, `changeLog`) plus lookups (`getBrand`, `getProject`, `getPhases`, `getJiraSummary`, `getRiskNotes`, `getChangeLog`). Types live in `lib/types.ts`.

**Phases are derived, not hand-written.** `buildPhases()` synthesises all 11 stages per project from `STAGE_NAMES`, anchored to each project's `currentPhase` and `riskLevel` — this is what makes statuses (Done / In Progress / At Risk / Delayed / Pending) line up with current state. If you need richer phase data, edit the generator, don't hand-roll rows.

To swap mock data for a real API later: replace each exported array with a `fetch()`-backed equivalent. The lookup helpers are the seam — as long as their signatures stay the same, every component above them is unaffected.

### "Today" is a fixed constant

`TODAY = parseISO("2026-05-11")` lives in `lib/date.ts`. Every relative-date calculation in the app (`daysFromToday`, the Gantt today-line, the Dashboard KPIs, "in 3d / 2d overdue" hints, week-of-month buckets on the heatmap) is anchored to this constant so the mock data stays coherent. **When real data lands, replace this with `new Date()` and the rest of the code just works.**

### Status colour discipline

All status / risk colours come from **one place**: `lib/status.ts`. It exports per-variant lookups:

| Lookup | What it returns |
|---|---|
| `phaseStatusBadge[status]`   | Tailwind classes for a `<Badge>` (bg + text + ring) |
| `phaseStatusDot[status]`     | Solid colour class for a small dot |
| `phaseStatusBar[status]`     | Solid colour class for a Gantt bar |
| `projectStatusBadge[status]` | Badge classes for project status (different palette) |
| `riskBadge[level]` / `riskDot[level]` | Risk-level variants |
| `heatmapCell(util)`          | Utilization % → cell colour (slate → emerald → amber → orange → red) |

If you add a status, you must extend the relevant lookup(s) — TypeScript will flag every missing entry because the maps are `Record<Status, string>`.

### Tailwind tokens + component classes

`tailwind.config.ts` is intentionally lean — neutral surface palette, status accents via stock Tailwind colours, two custom shadows (`shadow-card`, `shadow-pop`).

Reusable component classes are defined with `@layer components` in `app/globals.css`:

- `.card` / `.card-pad` — rounded white surface
- `.btn-primary` / `.btn-ghost` / `.btn-outline`
- `.badge` / `.chip`
- `.input`
- `.data-table` — dense table with sticky header, hover row, dividers
- `.nav-item` / `.nav-item-active`
- `.section-title` / `.h1` / `.h2` / `.muted`

**Prefer these over re-typing the same utility chains.**

### Gantt is custom-built, not a library

`components/timeline/GanttChart.tsx` derives bar positions from a date range:

```
left%  = (phase.latestStart - rangeStart) / totalDays * 100
width% = (phase.latestEnd   - phase.latestStart) / totalDays * 100
```

Same maths drives the today-line and month axis. There is no Gantt library. To extend (drag-to-reschedule, zoom, swimlanes), keep working in `%` and only convert back to dates at the interaction boundary.

### Tables are virtualization-ready

`components/projects/ProjectsTable.tsx` renders a flat row array — no nested DOM tricks, no per-row state. Dropping in `@tanstack/react-virtual` is purely additive; no restructuring required.

## Conventions

- **Server components by default.** Add `"use client"` only when the file uses state, effects, browser APIs, or event handlers. The shell components (`Sidebar`, `TopBar`) are client because they use `usePathname` / inputs; almost everything else is server.
- **Imports use the `@/*` alias** (e.g. `@/lib/data`, `@/components/ui/Card`). Configured in `tsconfig.json` paths.
- **No barrel files** (`index.ts` re-exports) — components and lib files are imported by their full path.
- **URL-synced filters.** `ProjectsClient` writes filter state to the URL via `router.replace(...)`; deep-linking works (`/projects?risk=Critical&brand=nova`). Mirror this pattern when adding new filters elsewhere.

## Where to look when adding features

| To add… | Touch these files |
|---|---|
| A new project, brand, phase, or risk note | `lib/data.ts` only |
| A new project status or risk level | `lib/types.ts` (union) **and** every map in `lib/status.ts` (TS will flag misses) |
| A new filter on the projects table | `components/projects/ProjectFilters.tsx` + `app/projects/ProjectsClient.tsx` (state, URL effect, `useMemo` filter) |
| A new column on the projects table | `components/projects/ProjectsTable.tsx` (and `Project` type if it's a new field) |
| A new dashboard tile | A new component under `components/dashboard/` + slot into `app/page.tsx` grid |
| A new Gantt feature | `components/timeline/GanttChart.tsx` — keep working in `%` of date range |
| A new page | New folder under `app/`. If interactive, use the wrapper pattern (`page.tsx` server + `<Page>Client.tsx` client). |
| A new design token / class | `tailwind.config.ts` (colour/shadow) or `app/globals.css` `@layer components` |
