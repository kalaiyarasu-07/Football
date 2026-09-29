"use client";

import { useMemo, useState } from "react";
import { Shot } from "@/lib/types";
import { mostTargetedZone } from "@/lib/analytics";

interface GoalMapProps {
  shots: Shot[];
  selectedShotId: string | null;
  onSelectShot: (shotId: string | null) => void;
}

const OUTCOME_COLOR: Record<Shot["outcome"], string> = {
  Goal: "#22c55e",
  Saved: "#38bdf8",
  Miss: "#f87171",
};

/** Convert normalized [0,1] shot coords into percentage-based CSS positions. */
function toPercent(n: number) {
  return `${(n * 100).toFixed(2)}%`;
}

export default function GoalMap({ shots, selectedShotId, onSelectShot }: GoalMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const targeted = useMemo(() => mostTargetedZone(shots), [shots]);

  const activeShot = shots.find((s) => s.id === (hoveredId ?? selectedShotId)) ?? null;
  // Determine tooltip horizontal anchoring so it doesn't spill off the card.
  const tooltipAlign = activeShot
    ? activeShot.x < 0.25
      ? "left"
      : activeShot.x > 0.75
      ? "right"
      : "center"
    : "center";

  return (
    <div className="card animate-in p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-white sm:text-lg">
            Goal Placement Map
          </h2>
          <p className="text-xs text-muted sm:text-sm">
            Every historical shot, plotted by goal zone. Hover for details, click to
            highlight in the table below.
          </p>
        </div>
        {targeted && (
          <span className="badge border border-accent/30 bg-accent-soft text-accent">
            Most targeted: {targeted}
          </span>
        )}
      </div>

      {/* Goal frame + markers */}
      <div className="relative mx-auto w-full max-w-2xl select-none">
        <div className="relative aspect-[4/3] w-full overflow-visible">
          {/* Frame + net + zone dividers (pure SVG) */}
          <svg
            viewBox="0 0 400 300"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="net" width="16" height="16" patternUnits="userSpaceOnUse">
                <path
                  d="M0 0 L16 16 M16 0 L0 16"
                  stroke="#1c2420"
                  strokeWidth="1"
                  fill="none"
                />
              </pattern>
              <linearGradient id="postGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e5e7eb" />
                <stop offset="100%" stopColor="#9ca3af" />
              </linearGradient>
            </defs>

            {/* net background */}
            <rect x="14" y="14" width="372" height="272" fill="url(#net)" />

            {/* zone quadrant fills (very subtle, alternating) */}
            <rect x="14" y="14" width="186" height="136" fill="#16a34a" opacity="0.06" />
            <rect x="200" y="14" width="186" height="136" fill="#38bdf8" opacity="0.05" />
            <rect x="14" y="150" width="186" height="136" fill="#f59e0b" opacity="0.05" />
            <rect x="200" y="150" width="186" height="136" fill="#f472b6" opacity="0.05" />

            {/* zone divider cross */}
            <line x1="200" y1="14" x2="200" y2="286" stroke="#2a332e" strokeWidth="2" strokeDasharray="6 5" />
            <line x1="14" y1="150" x2="386" y2="150" stroke="#2a332e" strokeWidth="2" strokeDasharray="6 5" />

            {/* goal frame (posts + crossbar) */}
            <rect
              x="14"
              y="14"
              width="372"
              height="272"
              fill="none"
              stroke="url(#postGradient)"
              strokeWidth="10"
              strokeLinejoin="round"
            />

            {/* zone labels */}
            <text x="30" y="38" fill="#8b978f" fontSize="14" fontWeight={700}>G1</text>
            <text x="356" y="38" fill="#8b978f" fontSize="14" fontWeight={700}>G2</text>
            <text x="30" y="272" fill="#8b978f" fontSize="14" fontWeight={700}>G3</text>
            <text x="356" y="272" fill="#8b978f" fontSize="14" fontWeight={700}>G4</text>
          </svg>

          {/* Shot markers (HTML overlay for easy tooltips/interaction) */}
          <div className="absolute" style={{ inset: "3.5% 3.5%" }}>
            {shots.map((shot) => {
              const isActive = shot.id === selectedShotId;
              const isHovered = shot.id === hoveredId;
              const color = OUTCOME_COLOR[shot.outcome];
              return (
                <button
                  key={shot.id}
                  type="button"
                  aria-label={`Shot ${shot.id}, zone ${shot.zone}, ${shot.outcome}`}
                  onMouseEnter={() => setHoveredId(shot.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(shot.id)}
                  onBlur={() => setHoveredId(null)}
                  onClick={() => onSelectShot(isActive ? null : shot.id)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-none"
                  style={{
                    left: toPercent(shot.x),
                    top: toPercent(shot.y),
                    zIndex: isActive || isHovered ? 20 : 10,
                  }}
                >
                  <span
                    className={`block rounded-full ring-2 transition-all duration-150 ${
                      isActive
                        ? "h-4 w-4 ring-white"
                        : isHovered
                        ? "h-3.5 w-3.5 ring-white/70"
                        : "h-2.5 w-2.5 ring-black/30 group-hover:h-3 group-hover:w-3"
                    }`}
                    style={{
                      backgroundColor: color,
                      boxShadow: isActive ? `0 0 0 4px ${color}33` : undefined,
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Tooltip */}
          {activeShot && (
            <div
              className="pointer-events-none absolute z-30 w-52 rounded-xl border border-surface-border bg-surface-light p-3 text-xs shadow-card animate-in"
              style={{
                left: toPercent(activeShot.x),
                top: toPercent(activeShot.y),
                transform:
                  tooltipAlign === "left"
                    ? "translate(0%, -115%)"
                    : tooltipAlign === "right"
                    ? "translate(-100%, -115%)"
                    : "translate(-50%, -115%)",
              }}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-semibold text-white">
                  Shot #{activeShot.id.split("-").pop()}
                </span>
                <span
                  className="badge"
                  style={{ backgroundColor: `${OUTCOME_COLOR[activeShot.outcome]}22`, color: OUTCOME_COLOR[activeShot.outcome] }}
                >
                  {activeShot.outcome}
                </span>
              </div>
              <dl className="space-y-1 text-muted">
                <div className="flex justify-between gap-2">
                  <dt>Zone</dt>
                  <dd className="font-medium text-white">{activeShot.zone}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Speed</dt>
                  <dd className="font-medium text-white">{activeShot.speedKmh} km/h</dd>
                </div>
                <div className="flex justify-between gap-2 truncate">
                  <dt>Match</dt>
                  <dd className="truncate font-medium text-white" title={activeShot.match}>
                    {activeShot.match}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Date</dt>
                  <dd className="font-medium text-white">{activeShot.date}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
        {(Object.keys(OUTCOME_COLOR) as Shot["outcome"][]).map((outcome) => (
          <div key={outcome} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: OUTCOME_COLOR[outcome] }}
            />
            {outcome}
          </div>
        ))}
      </div>
    </div>
  );
}
