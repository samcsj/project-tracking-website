import { TimelineClient } from "./TimelineClient";

export const metadata = { title: "Timeline · PTS" };

export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="h1">Production Timeline</h1>
          <p className="muted mt-1">
            Gantt view across all projects. Bar color = current phase status. The blue vertical line marks today.
          </p>
        </div>
      </header>
      <TimelineClient />
    </div>
  );
}
