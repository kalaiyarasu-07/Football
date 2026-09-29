# ShotVision — Football Shot Analytics Dashboard

A premium, dark-themed analytics dashboard that visualizes historical football
shooting and goal-placement data using a **4-zone goal model**. Built as a
software-only MVP: no hardware, no camera/radar integration, no real-time
tracking — just a clean, well-architected app that's ready to accept real
sensor data later without any UI rework.

---

## 1. Project Overview

ShotVision lets a coach, analyst, or player review shooting performance across
a season:

- Where on the goal (which of 4 quadrants) shots tend to land
- How hard the ball is being struck (speed in km/h)
- How often shots convert into goals
- How a player's shooting trends over time

The goal frame is divided into four quadrants:

```
┌──────────┬───────────┐
│    G1    │     G2    │   G1 = Top Left      G2 = Top Right
├──────────┼───────────┤
│    G3    │     G4    │   G3 = Bottom Left   G4 = Bottom Right
└──────────┴───────────┘
```

Every shot has a normalized `(x, y)` position inside this frame (`0–1` on
each axis), which the **Goal Placement Map** renders as an interactive marker.

This is an MVP with local sample data — see [Future Hardware
Integration](#8-future-hardware-integration) for how it's designed to grow.

---

## 2. Feature List

### Global
- Responsive header with brand, navigation (**Dashboard / Players / Shot
  History**), a season selector, a player selector, and a mobile hamburger menu
- Selecting a player or season updates every page instantly (shared React
  context, no prop drilling, no page reload)

### Dashboard (`/`)
- **Player summary cards** — Total Goals, Total Shots, Average Shot Speed,
  Maximum Shot Speed, Goal Conversion % — all calculated live from the shot
  data, never hardcoded
- **Goal Placement Map** — the visual centerpiece. A pure SVG/HTML/CSS 4-zone
  goal with:
  - Historical shot markers placed at varied, realistic positions inside each
    zone (never dead-centered)
  - Hover tooltip showing Shot #, Zone, Speed, Match, Date, Outcome
  - Click-to-highlight: clicking a marker highlights it and scrolls to /
    highlights the matching row in the Recent Shots table below
- **Zone Statistics** — 4 cards (G1–G4) with goals scored, % of total goals,
  average speed, and a "Most Targeted Zone" badge
- **Analytics charts** (Recharts, all update live when the player/season
  changes):
  1. Shot Speed Distribution (histogram)
  2. Average Speed by Zone (bar)
  3. Goals by Zone (donut)
  4. Recent Performance Trend (speed over time, colored by outcome)
- **Recent Shots table** — search, zone filter, speed sort, date sort, reset,
  and "Show more" pagination
- **Future Data Integration** note explaining the hardware upgrade path

### Players (`/players`)
- Grid of player cards (4 sample players) showing name, position, team, goals,
  average speed, max speed, and conversion rate
- "View Analytics" button selects that player and navigates to the Dashboard

### Shot History (`/shots`)
- Full filterable/sortable table of shots
- Toggle between "Selected player" and "All players" (with a Player column
  added automatically when viewing all players)
- Same search / zone filter / sort / reset / pagination controls as the
  Dashboard table

---

## 3. Tech Stack

| Layer      | Choice                                     |
|------------|---------------------------------------------|
| Framework  | Next.js (App Router, TypeScript)             |
| UI         | React + Tailwind CSS                         |
| Charts     | Recharts                                     |
| Icons      | lucide-react                                 |
| Data       | Local TypeScript modules (no backend/DB)     |

No backend, database, or API keys are required to run this project.

---

## 4. Installation

Requires Node.js 18.18+ (Node 20 LTS recommended).

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**.

## 5. Production Build

```bash
npm run build
npm start
```

`npm run build` type-checks the whole project and produces an optimized
production build; `npm start` serves it.

Other scripts:

```bash
npm run lint   # ESLint (next/core-web-vitals rules)
```

---

## 6. Project Structure

```
app/
  layout.tsx           # Root layout: global providers, <Header/>
  page.tsx             # Dashboard (home)
  players/page.tsx     # Players grid
  shots/page.tsx       # Shot History table
  globals.css          # Tailwind directives + dark theme base styles

components/
  Header.tsx            # Global nav, brand, mobile menu
  PlayerSelector.tsx     # Player <select> bound to shared context
  SeasonSelector.tsx     # Season <select> bound to shared context
  SummaryCards.tsx       # Player summary metric cards
  GoalMap.tsx            # The 4-zone interactive goal visualization
  ZoneStats.tsx          # G1-G4 zone statistic cards
  AnalyticsCharts.tsx    # The 4 Recharts visualizations
  RecentShotsTable.tsx   # Searchable/sortable/paginated shot table
  PlayerCard.tsx         # Player card used on the Players page
  FutureIntegrationNote.tsx

data/
  players.ts            # Sample roster (4 players)
  shots.ts               # Deterministic sample shot generator (25+ per player)

lib/
  types.ts               # Player, Shot, GoalZone, ZONES, etc.
  dataSource.ts           # Swappable data-access layer (see below)
  analytics.ts             # All pure calculation functions
  selection-context.tsx     # Shared "selected player / season" React context

public/                  # Static assets
```

---

## 7. Data Layer & How to Add Players / Shots

### Adding a player

Add an entry to `data/players.ts`:

```ts
{
  id: "your-slug-id",
  name: "Your Player",
  position: "Forward", // "Forward" | "Midfielder" | "Winger" | "Striker"
  team: "Your Team",
  number: 10,
  avatarColor: "#22c55e",
}
```

### Adding shots

`data/shots.ts` generates shots from a small per-player "profile" (speed
range, zone preference weights, goal/save/miss rates) using a seeded random
number generator, so the data is realistic and varied but fully deterministic
across builds. To add a new player's shots, add a profile entry:

```ts
"your-slug-id": {
  seed: 5005,
  shotCount: 28,
  speedMin: 60,
  speedMax: 95,
  zoneWeights: [0.25, 0.25, 0.25, 0.25], // [G1, G2, G3, G4]
  goalRate: 0.5,   // share of on-target shots that are goals
  missRate: 0.15,  // share of shots that are outright misses
},
```

You can also hand-author individual `Shot` objects directly if you have real
match data — the shape is:

```ts
interface Shot {
  id: string;
  playerId: string;
  date: string;                              // "2026-08-18"
  match: string;                              // "MKCE vs PSG"
  zone: "G1" | "G2" | "G3" | "G4";
  speedKmh: number;                           // ~55-105
  outcome: "Goal" | "Saved" | "Miss";
  x: number;                                  // 0-1, normalized position
  y: number;                                  // 0-1, normalized position
}
```

### Calculations

Every metric shown in the UI (totals, averages, conversion %, per-zone
breakdowns, speed distribution, performance trend) is computed by pure
functions in `lib/analytics.ts`. Components never recalculate metrics inline —
they call these functions and render the result. This keeps every number on
screen correct automatically as the data source changes.

---

## 8. Future Hardware Integration

This dashboard is intentionally built as a **software-only MVP**. The
architecture is already shaped so that a real sensor pipeline can be
connected later without touching any component:

```
Camera → Ball detection → x/y coordinates → Goal Zone
Radar  → Ball speed      → speedKmh
Both   → Shot object     → Dashboard
```

Concretely:

1. Every component reads data exclusively through `lib/dataSource.ts`
   (`getPlayers`, `getShotsByPlayer`, `getAllShots`, `getSeasons`) instead of
   importing `data/players.ts` / `data/shots.ts` directly.
2. To go live, only `lib/dataSource.ts` needs to change:
   - **Supabase / PostgreSQL** — replace each function body with a query
     (e.g. `supabase.from("shots").select("*")`) and make the functions async.
   - **REST API** — replace with `fetch("/api/shots")` calls.
   - **Camera + radar feed** — an ingestion service resolves ball pixel
     position → normalized `x`/`y` → `GoalZone`, and radar pulses → `speedKmh`,
     then pushes a `Shot` object (the exact same shape used today) into the
     same data layer, e.g. via a WebSocket or a queue that
     `getShotsByPlayer` reads from.
3. Because all UI components consume `Shot[]` / `Player[]` and the pure
   functions in `lib/analytics.ts`, none of them need to know or care whether
   the array came from a JSON file or a live radar unit.

The Dashboard includes a small **"Future Data Integration"** panel
summarizing this pipeline for anyone browsing the app.

---

## 9. Limitations (MVP scope)

- All data is local, deterministic sample data — there is no database, API,
  authentication, or persistence layer.
- No hardware/camera/radar/YOLO/real-time tracking is implemented (by
  design — see [Future Hardware Integration](#8-future-hardware-integration)).
- "Season" is derived from the year portion of each shot's date; the sample
  data currently spans a single season (2026).
- Player and season selection state lives in React context and resets on a
  full page reload (no URL persistence or local storage in this MVP).
- Intended as a demo/MVP-quality codebase — not hardened for production auth,
  rate limiting, or multi-tenant usage.
#   F o o t b a l l  
 