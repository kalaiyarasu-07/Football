"use client";

import { ChevronDown, User } from "lucide-react";
import { useSelection } from "@/lib/selection-context";
import { getPlayers } from "@/lib/dataSource";

interface PlayerSelectorProps {
  className?: string;
}

export default function PlayerSelector({ className = "" }: PlayerSelectorProps) {
  const { selectedPlayerId, setSelectedPlayerId } = useSelection();
  const players = getPlayers();

  return (
    <div className={`relative ${className}`}>
      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <select
        aria-label="Select player"
        value={selectedPlayerId}
        onChange={(e) => setSelectedPlayerId(e.target.value)}
        className="w-full appearance-none rounded-xl border border-surface-border bg-surface-light py-2.5 pl-9 pr-9 text-sm font-medium text-foreground transition-colors hover:border-accent/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      >
        {players.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </div>
  );
}
