import type {
  Brand,
  ChangeLogEntry,
  JiraSummary,
  Phase,
  PhaseStatus,
  Project,
  RiskNote,
  Workload,
} from "@/lib/types";

/* -------------------------------------------------------------------------- */
/*  Brands                                                                    */
/* -------------------------------------------------------------------------- */

export const brands: Brand[] = [
  { id: "nova", name: "Nova Arcade", owner: "Priya Raman" },
  { id: "ember", name: "Ember Studios", owner: "Marcus Chen" },
  { id: "halo", name: "Halo Interactive", owner: "Sofia Alvarez" },
  { id: "tide", name: "Tide & Co.", owner: "Jin Park" },
  { id: "vector", name: "Vector Labs", owner: "Anya Kowalski" },
];

/* -------------------------------------------------------------------------- */
/*  Projects                                                                  */
/* -------------------------------------------------------------------------- */

export const projects: Project[] = [
  {
    id: "p-001",
    brandId: "nova",
    name: "Starlight Spin",
    type: "Game",
    pic: "Maya Tanaka",
    status: "In Development",
    targetLiveDate: "2026-07-22",
    currentPhase: "Engine Development",
    riskLevel: "Medium",
  },
  {
    id: "p-002",
    brandId: "nova",
    name: "Aurora Quest",
    type: "Game",
    pic: "Devon Hayes",
    status: "UAT Env",
    targetLiveDate: "2026-06-04",
    currentPhase: "UAT Push",
    riskLevel: "High",
  },
  {
    id: "p-003",
    brandId: "ember",
    name: "Phoenix Pulse",
    type: "Game",
    pic: "Lina Okonkwo",
    status: "In Development",
    targetLiveDate: "2026-08-15",
    currentPhase: "Animation Development",
    riskLevel: "Low",
  },
  {
    id: "p-004",
    brandId: "ember",
    name: "Volt Tower",
    type: "Game",
    pic: "Rahul Iyer",
    status: "Production Env",
    targetLiveDate: "2026-05-28",
    currentPhase: "Pre-Production",
    riskLevel: "Critical",
  },
  {
    id: "p-005",
    brandId: "halo",
    name: "Nimbus Drift",
    type: "Game",
    pic: "Eleanor Frost",
    status: "In Development",
    targetLiveDate: "2026-09-09",
    currentPhase: "Art Development",
    riskLevel: "Medium",
  },
  {
    id: "p-006",
    brandId: "halo",
    name: "Halo Bonus Wheel",
    type: "Feature",
    pic: "Sam Patel",
    status: "Live",
    targetLiveDate: "2026-04-18",
    currentPhase: "Go Live",
    riskLevel: "Low",
  },
  {
    id: "p-007",
    brandId: "tide",
    name: "Coral Cascade",
    type: "Game",
    pic: "Yusuf Demir",
    status: "Planning",
    targetLiveDate: "2026-10-30",
    currentPhase: "Game Specification Preparation",
    riskLevel: "Low",
  },
  {
    id: "p-008",
    brandId: "tide",
    name: "Tide Free Spins Promo",
    type: "Campaign",
    pic: "Hana Lee",
    status: "In Development",
    targetLiveDate: "2026-05-26",
    currentPhase: "Frontend Development",
    riskLevel: "High",
  },
  {
    id: "p-009",
    brandId: "vector",
    name: "Vector Vault",
    type: "Game",
    pic: "Carlos Mendes",
    status: "In Development",
    targetLiveDate: "2026-07-08",
    currentPhase: "Spec Briefing",
    riskLevel: "Medium",
  },
  {
    id: "p-010",
    brandId: "vector",
    name: "Quantum Reels",
    type: "Game",
    pic: "Ines Marchetti",
    status: "UAT Env",
    targetLiveDate: "2026-06-12",
    currentPhase: "Group Testing",
    riskLevel: "Critical",
  },
  {
    id: "p-011",
    brandId: "nova",
    name: "Lucky Lantern",
    type: "Game",
    pic: "Kenji Watanabe",
    status: "In Development",
    targetLiveDate: "2026-08-30",
    currentPhase: "Sound Development",
    riskLevel: "Low",
  },
  {
    id: "p-012",
    brandId: "halo",
    name: "Halo Loyalty Boost",
    type: "Feature",
    pic: "Olivia Brand",
    status: "On Hold",
    targetLiveDate: "2026-09-20",
    currentPhase: "Spec Briefing",
    riskLevel: "Medium",
  },
  {
    id: "p-013",
    brandId: "ember",
    name: "Ember Summer Splash",
    type: "Campaign",
    pic: "Theo Nakamura",
    status: "Production Env",
    targetLiveDate: "2026-05-18",
    currentPhase: "Pre-Production",
    riskLevel: "High",
  },
  {
    id: "p-014",
    brandId: "tide",
    name: "Reef Riches",
    type: "Game",
    pic: "Amara Singh",
    status: "Planning",
    targetLiveDate: "2026-11-14",
    currentPhase: "Game Specification Preparation",
    riskLevel: "Low",
  },
];

