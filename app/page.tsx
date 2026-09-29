"use client";

import { useMemo, useState } from "react";
import { useSelection } from "@/lib/selection-context";
import { getPlayerById, getShotsByPlayer } from "@/lib/dataSource";
import {
  computeRecentShots,
  computeSpeedDistribution,
  computeSummary,
  computeTrend,
  computeZoneStats,
  mostTargetedZone,
} from "@/lib/analytics";
import SummaryCards from "@/components/SummaryCards";
import GoalMap from "@/components/GoalMap";
import ZoneStats from "@/components/ZoneStats";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import RecentShotsTable from "@/components/RecentShotsTable";
import FutureIntegrationNote from "@/components/FutureIntegrationNote";

export default function DashboardPage() {
  const { selectedPlayerId, selectedSeason } = useSelection();
  const [selectedShotId, setSelectedShotId] = useState<string | null>(null);

  const player = getPlayerById(selectedPlayerId);

  const shots = useMemo(() => {
    const all = getShotsByPlayer(selectedPlayerId);
    if (selectedSeason === "All") return all;
    return all.filter((s) => s.date.startsWith(selectedSeason));
  }, [selectedPlayerId, selectedSeason]);

  const summary = useMemo(() => computeSummary(shots), [shots]);
  const zoneStats = useMemo(() => computeZoneStats(shots), [shots]);
  const targeted = useMemo(() => mostTargetedZone(shots), [shots]);
  const speedDistribution = useMemo(() => computeSpeedDistribution(shots), [shots]);
  const trend = useMemo(() => computeTrend(shots), [shots]);
  const recentShots = useMemo(() => computeRecentShots(shots), [shots]);

  function handleSelectShot(shotId: string | null) {
    setSelectedShotId(shotId);
    if (shotId) {
      requestAnimationFrame(() => {
        document
          .getElementById(`shot-row-${shotId}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white sm:text-2xl">
          {player ? `${player.name}'s` : "Player"} Shooting Dashboard
        </h1>
        <p className="text-sm text-muted">
          {player ? `${player.position} · ${player.team} · #${player.number}` : ""}
          {selectedSeason !== "All" ? ` · Season ${selectedSeason}` : ""}
        </p>
      </div>

      <SummaryCards metrics={summary} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_1fr]">
        <GoalMap shots={shots} selectedShotId={selectedShotId} onSelectShot={handleSelectShot} />
        <ZoneStats zoneStats={zoneStats} mostTargeted={targeted} />
      </div>

      <AnalyticsCharts
        speedDistribution={speedDistribution}
        zoneStats={zoneStats}
        trend={trend}
      />

      <RecentShotsTable
        shots={recentShots}
        selectedShotId={selectedShotId}
        onSelectShot={handleSelectShot}
      />

      <FutureIntegrationNote />
    </div>
  );
}
