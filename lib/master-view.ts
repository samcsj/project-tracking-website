import type {
  FunctionTeam,
  Phase,
  Project,
  ProjectStatus,
  ProjectType,
  RiskLevel,
} from "@/lib/types";

/* -------------------------------------------------------------------------- */
/*  Domain enumerations                                                        */
/* -------------------------------------------------------------------------- */

export const DATE_TYPES = ["latest", "expected", "actual"] as const;
export type DateType = (typeof DATE_TYPES)[number];

export const FIELD_TYPES = ["pic", "status", "remark"] as const;
export type FieldType = (typeof FIELD_TYPES)[number];

export const DATE_TYPE_LABEL: Record<DateType, string> = {
  latest: "Latest",
  expected: "Expected",
  actual: "Actual",
};

export const FIELD_TYPE_LABEL: Record<FieldType, string> = {
  pic: "PIC",
  status: "Status",
  remark: "Remark",
};

/* -------------------------------------------------------------------------- */
/*  Config                                                                     */
/* -------------------------------------------------------------------------- */

export interface MasterViewProjectFilters {
  type: ProjectType | "";
  brand: string;
  team: FunctionTeam | "";
  pic: string;
  status: ProjectStatus | "";
  health: RiskLevel | "";
}

export interface MasterViewConfig {
  visiblePhases: Set<string>;
  visibleMilestones: Set<string>;
  visibleDateTypes: Set<DateType>;
  visibleFields: Set<FieldType>;
  projectFilters: MasterViewProjectFilters;
}

export const EMPTY_PROJECT_FILTERS: MasterViewProjectFilters = {
  type: "",
  brand: "",
  team: "",
  pic: "",
  status: "",
  health: "",
};

/* -------------------------------------------------------------------------- */
/*  Phase / milestone definitions — derived, never hardcoded                  */
/* -------------------------------------------------------------------------- */

export interface PhaseDefinition {
  name: string;
}
export interface MilestoneDefinition {
  name: string;
}

/**
 * Pull unique phase/milestone names from the phases dataset. Order follows
 * the first appearance in the data so callers don't need to know the canonical
 * STAGE_NAMES list.
 */
export function deriveDefinitions(phases: Phase[]): {
  phaseDefs: PhaseDefinition[];
  milestoneDefs: MilestoneDefinition[];
} {
  const phaseNames: string[] = [];
  const milestoneNames: string[] = [];
  const seenPhase = new Set<string>();
  const seenMilestone = new Set<string>();

  for (const ph of phases) {
    if (ph.category === "Stage" && !seenPhase.has(ph.name)) {
      seenPhase.add(ph.name);
      phaseNames.push(ph.name);
    } else if (ph.category === "Milestone" && !seenMilestone.has(ph.name)) {
      seenMilestone.add(ph.name);
      milestoneNames.push(ph.name);
    }
  }

  return {
    phaseDefs: phaseNames.map((name) => ({ name })),
    milestoneDefs: milestoneNames.map((name) => ({ name })),
  };
}

/* -------------------------------------------------------------------------- */
/*  Columns                                                                    */
/* -------------------------------------------------------------------------- */

export type StaticColumnKey =
  | "name"
  | "type"
  | "brand"
  | "team"
  | "pic"
  | "status"
  | "health"
  | "targetLiveDate";

export interface StaticColumn {
  kind: "static";
  key: StaticColumnKey;
  label: string;
}

export type PhaseDateKey =
  | "latestStart"
  | "latestEnd"
  | "expectedStart"
  | "expectedEnd"
  | "actualStart"
  | "actualEnd";

export interface PhaseColumn {
  kind: "phase";
  phaseName: string;
  field: PhaseDateKey | FieldType;
  label: string;
}

export type MilestoneDateKey = "latestDate" | "expectedDate" | "actualDate";

export interface MilestoneColumn {
  kind: "milestone";
  milestoneName: string;
  field: MilestoneDateKey | FieldType;
  label: string;
}

export type MasterViewColumn = StaticColumn | PhaseColumn | MilestoneColumn;

