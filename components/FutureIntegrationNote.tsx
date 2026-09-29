import { Cpu, Radar, Video } from "lucide-react";

export default function FutureIntegrationNote() {
  return (
    <div className="card animate-in overflow-hidden p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Cpu className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-white">Future Data Integration</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted">
              Camera and radar sensors can be connected later to provide real-time shot
              location and speed. The current dashboard uses historical sample data, and
              every component reads through a single data-access layer
              (<code className="rounded bg-black/30 px-1 py-0.5 text-xs">lib/dataSource.ts</code>)
              so a live feed can be swapped in without changing any UI code.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-muted">
          <span className="badge border border-surface-border bg-surface-light">
            <Video className="h-3.5 w-3.5" /> Camera
          </span>
          <span className="text-muted">+</span>
          <span className="badge border border-surface-border bg-surface-light">
            <Radar className="h-3.5 w-3.5" /> Radar
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 rounded-xl border border-dashed border-surface-border bg-black/20 p-4 font-mono text-[11px] text-muted sm:grid-cols-3 sm:text-xs">
        <div className="rounded-lg bg-surface-light px-3 py-2">
          Camera → Ball detection → x / y coordinates → Goal Zone
        </div>
        <div className="rounded-lg bg-surface-light px-3 py-2">
          Radar → Ball speed → speedKmh
        </div>
        <div className="rounded-lg bg-surface-light px-3 py-2">
          Both → Shot object → Dashboard
        </div>
      </div>
    </div>
  );
}
