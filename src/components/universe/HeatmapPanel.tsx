"use client";

import { HeatmapCell } from "@/lib/types";

export function HeatmapPanel({ cells }: { cells: HeatmapCell[] }) {
  const sorted = [...cells].sort((a, b) =>
    a.facility.localeCompare(b.facility),
  );
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_25px_80px_rgba(8,12,30,0.45)] backdrop-blur-2xl">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Universe Heatmap</h2>
          <p className="text-sm text-white/60">Demand x utilization by shift</p>
        </div>
      </header>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {sorted.map((cell) => (
          <div
            key={`${cell.facility}-${cell.shift}`}
            className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/80 to-indigo-950/60 p-4"
          >
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>{cell.facility}</span>
              <span className="uppercase tracking-wide">{cell.shift}</span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase text-white/50">Demand</p>
                <p className="text-2xl font-semibold text-white">
                  {(cell.demandScore * 100).toFixed(0)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase text-white/50">Utilization</p>
                <p className="text-2xl font-semibold text-sky-300">
                  {cell.utilization.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
                style={{ width: `${Math.min(cell.utilization, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
