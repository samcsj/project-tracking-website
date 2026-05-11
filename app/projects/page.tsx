import { Suspense } from "react";
import { ProjectsClient } from "./ProjectsClient";

export const metadata = { title: "Projects · PTS" };

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="h1">Projects</h1>
        <p className="muted mt-1">
          All projects across brands. Filter to focus, click a row for details.
        </p>
      </header>
      <Suspense fallback={<div className="muted">Loading…</div>}>
        <ProjectsClient />
      </Suspense>
    </div>
  );
}
