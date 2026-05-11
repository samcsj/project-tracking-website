"use client";

import { useMemo, useState } from "react";
import { phases, projects } from "@/lib/data";
import {
  buildDefaultConfig,
  deriveDefinitions,
  generateMasterViewColumns,
  generateMasterViewRows,
  type MasterViewConfig,
} from "@/lib/master-view";
import { MasterViewFilters } from "@/components/master-view/MasterViewFilters";
import { MasterViewTable } from "@/components/master-view/MasterViewTable";

export function MasterViewClient() {
  // Phase + milestone definitions are derived from data — never hardcoded.
  const { phaseDefs, milestoneDefs } = useMemo(() => deriveDefinitions(phases), []);

  const [config, setConfig] = useState<MasterViewConfig>(() =>
    buildDefaultConfig(phaseDefs, milestoneDefs),
  );

  const columns = useMemo(
    () => generateMasterViewColumns(config, phaseDefs, milestoneDefs),
    [config, phaseDefs, milestoneDefs],
  );

  const rows = useMemo(
    () => generateMasterViewRows(projects, phases, config),
    [config],
  );

  return (
    <div className="space-y-4">
      <MasterViewFilters
        config={config}
        onChange={setConfig}
        phaseDefs={phaseDefs}
        milestoneDefs={milestoneDefs}
        total={projects.length}
        filtered={rows.length}
      />
      <MasterViewTable columns={columns} rows={rows} />
    </div>
  );
}
