"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SpeedBucket, TrendPoint, ZoneStat } from "@/lib/analytics";
import { GoalZone } from "@/lib/types";

interface AnalyticsChartsProps {
  speedDistribution: SpeedBucket[];
  zoneStats: ZoneStat[];
  trend: TrendPoint[];
}

const ZONE_COLOR: Record<GoalZone, string> = {
  G1: "#22c55e",
  G2: "#38bdf8",
  G3: "#f59e0b",
  G4: "#f472b6",
};

const OUTCOME_COLOR: Record<TrendPoint["outcome"], string> = {
  Goal: "#22c55e",
  Saved: "#38bdf8",
  Miss: "#f87171",
};

const tooltipStyle = {
  backgroundColor: "#171d1a",
  border: "1px solid #232b27",
  borderRadius: "0.75rem",
  color: "#f4f6f5",
  fontSize: "12px",
  padding: "8px 12px",
};

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="card animate-in flex flex-col p-4 sm:p-6">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white sm:text-base">{title}</h3>
        <p className="text-xs text-muted">{subtitle}</p>
      </div>
      <div className="h-64 w-full">{children}</div>
    </div>
  );
}

export default function AnalyticsCharts({
  speedDistribution,
  zoneStats,
  trend,
}: AnalyticsChartsProps) {
  const goalsByZone = zoneStats.map((z) => ({ zone: z.zone, goals: z.goals }));
  const avgSpeedByZone = zoneStats.map((z) => ({ zone: z.zone, avgSpeed: z.avgSpeed }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard title="Shot Speed Distribution" subtitle="Number of shots per speed band (km/h)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={speedDistribution} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#1e2622" vertical={false} />
            <XAxis dataKey="bucket" tick={{ fill: "#8b978f", fontSize: 11 }} axisLine={{ stroke: "#232b27" }} tickLine={false} />
            <YAxis tick={{ fill: "#8b978f", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(34,197,94,0.06)" }} />
            <Bar dataKey="count" name="Shots" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Average Speed by Zone" subtitle="Mean ball speed (km/h) per goal quadrant">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={avgSpeedByZone} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#1e2622" vertical={false} />
            <XAxis dataKey="zone" tick={{ fill: "#8b978f", fontSize: 11 }} axisLine={{ stroke: "#232b27" }} tickLine={false} />
            <YAxis tick={{ fill: "#8b978f", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="avgSpeed" name="Avg speed" radius={[6, 6, 0, 0]}>
              {avgSpeedByZone.map((entry) => (
                <Cell key={entry.zone} fill={ZONE_COLOR[entry.zone]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Goals by Zone" subtitle="Share of total goals scored per quadrant">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#8b978f" }} />
            <Pie
              data={goalsByZone}
              dataKey="goals"
              nameKey="zone"
              innerRadius="55%"
              outerRadius="82%"
              paddingAngle={3}
              stroke="none"
            >
              {goalsByZone.map((entry) => (
                <Cell key={entry.zone} fill={ZONE_COLOR[entry.zone]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Recent Performance Trend" subtitle="Shot speed over time, colored by outcome">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#1e2622" vertical={false} />
            <XAxis dataKey="shotNumber" tick={{ fill: "#8b978f", fontSize: 11 }} axisLine={{ stroke: "#232b27" }} tickLine={false} />
            <YAxis tick={{ fill: "#8b978f", fontSize: 11 }} axisLine={false} tickLine={false} domain={["dataMin - 5", "dataMax + 5"]} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={(label) => `Shot #${label}`}
              formatter={(value: number) => [`${value} km/h`, "Speed"]}
            />
            <Line
              type="monotone"
              dataKey="speedKmh"
              stroke="#22c55e"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload, index } = props as {
                  cx: number;
                  cy: number;
                  payload: TrendPoint;
                  index: number;
                };
                return (
                  <circle
                    key={`dot-${index}`}
                    cx={cx}
                    cy={cy}
                    r={3.5}
                    fill={OUTCOME_COLOR[payload.outcome]}
                    stroke="#0a0d0c"
                    strokeWidth={1}
                  />
                );
              }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
