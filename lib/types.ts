/**
 * Core domain types for ShotVision.
 *
 * These types define the shape of data the dashboard consumes. They are
 * intentionally decoupled from *how* the data is produced, so the same
 * shapes can later be filled by a database, REST API, or live
 * camera/radar sensor pipeline instead of the local sample data used in
 * this MVP. See lib/dataSource.ts for the swappable data-access layer.
 */

/** The four quadrants of the goal, as viewed from the shooter's side. */
export type GoalZone = "G1" | "G2" | "G3" | "G4";

/** Result of an individual shot attempt. */
export type ShotOutcome = "Goal" | "Saved" | "Miss";

export type Position = "Forward" | "Midfielder" | "Winger" | "Striker";

export interface Player {
  id: string;
  name: string;
  position: Position;
  team: string;
  /** Squad number, purely cosmetic. */
  number: number;
  /** URL-safe initials/avatar color seed. */
  avatarColor: string;
}

export interface Shot {
  id: string;
  playerId: string;
  /** ISO date string, e.g. "2026-08-18". */
  date: string;
  match: string;
  zone: GoalZone;
  /** Ball speed at the moment of the shot, in km/h. */
  speedKmh: number;
  outcome: ShotOutcome;
  /** Normalized horizontal position inside the goal frame, 0 (left) - 1 (right). */
  x: number;
  /** Normalized vertical position inside the goal frame, 0 (top) - 1 (bottom). */
  y: number;
}

/** Metadata describing a zone for labelling and layout purposes. */
export interface ZoneMeta {
  id: GoalZone;
  label: string;
  description: string;
  /** Bounding box within the normalized 0-1 goal frame. */
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number };
}

export const ZONES: ZoneMeta[] = [
  {
    id: "G1",
    label: "G1 · Top Left",
    description: "Top-left quadrant",
    bounds: { xMin: 0, xMax: 0.5, yMin: 0, yMax: 0.5 },
  },
  {
    id: "G2",
    label: "G2 · Top Right",
    description: "Top-right quadrant",
    bounds: { xMin: 0.5, xMax: 1, yMin: 0, yMax: 0.5 },
  },
  {
    id: "G3",
    label: "G3 · Bottom Left",
    description: "Bottom-left quadrant",
    bounds: { xMin: 0, xMax: 0.5, yMin: 0.5, yMax: 1 },
  },
  {
    id: "G4",
    label: "G4 · Bottom Right",
    description: "Bottom-right quadrant",
    bounds: { xMin: 0.5, xMax: 1, yMin: 0.5, yMax: 1 },
  },
];

export const ALL_PLAYERS_ID = "all";
