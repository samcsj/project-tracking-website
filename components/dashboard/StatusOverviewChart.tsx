"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ProjectStatus } from "@/lib/types";
import { Card, CardHeader } from "@/components/ui/Card";

const COLORS: Record<ProjectStatus, string> = {
  Planning: "#94a3b8",
  "In Development": "#3b82f6",
  "UAT Env": "#f59e0b",
  "Production Env": "#8b5cf6",
  Live: "#10b981",
  "On Hold": "#cbd5e1",
  Cancelled: "#ef4444",
};

export function StatusOverviewChart({
  data,
}: {
  data: { name: ProjectStatus; value: number }[];
}) {
  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <Card className="h-full">
      <CardHeader
        title="Project Status Overview"
        subtitle={`${total} active projects across portfolio`}
      />
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              stroke="white"
              strokeWidth={2}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={COLORS[d.name]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 12,
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 12 }}
              formatter={(v) => <span className="text-slate-600">{v}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
