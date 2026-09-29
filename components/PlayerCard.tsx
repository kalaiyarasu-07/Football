"use client";

import { useRouter } from "next/navigation";
import { Gauge, Goal, Shirt, Zap } from "lucide-react";
import { Player } from "@/lib/types";
import { SummaryMetrics } from "@/lib/analytics";
import { useSelection } from "@/lib/selection-context";

interface PlayerCardProps {
  player: Player;
  metrics: SummaryMetrics;
}

export default function PlayerCard({ player, metrics }: PlayerCardProps) {
  const router = useRouter();
  const { setSelectedPlayerId } = useSelection();

  function handleViewAnalytics() {
    setSelectedPlayerId(player.id);
    router.push("/");
  }

  const initials = player.name
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <div className="card card-hover animate-in flex flex-col p-5">
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-semibold text-black"
          style={{ backgroundColor: player.avatarColor }}
        >
          {initials}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-white">{player.name}</h3>
          <p className="flex items-center gap-1 truncate text-xs text-muted">
            <Shirt className="h-3.5 w-3.5 shrink-0" />
            {player.position} · {player.team} · #{player.number}
          </p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-surface-border bg-surface-light py-3">
          <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-md bg-accent-soft text-accent">
            <Goal className="h-3.5 w-3.5" />
          </div>
          <div className="text-lg font-semibold text-white">{metrics.totalGoals}</div>
          <div className="text-[10px] uppercase tracking-wide text-muted">Goals</div>
        </div>
        <div className="rounded-xl border border-surface-border bg-surface-light py-3">
          <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-md bg-surface text-muted">
            <Gauge className="h-3.5 w-3.5" />
          </div>
          <div className="text-lg font-semibold text-white">{metrics.avgSpeed}</div>
          <div className="text-[10px] uppercase tracking-wide text-muted">Avg km/h</div>
        </div>
        <div className="rounded-xl border border-surface-border bg-surface-light py-3">
          <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-md bg-surface text-muted">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <div className="text-lg font-semibold text-white">{metrics.maxSpeed}</div>
          <div className="text-[10px] uppercase tracking-wide text-muted">Max km/h</div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-xs text-muted">
        <span>{metrics.totalShots} total shots</span>
        <span className="font-medium text-accent">{metrics.conversionRate}% conversion</span>
      </div>

      <button
        type="button"
        onClick={handleViewAnalytics}
        className="mt-auto w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-black transition-colors hover:bg-accent-bright"
      >
        View Analytics
      </button>
    </div>
  );
}
