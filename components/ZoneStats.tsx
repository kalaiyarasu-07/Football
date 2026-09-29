import { ZoneStat } from "@/lib/analytics";
import { GoalZone } from "@/lib/types";

interface ZoneStatsProps {
  zoneStats: ZoneStat[];
  mostTargeted: GoalZone | null;
}

const ZONE_COLOR: Record<GoalZone, string> = {
  G1: "#22c55e",
  G2: "#38bdf8",
  G3: "#f59e0b",
  G4: "#f472b6",
};

export default function ZoneStats({ zoneStats, mostTargeted }: ZoneStatsProps) {
  return (
    <div className="card animate-in p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-white sm:text-lg">Zone Statistics</h2>
        <span className="text-xs text-muted sm:text-sm">Goals & share by quadrant</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {zoneStats.map((stat) => {
          const isTop = stat.zone === mostTargeted;
          return (
            <div
              key={stat.zone}
              className={`relative overflow-hidden rounded-xl border p-4 transition-colors ${
                isTop
                  ? "border-accent/50 bg-accent-soft"
                  : "border-surface-border bg-surface-light"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: ZONE_COLOR[stat.zone] }}
                />
                <span className="text-sm font-semibold text-white">{stat.zone}</span>
                {isTop && (
                  <span className="badge ml-auto bg-accent/20 text-[10px] text-accent">
                    Top zone
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-semibold text-white sm:text-2xl">
                  {stat.goals}
                </span>
                <span className="text-xs text-muted">goals</span>
              </div>
              <div className="mt-1 text-xs text-muted">
                {stat.goalPercentOfTotalGoals}% of total goals
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/30">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${stat.goalPercentOfTotalGoals}%`,
                    backgroundColor: ZONE_COLOR[stat.zone],
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
                <span>{stat.shots} shots</span>
                <span>{stat.avgSpeed} km/h avg</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
