import { GoalZone, Shot, ShotOutcome, ZONES } from "@/lib/types";
import { players } from "@/data/players";

/**
 * Deterministic sample shot history.
 *
 * The shots below are generated (not hand-typed) so every player has a
 * realistic, varied set of attempts, but the output is fully
 * deterministic across builds thanks to a seeded PRNG — no randomness
 * leaks into the UI between server and client renders.
 *
 * Replace this module with a real fetch (database / REST API / camera
 * + radar pipeline) when wiring up live data — see lib/dataSource.ts.
 */

// ---- seeded PRNG (mulberry32) so data is stable across builds/renders ----
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MATCHES = [
  "MKCE vs PSG",
  "MKCE United vs Coimbatore FC",
  "Coimbatore FC vs PSG Academy",
  "MKCE United vs Chennai Rovers",
  "PSG Academy vs Chennai Rovers",
  "MKCE United vs Bangalore Blues",
  "Coimbatore FC vs Bangalore Blues",
  "Chennai Rovers vs PSG Academy",
  "MKCE United vs Madurai Sporting",
  "Coimbatore FC vs Madurai Sporting",
  "Bangalore Blues vs PSG Academy",
  "MKCE United vs Kochi Warriors",
];

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function randRange(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

/** Push a normalized coordinate away from dead-center within its zone. */
function jitterWithinZone(rng: () => number, zone: GoalZone) {
  const meta = ZONES.find((z) => z.id === zone)!;
  const { xMin, xMax, yMin, yMax } = meta.bounds;
  // Keep a small margin from the outer goal frame and the cross-hair
  // lines so markers never sit exactly on a boundary or dead center.
  const marginX = (xMax - xMin) * 0.14;
  const marginY = (yMax - yMin) * 0.14;
  const x = randRange(rng, xMin + marginX, xMax - marginX);
  const y = randRange(rng, yMin + marginY, yMax - marginY);
  return { x, y };
}

function randomDate(rng: () => number, startISO: string, endISO: string) {
  const start = new Date(startISO).getTime();
  const end = new Date(endISO).getTime();
  const t = start + rng() * (end - start);
  return new Date(t).toISOString().slice(0, 10);
}

interface PlayerProfile {
  seed: number;
  shotCount: number;
  speedMin: number;
  speedMax: number;
  /** Bias toward certain zones: weights for [G1, G2, G3, G4]. */
  zoneWeights: [number, number, number, number];
  goalRate: number; // 0-1 probability a shot on target is a Goal vs Saved
  missRate: number; // 0-1 probability the shot is an outright Miss
}

const PROFILES: Record<string, PlayerProfile> = {
  "arjun-kumar": {
    seed: 1001,
    shotCount: 32,
    speedMin: 78,
    speedMax: 105,
    zoneWeights: [0.3, 0.32, 0.16, 0.22],
    goalRate: 0.62,
    missRate: 0.12,
  },
  "daniel-joseph": {
    seed: 2002,
    shotCount: 29,
    speedMin: 68,
    speedMax: 96,
    zoneWeights: [0.22, 0.24, 0.26, 0.28],
    goalRate: 0.55,
    missRate: 0.16,
  },
  "rahul-prakash": {
    seed: 3003,
    shotCount: 27,
    speedMin: 58,
    speedMax: 88,
    zoneWeights: [0.35, 0.15, 0.35, 0.15],
    goalRate: 0.5,
    missRate: 0.18,
  },
  "alex-martin": {
    seed: 4004,
    shotCount: 26,
    speedMin: 55,
    speedMax: 92,
    zoneWeights: [0.2, 0.3, 0.2, 0.3],
    goalRate: 0.44,
    missRate: 0.22,
  },
};

function weightedZone(rng: () => number, weights: [number, number, number, number]): GoalZone {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  const zones: GoalZone[] = ["G1", "G2", "G3", "G4"];
  for (let i = 0; i < zones.length; i++) {
    r -= weights[i];
    if (r <= 0) return zones[i];
  }
  return zones[zones.length - 1];
}

function outcomeFor(rng: () => number, profile: PlayerProfile): ShotOutcome {
  const r = rng();
  if (r < profile.missRate) return "Miss";
  const remaining = 1 - profile.missRate;
  const goalThreshold = profile.missRate + remaining * profile.goalRate;
  if (r < goalThreshold) return "Goal";
  return "Saved";
}

function generateShotsForPlayer(playerId: string): Shot[] {
  const profile = PROFILES[playerId];
  const rng = mulberry32(profile.seed);
  const shots: Shot[] = [];

  for (let i = 0; i < profile.shotCount; i++) {
    const zone = weightedZone(rng, profile.zoneWeights);
    const outcome = outcomeFor(rng, profile);
    const { x, y } = jitterWithinZone(rng, zone);
    // Goals tend to be struck a touch harder on average than saves/misses.
    const speedBoost = outcome === "Goal" ? randRange(rng, 0, 6) : 0;
    const speedKmh = Math.round(
      Math.min(profile.speedMax, randRange(rng, profile.speedMin, profile.speedMax - 4) + speedBoost)
    );

    shots.push({
      id: `${playerId}-shot-${i + 1}`,
      playerId,
      date: randomDate(rng, "2026-02-01", "2026-09-20"),
      match: pick(rng, MATCHES),
      zone,
      speedKmh,
      outcome,
      x: Number(x.toFixed(3)),
      y: Number(y.toFixed(3)),
    });
  }

  // Sort chronologically so "recent" and "trend" views read naturally.
  shots.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  // Re-number shot ids in chronological order for readability.
  return shots.map((s, idx) => ({ ...s, id: `${playerId}-shot-${idx + 1}` }));
}

export const shots: Shot[] = players.flatMap((p) => generateShotsForPlayer(p.id));
