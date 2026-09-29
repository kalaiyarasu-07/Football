"use client";

import { useMemo } from "react";
import { Users } from "lucide-react";
import { getPlayers, getShotsByPlayer } from "@/lib/dataSource";
import { computeSummary } from "@/lib/analytics";
import PlayerCard from "@/components/PlayerCard";

export default function PlayersPage() {
  const players = getPlayers();

  const metricsByPlayer = useMemo(() => {
    const map: Record<string, ReturnType<typeof computeSummary>> = {};
    players.forEach((p) => {
      map[p.id] = computeSummary(getShotsByPlayer(p.id));
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Users className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-white sm:text-2xl">Players</h1>
          <p className="text-sm text-muted">
            {players.length} players tracked this season. Select one to view full analytics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} metrics={metricsByPlayer[player.id]} />
        ))}
      </div>
    </div>
  );
}
