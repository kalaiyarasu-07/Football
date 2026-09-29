/**
 * Data-access layer.
 *
 * Every component in this app reads player/shot data through the
 * functions below instead of importing data/players.ts and data/shots.ts
 * directly. That indirection is the seam where a future data source can
 * be swapped in without touching a single component:
 *
 *   - Supabase / PostgreSQL: replace the bodies below with query calls
 *     (e.g. `supabase.from("shots").select("*")`) and make them async.
 *   - REST API: replace with `fetch("/api/shots")`.
 *   - Live camera + radar feed: a small ingestion service would resolve
 *     ball position -> goal zone and ball speed -> speedKmh, then push
 *     Shot objects through the same shape consumed here (see the
 *     "Future Data Integration" note on the dashboard and the README).
 *
 * Because the current MVP is fully client-side and synchronous, these
 * are plain functions rather than Promises. Swapping to an async source
 * later only requires awaiting them at the call sites (React Query /
 * SWR / server components all drop in cleanly).
 */

import { players as playersData } from "@/data/players";
import { shots as shotsData } from "@/data/shots";
import { Player, Shot } from "@/lib/types";

export function getPlayers(): Player[] {
  return playersData;
}

export function getPlayerById(playerId: string): Player | undefined {
  return playersData.find((p) => p.id === playerId);
}

export function getAllShots(): Shot[] {
  return shotsData;
}

export function getShotsByPlayer(playerId: string): Shot[] {
  return shotsData.filter((s) => s.playerId === playerId);
}

/** Distinct season labels derivable from the current dataset (year-based). */
export function getSeasons(): string[] {
  const years = new Set(shotsData.map((s) => s.date.slice(0, 4)));
  return Array.from(years).sort();
}