export interface ColumnGroup {
  /** Stable key for React. */
  key: string;
  /** Header label shown above the group. "" when no group header is wanted. */
  label: string;
  /** "static" or "phase" or "milestone" — drives header styling. */
  kind: "static" | "phase" | "milestone";
  columns: MasterViewColumn[];
}

/* The static project columns are always present. */
const STATIC_COLUMNS: StaticColumn[] = [
  { kind: "static", key: "name",            label: "Project Name" },
  { kind: "static", key: "type",            label: "Project Type" },
  { kind: "static", key: "brand",           label: "Brand" },
  { kind: "static", key: "team",            label: "Team" },
  { kind: "static", key: "pic",             label: "Project PIC" },
  { kind: "static", key: "status",          label: "Overall Status" },
  { kind: "static", key: "health",          label: "Health" },
  { kind: "static", key: "targetLiveDate",  label: "Target Rocket Launch Date" },
];

/**
 * Build column groups based on the current visibility config. Hidden phases,
 * milestones, date types, and fields are skipped entirely — never emitted as
 * empty placeholders.
 */
export function generateMasterViewColumns(
  config: MasterViewConfig,
  phaseDefs: PhaseDefinition[],
  milestoneDefs: MilestoneDefinition[],
): ColumnGroup[] {
  const groups: ColumnGroup[] = [];

  groups.push({
    key: "__static",
    label: "",
    kind: "static",
    columns: STATIC_COLUMNS,
  });

  for (const def of phaseDefs) {
    if (!config.visiblePhases.has(def.name)) continue;
    const cols = buildPhaseColumns(def.name, config);
    if (cols.length === 0) continue;
    groups.push({
      key: `phase:${def.name}`,
      label: def.name,
      kind: "phase",
      columns: cols,
    });
  }

  for (const def of milestoneDefs) {
    if (!config.visibleMilestones.has(def.name)) continue;
    const cols = buildMilestoneColumns(def.name, config);
    if (cols.length === 0) continue;
    groups.push({
      key: `milestone:${def.name}`,
      label: def.name,
      kind: "milestone",
      columns: cols,
    });
  }

  return groups;
}

function buildPhaseColumns(
  phaseName: string,
  config: MasterViewConfig,
): PhaseColumn[] {
  const cols: PhaseColumn[] = [];

  if (config.visibleDateTypes.has("latest")) {
    cols.push({ kind: "phase", phaseName, field: "latestStart", label: "Latest Start" });
    cols.push({ kind: "phase", phaseName, field: "latestEnd", label: "Latest End" });
  }
  if (config.visibleDateTypes.has("expected")) {
    cols.push({ kind: "phase", phaseName, field: "expectedStart", label: "Expected Start" });
    cols.push({ kind: "phase", phaseName, field: "expectedEnd", label: "Expected End" });
  }
  if (config.visibleDateTypes.has("actual")) {
    cols.push({ kind: "phase", phaseName, field: "actualStart", label: "Actual Start" });
    cols.push({ kind: "phase", phaseName, field: "actualEnd", label: "Actual End" });
  }
  if (config.visibleFields.has("pic")) {
    cols.push({ kind: "phase", phaseName, field: "pic", label: "PIC" });
  }
  if (config.visibleFields.has("status")) {
    cols.push({ kind: "phase", phaseName, field: "status", label: "Status" });
  }
  if (config.visibleFields.has("remark")) {
    cols.push({ kind: "phase", phaseName, field: "remark", label: "Remark" });
  }

  return cols;
}

function buildMilestoneColumns(
  milestoneName: string,
  config: MasterViewConfig,
): MilestoneColumn[] {
  const cols: MilestoneColumn[] = [];

  if (config.visibleDateTypes.has("latest")) {
    cols.push({ kind: "milestone", milestoneName, field: "latestDate", label: "Latest Date" });
  }
  if (config.visibleDateTypes.has("expected")) {
    cols.push({ kind: "milestone", milestoneName, field: "expectedDate", label: "Expected Date" });
  }
  if (config.visibleDateTypes.has("actual")) {
    cols.push({ kind: "milestone", milestoneName, field: "actualDate", label: "Actual Date" });
  }
  if (config.visibleFields.has("status")) {
    cols.push({ kind: "milestone", milestoneName, field: "status", label: "Status" });
  }
  if (config.visibleFields.has("remark")) {
    cols.push({ kind: "milestone", milestoneName, field: "remark", label: "Remark" });
  }

  return cols;
}

