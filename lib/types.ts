export type ProjectType = "Game" | "Feature" | "Campaign";

export type ProjectStatus =
  | "Planning"
  | "In Development"
  | "UAT Env"
  | "Production Env"
  | "Live"
  | "On Hold"
  | "Cancelled";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type PhaseStatus =
  | "Done"
  | "In Progress"
  | "At Risk"
  | "Delayed"
  | "Pending";

export type PhaseCategory = "Stage" | "Milestone";

export type FunctionTeam =
  | "Art"
  | "Animation"
  | "Sound"
  | "Frontend"
  | "Engine"
  | "QA"
  | "Product";

export interface Brand {
  id: string;
  name: string;
  owner: string;
}

export interface Project {
  id: string;
  brandId: string;
  name: string;
  type: ProjectType;
  pic: string;
  status: ProjectStatus;
  /** ISO date YYYY-MM-DD */
  targetLiveDate: string;
  currentPhase: string;
  riskLevel: RiskLevel;
  /** Primary function team responsible for the project. Optional — derived when omitted. */
  team?: FunctionTeam;
}

export interface Phase {
  id: string;
  projectId: string;
  category: PhaseCategory;
  function: FunctionTeam;
  /** Human-readable stage/milestone name */
  name: string;
  status: PhaseStatus;
  latestStartDate: string;
  latestEndDate: string;
  expectedStartDate: string;
  expectedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  /** Phase-level owner — defaults to project PIC if unset. */
  pic?: string;
  /** Free-text note attached to the phase/milestone. */
  remark?: string;
}

export interface JiraSummary {
  projectId: string;
  open: number;
  inProgress: number;
  blocked: number;
  done: number;
}

export type ResourceRole =
  | "Artist"
  | "Animator"
  | "Sound"
  | "Frontend"
  | "Engine"
  | "QA";

export interface Workload {
  role: ResourceRole;
  /** Utilization % per week of current month (0–120+) */
  weeks: number[];
}

export interface RiskNote {
  id: string;
  projectId: string;
  /** ISO datetime */
  at: string;
  author: string;
  body: string;
  severity: RiskLevel;
}

export interface ChangeLogEntry {
  id: string;
  projectId: string;
  at: string;
  author: string;
  field: string;
  from: string;
  to: string;
}
