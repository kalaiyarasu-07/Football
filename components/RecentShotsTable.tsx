"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, RotateCcw, Search } from "lucide-react";
import { GoalZone, Shot } from "@/lib/types";

interface RecentShotsTableProps {
  shots: Shot[];
  selectedShotId?: string | null;
  onSelectShot?: (shotId: string | null) => void;
  title?: string;
  subtitle?: string;
  pageSize?: number;
  /** When provided, an extra "Player" column is rendered using this lookup. */
  playerNameById?: Record<string, string>;
}

type SortOption = "date-desc" | "date-asc" | "speed-desc" | "speed-asc";

const ZONE_FILTERS: ("All" | GoalZone)[] = ["All", "G1", "G2", "G3", "G4"];

const OUTCOME_STYLE: Record<Shot["outcome"], string> = {
  Goal: "bg-accent-soft text-accent",
  Saved: "bg-sky-500/10 text-sky-400",
  Miss: "bg-red-500/10 text-red-400",
};

export default function RecentShotsTable({
  shots,
  selectedShotId = null,
  onSelectShot,
  title = "Recent Shots",
  subtitle = "Search, filter, and sort every recorded attempt",
  pageSize = 10,
  playerNameById,
}: RecentShotsTableProps) {
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState<"All" | GoalZone>("All");
  const [sort, setSort] = useState<SortOption>("date-desc");
  const [visibleCount, setVisibleCount] = useState(pageSize);

  // Reset pagination whenever the active filter/sort combination changes.
  // Adjusting state during render (rather than in a useEffect) avoids an
  // extra render pass — this is the pattern React recommends for
  // "resetting state when a prop/derived value changes".
  const filterSignature = `${search}|${zoneFilter}|${sort}|${shots.length}|${pageSize}`;
  const [prevFilterSignature, setPrevFilterSignature] = useState(filterSignature);
  if (filterSignature !== prevFilterSignature) {
    setPrevFilterSignature(filterSignature);
    setVisibleCount(pageSize);
  }

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = shots.filter((s) => {
      const matchesZone = zoneFilter === "All" || s.zone === zoneFilter;
      const playerName = playerNameById?.[s.playerId]?.toLowerCase() ?? "";
      const matchesSearch =
        !q ||
        s.match.toLowerCase().includes(q) ||
        s.outcome.toLowerCase().includes(q) ||
        s.zone.toLowerCase().includes(q) ||
        s.date.includes(q) ||
        playerName.includes(q);
      return matchesZone && matchesSearch;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "date-asc":
          return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
        case "date-desc":
          return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
        case "speed-asc":
          return a.speedKmh - b.speedKmh;
        case "speed-desc":
          return b.speedKmh - a.speedKmh;
        default:
          return 0;
      }
    });

    return result;
  }, [shots, search, zoneFilter, sort, playerNameById]);

  const visible = filteredSorted.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSorted.length;

  function resetFilters() {
    setSearch("");
    setZoneFilter("All");
    setSort("date-desc");
  }

  return (
    <div className="card animate-in p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-white sm:text-lg">{title}</h2>
          <p className="text-xs text-muted sm:text-sm">{subtitle}</p>
        </div>
        <span className="text-xs text-muted">
          {filteredSorted.length} of {shots.length} shots
        </span>
      </div>

      {/* Controls */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 sm:min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search match, zone, outcome, date..."
            className="w-full rounded-xl border border-surface-border bg-surface-light py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <select
          aria-label="Filter by zone"
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value as "All" | GoalZone)}
          className="rounded-xl border border-surface-border bg-surface-light px-3 py-2.5 text-sm font-medium text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {ZONE_FILTERS.map((z) => (
            <option key={z} value={z}>
              {z === "All" ? "All zones" : z}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() =>
            setSort((prev) => (prev === "speed-desc" ? "speed-asc" : "speed-desc"))
          }
          className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface-light px-3 py-2.5 text-sm font-medium text-white transition-colors hover:border-accent/40"
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          Speed {sort === "speed-desc" ? "↓" : sort === "speed-asc" ? "↑" : ""}
        </button>

        <select
          aria-label="Sort by date"
          value={sort.startsWith("date") ? sort : "date-desc"}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-xl border border-surface-border bg-surface-light px-3 py-2.5 text-sm font-medium text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
        </select>

        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent/40 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-surface-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-3 py-2.5 font-medium">Shot #</th>
              {playerNameById && <th className="px-3 py-2.5 font-medium">Player</th>}
              <th className="px-3 py-2.5 font-medium">Date</th>
              <th className="px-3 py-2.5 font-medium">Match</th>
              <th className="px-3 py-2.5 font-medium">Zone</th>
              <th className="px-3 py-2.5 font-medium">Speed</th>
              <th className="px-3 py-2.5 font-medium">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((shot) => {
              const isSelected = shot.id === selectedShotId;
              return (
                <tr
                  key={shot.id}
                  id={`shot-row-${shot.id}`}
                  onClick={() => onSelectShot?.(isSelected ? null : shot.id)}
                  className={`cursor-pointer border-b border-surface-border/60 transition-colors last:border-0 ${
                    isSelected ? "bg-accent-soft" : "hover:bg-surface-light"
                  }`}
                >
                  <td className="px-3 py-2.5 font-mono text-xs text-muted">
                    #{shot.id.split("-").pop()}
                  </td>
                  {playerNameById && (
                    <td className="px-3 py-2.5 text-white">
                      {playerNameById[shot.playerId] ?? "—"}
                    </td>
                  )}
                  <td className="px-3 py-2.5 text-muted">{shot.date}</td>
                  <td className="px-3 py-2.5 text-white">{shot.match}</td>
                  <td className="px-3 py-2.5">
                    <span className="badge bg-surface-light text-white">{shot.zone}</span>
                  </td>
                  <td className="px-3 py-2.5 text-white">{shot.speedKmh} km/h</td>
                  <td className="px-3 py-2.5">
                    <span className={`badge ${OUTCOME_STYLE[shot.outcome]}`}>
                      {shot.outcome}
                    </span>
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={playerNameById ? 7 : 6}
                  className="px-3 py-8 text-center text-sm text-muted"
                >
                  No shots match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((v) => v + pageSize)}
            className="rounded-xl border border-surface-border bg-surface-light px-4 py-2 text-sm font-medium text-white transition-colors hover:border-accent/40"
          >
            Show more ({filteredSorted.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
