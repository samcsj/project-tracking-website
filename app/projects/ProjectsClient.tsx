"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProjectFilters, type FiltersState } from "@/components/projects/ProjectFilters";
import { ProjectsTable } from "@/components/projects/ProjectsTable";
import { projects } from "@/lib/data";
import type { ProjectStatus, RiskLevel } from "@/lib/types";

export function ProjectsClient() {
  const router = useRouter();
  const params = useSearchParams();

  const [filters, setFilters] = useState<FiltersState>({
    brand: params.get("brand") ?? "",
    status: (params.get("status") as ProjectStatus) ?? "",
    pic: params.get("pic") ?? "",
    risk: (params.get("risk") as RiskLevel) ?? "",
  });

  // Sync filters to URL so the view is deep-linkable.
  useEffect(() => {
    const sp = new URLSearchParams();
    if (filters.brand)  sp.set("brand",  filters.brand);
    if (filters.status) sp.set("status", filters.status);
    if (filters.pic)    sp.set("pic",    filters.pic);
    if (filters.risk)   sp.set("risk",   filters.risk);
    const qs = sp.toString();
    router.replace(qs ? `/projects?${qs}` : "/projects", { scroll: false });
  }, [filters, router]);

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (!filters.brand  || p.brandId === filters.brand) &&
          (!filters.status || p.status === filters.status) &&
          (!filters.pic    || p.pic === filters.pic) &&
          (!filters.risk   || p.riskLevel === filters.risk)
      ),
    [filters]
  );

  return (
    <div className="space-y-4">
      <ProjectFilters
        value={filters}
        onChange={setFilters}
        total={projects.length}
        filtered={filtered.length}
      />
      <ProjectsTable rows={filtered} />
    </div>
  );
}
