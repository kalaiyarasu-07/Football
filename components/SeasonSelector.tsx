"use client";

import { CalendarDays, ChevronDown } from "lucide-react";
import { useSelection } from "@/lib/selection-context";

interface SeasonSelectorProps {
  className?: string;
}

export default function SeasonSelector({ className = "" }: SeasonSelectorProps) {
  const { selectedSeason, setSelectedSeason, seasons } = useSelection();

  return (
    <div className={`relative ${className}`}>
      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <select
        aria-label="Select season"
        value={selectedSeason}
        onChange={(e) => setSelectedSeason(e.target.value)}
        className="w-full appearance-none rounded-xl border border-surface-border bg-surface-light py-2.5 pl-9 pr-9 text-sm font-medium text-foreground transition-colors hover:border-accent/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      >
        {seasons.map((s) => (
          <option key={s} value={s}>
            Season {s}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </div>
  );
}
