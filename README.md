# PTS — Project Tracking System

An internal enterprise **Production Command Center** for game production. Tracks brands, projects, milestones, stages, Jira-linked tasks, expected/latest/actual dates, team workload, QA bottlenecks, production readiness, and delivery risks.

This is the **initial website version**: front-end only, all data mocked in `lib/data.ts`. No backend, no auth.

## Stack

- Next.js **14.2.18** (App Router) — pinned because local Node is 18.17
- TypeScript (strict)
- Tailwind CSS 3.4
- Recharts (status overview chart)
- date-fns (timeline + heatmap math)
- lucide-react (icons)

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks)
npm run start      # serve the production build
```

## Pages

| Route | What it shows |
|---|---|
| `/`              | Dashboard — 4 KPI cards, risk alert panel, upcoming milestones, project status donut |
| `/projects`      | Filterable, dense data table (brand / status / PIC / risk). Filters are URL-synced. |
| `/projects/[id]` | Project detail — summary, phase plan, date comparison, Jira summary, change history, sticky risk panel |
| `/timeline`      | Gantt-style roadmap with month axis, today line, phase colour bars, hover details |
| `/resources`     | Heatmap of weekly utilization per discipline + overload summary |
| `/qa`            | QA monitoring — ticket totals + bottleneck list |
| `/reports`       | Report tiles (placeholder dashboards for next iteration) |
| `/jira-logs`     | Sync log table (success / warning / failure rows) |
| `/settings`      | Workspace + integrations (placeholder rows) |

## Architecture notes

- **Server components by default.** Interactive routes use the `page.tsx` (server) → `<Route>Client.tsx` (client island) pattern — keeps the entry point statically optimisable.
- **Single mock source of truth** in `lib/data.ts`. Swap each exported array for a `fetch()` call when a backend lands; the components consume only the lookup helpers (`getProject`, `getPhases`, `getJiraSummary`, …), so the UI doesn't need to change.
- **Status colours come from one place** (`lib/status.ts`). Every badge / dot / bar / heatmap cell looks the same on every page because they share these lookups.
- **Today is fixed** at 2026-05-11 (`TODAY` in `lib/date.ts`) so mock dates remain coherent. Replace with `new Date()` once real data arrives.
- **Table is virtualization-ready** — flat row array, no nested DOM tricks. Drop in `@tanstack/react-virtual` later without restructuring.

## Folder layout

```
app/
  layout.tsx                # sidebar + topbar shell
  globals.css               # design tokens + @layer components
  page.tsx                  # Dashboard
  projects/page.tsx + ProjectsClient.tsx
  projects/[id]/page.tsx    # Project detail (server, with generateStaticParams)
  timeline/page.tsx + TimelineClient.tsx
  resources/page.tsx
  qa, reports, jira-logs, settings/page.tsx

components/
  shell/        Sidebar, TopBar
  ui/           Card, Badge, EmptyState
  dashboard/    KpiCard, RiskAlertPanel, UpcomingMilestones, StatusOverviewChart
  projects/     ProjectsTable, ProjectFilters
  project-detail/ PhaseList, DateComparisonTable, JiraSummary, RiskNotesPanel
  timeline/     GanttChart, GanttLegend
  resources/    ResourceHeatmap

lib/
  types.ts      # Brand, Project, Phase, JiraSummary, Workload, RiskNote, ChangeLogEntry
  data.ts       # all mock data + lookup helpers
  status.ts     # status → Tailwind class lookups (badge, dot, bar, heatmap)
  date.ts       # fixed-today helpers + week-of-month bucket
```

## What can be improved next

1. **Real Jira integration.** Replace `lib/data.ts` `jiraSummaries` with an authenticated Jira API call; reuse the same shape.
2. **Editable dates on the Gantt.** Drag a bar to reschedule. The Gantt component already computes positions from %; a `pointerdown` handler that converts pixels back to dates would close the loop.
3. **Server-side persistence.** Drop in a Postgres backend (Drizzle + a single `projects.ts` route handler) and replace the lookup helpers with `fetch` calls. Components stay untouched.
4. **Auth + RBAC.** Wrap the layout in an auth provider; gate `/settings` and the “New Project” action by role.
5. **Virtualized tables.** Add `@tanstack/react-virtual` to `ProjectsTable` and the change-history list once the dataset grows.
6. **Notification rules.** The Settings page already has a placeholder card for per-risk-level digests and per-PIC delay alerts.
7. **Saved views.** Persist filter combinations as named views on `/projects` and `/timeline`.
8. **Dark mode.** Tokens are CSS vars in `globals.css`, so swapping a `.dark` variant on `html` is straightforward.

## Out of scope for this iteration

Auth, RBAC, persistent storage, real Jira, drag-to-reschedule, inline editing, dark mode.
