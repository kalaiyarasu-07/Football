"use client";

import { useMemo, useState } from "react";
import { History } from "lucide-react";
import { useSelection } from "@/lib/selection-context";
import { getAllShots, getPlayerById, getPlayers, getShotsByPlayer } from "@/lib/dataSource";
import RecentShotsTable from "@/components/RecentShotsTable";

type Scope = "selected" | "all";

export default function ShotHistoryPage() {
  const { selectedPlayerId, selectedSeason } = useSelection();
  const [scope, setScope] = useState<Scope>("selected");

  const player = getPlayerById(selectedPlayerId);
  const players = getPlayers();

  const playerNameById = useMemo(() => {
    const map: Record<string, string> = {};
    players.forEach((p) => (map[p.id] = p.name));
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shots = useMemo(() => {
    const base = scope === "all" ? getAllShots() : getShotsByPlayer(selectedPlayerId);
    if (selectedSeason === "All") return base;
    return base.filter((s) => s.date.startsWith(selectedSeason));
  }, [scope, selectedPlayerId, selectedSeason]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <History className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-white sm:text-2xl">Shot History</h1>
            <p className="text-sm text-muted">
              {scope === "all"
                ? "Every recorded shot across all players"
                : `All shots recorded for ${player?.name ?? "selected player"}`}
              {selectedSeason !== "All" ? ` · Season ${selectedSeason}` : ""}
            </p>
          </div>
        </div>

        <div className="inline-flex rounded-xl border border-surface-border bg-surface-light p-1">
          <button
            type="button"
            onClick={() => setScope("selected")}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              scope === "selected" ? "bg-accent text-black" : "text-muted hover:text-white"
            }`}
          >
            Selected player
          </button>
          <button
            type="button"
            onClick={() => setScope("all")}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              scope === "all" ? "bg-accent text-black" : "text-muted hover:text-white"
            }`}
          >
            All players
          </button>
        </div>
      </div>

      <RecentShotsTable
        shots={shots}
        title="Full Shot Log"
        subtitle="Filter, sort, and page through the complete shot record"
        pageSize={12}
        playerNameById={scope === "all" ? playerNameById : undefined}
      />
    </div>
  );
}