/* -------------------------------------------------------------------------- */
/*  Phases                                                                    */
/* -------------------------------------------------------------------------- */

const STAGE_NAMES = [
  "Game Specification Preparation",
  "Spec Briefing",
  "Art Development",
  "Engine Development",
  "Animation Development",
  "Sound Development",
  "Frontend Development",
  "UAT Push",
  "Group Testing",
  "Pre-Production",
  "Go Live",
] as const;

const STAGE_FUNCTIONS: Record<(typeof STAGE_NAMES)[number], Phase["function"]> = {
  "Game Specification Preparation": "Product",
  "Spec Briefing": "Product",
  "Art Development": "Art",
  "Engine Development": "Engine",
  "Animation Development": "Animation",
  "Sound Development": "Sound",
  "Frontend Development": "Frontend",
  "UAT Push": "QA",
  "Group Testing": "QA",
  "Pre-Production": "Product",
  "Go Live": "Product",
};

function isoOffset(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Build 11 phases per project. Date offsets are seeded by project index so
 * dates spread realistically before and after TODAY (2026-05-11).
 */
function buildPhases(): Phase[] {
  const baseDay = new Date("2026-02-01T00:00:00Z");
  const phases: Phase[] = [];

  projects.forEach((project, projIdx) => {
    // Each project's phases march forward 14 days. The "current phase" index
    // determines which phases are Done / In Progress / Pending.
    const currentIdx = STAGE_NAMES.indexOf(project.currentPhase as never);
    const projectShift = projIdx * 4; // staggers projects across the timeline

    STAGE_NAMES.forEach((name, stageIdx) => {
      const startOffset = projectShift + stageIdx * 14;
      const expectedStart = isoOffset(baseDay, startOffset);
      const expectedEnd = isoOffset(baseDay, startOffset + 10);

      // Latest dates are sometimes pushed; risky projects push more.
      const slip =
        project.riskLevel === "Critical" ? 6 :
        project.riskLevel === "High" ? 4 :
        project.riskLevel === "Medium" ? 2 : 0;
      const latestStart = isoOffset(baseDay, startOffset + (stageIdx % 3 === 0 ? slip : 0));
      const latestEnd = isoOffset(baseDay, startOffset + 10 + slip);

      let status: PhaseStatus = "Pending";
      let actualStart: string | undefined;
      let actualEnd: string | undefined;
      if (currentIdx === -1 || stageIdx < currentIdx) {
        status = "Done";
        actualStart = latestStart;
        actualEnd = latestEnd;
      } else if (stageIdx === currentIdx) {
        status =
          project.riskLevel === "Critical" ? "Delayed" :
          project.riskLevel === "High" ? "At Risk" : "In Progress";
        actualStart = latestStart;
      } else if (stageIdx === currentIdx + 1 && project.riskLevel === "Critical") {
        status = "At Risk";
      }

      // Cancelled / On Hold project — show pending for everything not yet done.
      if (project.status === "Cancelled") status = "Pending";

      phases.push({
        id: `${project.id}-s${stageIdx + 1}`,
        projectId: project.id,
        category: name === "Go Live" || name === "Pre-Production" ? "Milestone" : "Stage",
        function: STAGE_FUNCTIONS[name],
        name,
        status,
        latestStartDate: latestStart,
        latestEndDate: latestEnd,
        expectedStartDate: expectedStart,
        expectedEndDate: expectedEnd,
        actualStartDate: actualStart,
        actualEndDate: actualEnd,
      });
    });
  });
  return phases;
}

export const phases: Phase[] = buildPhases();

/* -------------------------------------------------------------------------- */
/*  Jira summaries                                                            */
/* -------------------------------------------------------------------------- */

export const jiraSummaries: JiraSummary[] = projects.map((p, i) => {
  const base = 6 + (i % 5) * 3;
  return {
    projectId: p.id,
    open: base + (p.riskLevel === "Critical" ? 7 : 2),
    inProgress: 4 + (i % 4),
    blocked:
      p.riskLevel === "Critical" ? 5 :
      p.riskLevel === "High" ? 3 :
      p.riskLevel === "Medium" ? 1 : 0,
    done: 18 + i * 2,
  };
});

/* -------------------------------------------------------------------------- */
/*  Resource workload (this month)                                            */
/* -------------------------------------------------------------------------- */

export const workload: Workload[] = [
  { role: "Artist",   weeks: [82,  95, 110,  88] },
  { role: "Animator", weeks: [70,  85,  98, 115] },
  { role: "Sound",    weeks: [45,  60,  72,  65] },
  { role: "Frontend", weeks: [90, 105, 118, 102] },
  { role: "Engine",   weeks: [78,  88,  92,  80] },
  { role: "QA",       weeks: [60,  92, 120, 108] },
];

/* -------------------------------------------------------------------------- */
/*  Risk notes + change history (per project, light data)                     */
/* -------------------------------------------------------------------------- */

export const riskNotes: RiskNote[] = [
  {
    id: "n-1",
    projectId: "p-002",
    at: "2026-05-09T09:14:00Z",
    author: "Devon Hayes",
    body: "UAT environment integration with payments gateway is blocking sign-off. Vendor ETA Wed.",
    severity: "High",
  },
  {
    id: "n-2",
    projectId: "p-004",
    at: "2026-05-10T15:42:00Z",
    author: "Rahul Iyer",
    body: "Pre-production load test failed at 8k concurrent. Engine team investigating queue depth.",
    severity: "Critical",
  },
  {
    id: "n-3",
    projectId: "p-008",
    at: "2026-05-08T11:20:00Z",
    author: "Hana Lee",
    body: "Banner artwork still pending final approval from brand. Delays frontend cutover by ~3 days.",
    severity: "High",
  },
  {
    id: "n-4",
    projectId: "p-010",
    at: "2026-05-10T18:05:00Z",
    author: "Ines Marchetti",
    body: "Group testing surfaced regressions in bonus round math model. Needs Engine review.",
    severity: "Critical",
  },
  {
    id: "n-5",
    projectId: "p-013",
    at: "2026-05-07T08:30:00Z",
    author: "Theo Nakamura",
    body: "Campaign assets locked, but production cutover window collides with mobile freeze.",
    severity: "High",
  },
];

export const changeLog: ChangeLogEntry[] = [
  { id: "c-1", projectId: "p-001", at: "2026-05-08T10:00:00Z", author: "Maya Tanaka", field: "Target Live Date", from: "2026-07-15", to: "2026-07-22" },
  { id: "c-2", projectId: "p-001", at: "2026-05-06T16:20:00Z", author: "Maya Tanaka", field: "Risk Level",       from: "Low",        to: "Medium" },
  { id: "c-3", projectId: "p-002", at: "2026-05-09T09:30:00Z", author: "Devon Hayes", field: "Current Phase",   from: "Group Testing", to: "UAT Push" },
  { id: "c-4", projectId: "p-004", at: "2026-05-10T14:00:00Z", author: "Rahul Iyer",  field: "Risk Level",       from: "High",       to: "Critical" },
];

/* -------------------------------------------------------------------------- */
/*  Lookups                                                                   */
/* -------------------------------------------------------------------------- */

export const getBrand = (id: string) => brands.find((b) => b.id === id);
export const getProject = (id: string) => projects.find((p) => p.id === id);
export const getPhases = (projectId: string) =>
  phases.filter((ph) => ph.projectId === projectId);
export const getJiraSummary = (projectId: string) =>
  jiraSummaries.find((j) => j.projectId === projectId);
export const getRiskNotes = (projectId: string) =>
  riskNotes.filter((n) => n.projectId === projectId);
export const getChangeLog = (projectId: string) =>
  changeLog.filter((c) => c.projectId === projectId);

export const allPics = Array.from(new Set(projects.map((p) => p.pic))).sort();
