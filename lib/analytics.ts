/**
 * Pure analytics functions.
 *
 * Every metric shown in the UI is derived here from raw Shot[] arrays.
 * Nothing is hardcoded and nothing is recalculated inline in components
 * — components call these functions and render the result. This keeps
 * the dashboard correct automatically as the underlying data source
 * changes (sample data today, a live feed later).
 */

import { GoalZone, Shot, ZONES } from "@/lib/types";

export interface SummaryMetrics {
  totalShots: number;
  totalGoals: number;
  avgSpeed: number;
  maxSpeed: number;
  conversionRate: number; // percentage, 0-100
}

export function computeSummary(shots: Shot[]): SummaryMetrics {
  const totalShots = shots.length;
  const totalGoals = shots.filter((s) => s.outcome === "Goal").length;
  const speeds = shots.map((s) => s.speedKmh);
  const avgSpeed = totalShots ? speeds.reduce((a, b) => a + b, 0) / totalShots : 0;
  const maxSpeed = totalShots ? Math.max(...speeds) : 0;
  const conversionRate = totalShots ? (totalGoals / totalShots) * 100 : 0;

  return {
    totalShots,
    totalGoals,
    avgSpeed: round1(avgSpeed),
    maxSpeed,
    conversionRate: round1(conversionRate),
  };
}

export interface ZoneStat {
  zone: GoalZone;
  label: string;
  shots: number;
  goals: number;
  goalPercentOfTotalGoals: number; // this zone's goals / all goals * 100
  goalPercentOfZoneShots: number; // this zone's conversion rate
  avgSpeed: number;
}

export function computeZoneStats(shots: Shot[]): ZoneStat[] {
  const totalGoals = shots.filter((s) => s.outcome === "Goal").length;

  return ZONES.map((meta) => {
    const zoneShots = shots.filter((s) => s.zone === meta.id);
    const zoneGoals = zoneShots.filter((s) => s.outcome === "Goal");
    const avgSpeed = zoneShots.length
      ? zoneShots.reduce((a, s) => a + s.speedKmh, 0) / zoneShots.length
      : 0;

    return {
      zone: meta.id,
      label: meta.label,
      shots: zoneShots.length,
      goals: zoneGoals.length,
      goalPercentOfTotalGoals: totalGoals ? round1((zoneGoals.length / totalGoals) * 100) : 0,
      goalPercentOfZoneShots: zoneShots.length
        ? round1((zoneGoals.length / zoneShots.length) * 100)
        : 0,
      avgSpeed: round1(avgSpeed),
    };
  });
}

export function mostTargetedZone(shots: Shot[]): GoalZone | null {
  if (!shots.length) return null;
  const counts: Record<GoalZone, number> = { G1: 0, G2: 0, G3: 0, G4: 0 };
  shots.forEach((s) => (counts[s.zone] += 1));
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]) as GoalZone;
}

export interface SpeedBucket {
  bucket: string;
  count: number;
}

/** Buckets speeds into 10 km/h bands for a distribution histogram. */
export function computeSpeedDistribution(shots: Shot[]): SpeedBucket[] {
  if (!shots.length) return [];
  const bucketSize = 10;
  const min = Math.floor(Math.min(...shots.map((s) => s.speedKmh)) / bucketSize) * bucketSize;
  const max = Math.ceil(Math.max(...shots.map((s) => s.speedKmh)) / bucketSize) * bucketSize;

  const buckets: SpeedBucket[] = [];
  for (let start = min; start < max; start += bucketSize) {
    const end = start + bucketSize;
    const count = shots.filter((s) => s.speedKmh >= start && s.speedKmh < end).length;
    buckets.push({ bucket: `${start}-${end}`, count });
  }
  return buckets;
}

export interface TrendPoint {
  date: string;
  speedKmh: number;
  outcome: Shot["outcome"];
  shotNumber: number;
}

/** Chronological shot speed trend for the "recent performance" chart. */
export function computeTrend(shots: Shot[]): TrendPoint[] {
  return [...shots]
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .map((s, idx) => ({
      date: s.date,
      speedKmh: s.speedKmh,
      outcome: s.outcome,
      shotNumber: idx + 1,
    }));
}

/** Most recent shots first, optionally limited. */
export function computeRecentShots(shots: Shot[], limit?: number): Shot[] {
  const sorted = [...shots].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return limit ? sorted.slice(0, limit) : sorted;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