/* -------------------------------------------------------------------------- */
/*  Rows                                                                       */
/* -------------------------------------------------------------------------- */

export interface MasterViewRow {
  project: Project;
  /** Phase records keyed by phase/milestone name for O(1) cell lookup. */
  phasesByName: Record<string, Phase>;
}

/**
 * Transform projects + phases into row records, filtered by the active project
 * filters. Phases are indexed by name so the renderer can do constant-time
 * cell lookups.
 */
export function generateMasterViewRows(
  projects: Project[],
  phases: Phase[],
  config: MasterViewConfig,
): MasterViewRow[] {
  const filtered = applyProjectFilters(projects, config.projectFilters);
  const byProject = new Map<string, Phase[]>();
  for (const ph of phases) {
    const list = byProject.get(ph.projectId);
    if (list) list.push(ph);
    else byProject.set(ph.projectId, [ph]);
  }

  return filtered.map((project) => {
    const phasesByName: Record<string, Phase> = {};
    for (const ph of byProject.get(project.id) ?? []) {
      phasesByName[ph.name] = ph;
    }
    return { project, phasesByName };
  });
}

function applyProjectFilters(
  projects: Project[],
  f: MasterViewProjectFilters,
): Project[] {
  return projects.filter(
    (p) =>
      (!f.type || p.type === f.type) &&
      (!f.brand || p.brandId === f.brand) &&
      (!f.team || p.team === f.team) &&
      (!f.pic || p.pic === f.pic) &&
      (!f.status || p.status === f.status) &&
      (!f.health || p.riskLevel === f.health),
  );
}

/* -------------------------------------------------------------------------- */
/*  Cell value extraction                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Pull the raw value for a single column out of a row. Returns `undefined`
 * when the phase doesn't exist on the project or the field is empty.
 */
export function getCellValue(
  row: MasterViewRow,
  col: MasterViewColumn,
): string | undefined {
  if (col.kind === "static") {
    const p = row.project;
    switch (col.key) {
      case "name":           return p.name;
      case "type":           return p.type;
      case "brand":          return p.brandId;
      case "team":           return p.team;
      case "pic":            return p.pic;
      case "status":         return p.status;
      case "health":         return p.riskLevel;
      case "targetLiveDate": return p.targetLiveDate;
    }
  }

  if (col.kind === "phase") {
    const ph = row.phasesByName[col.phaseName];
    if (!ph) return undefined;
    switch (col.field) {
      case "latestStart":    return ph.latestStartDate;
      case "latestEnd":      return ph.latestEndDate;
      case "expectedStart":  return ph.expectedStartDate;
      case "expectedEnd":    return ph.expectedEndDate;
      case "actualStart":    return ph.actualStartDate;
      case "actualEnd":      return ph.actualEndDate;
      case "pic":            return ph.pic;
      case "status":         return ph.status;
      case "remark":         return ph.remark;
    }
  }

  // milestone
  const ph = row.phasesByName[col.milestoneName];
  if (!ph) return undefined;
  switch (col.field) {
    case "latestDate":   return ph.latestEndDate;
    case "expectedDate": return ph.expectedEndDate;
    case "actualDate":   return ph.actualEndDate;
    case "status":       return ph.status;
    case "remark":       return ph.remark;
  }
}

/**
 * Convenience factory — a config with everything visible. Use as the default
 * starting state and let the user narrow it down.
 */
export function buildDefaultConfig(
  phaseDefs: PhaseDefinition[],
  milestoneDefs: MilestoneDefinition[],
): MasterViewConfig {
  return {
    visiblePhases: new Set(phaseDefs.map((d) => d.name)),
    visibleMilestones: new Set(milestoneDefs.map((d) => d.name)),
    visibleDateTypes: new Set<DateType>(DATE_TYPES),
    visibleFields: new Set<FieldType>(FIELD_TYPES),
    projectFilters: { ...EMPTY_PROJECT_FILTERS },
  };
}
