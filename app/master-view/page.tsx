import { MasterViewClient } from "./MasterViewClient";

export const metadata = { title: "Master View · PTS" };

export default function MasterViewPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="h1">Master Horizontal View</h1>
        <p className="muted mt-1">
          One row per project. Phases and milestones expand horizontally — hide any
          group and its columns collapse cleanly.
        </p>
      </header>
      <MasterViewClient />
    </div>
  );
}
