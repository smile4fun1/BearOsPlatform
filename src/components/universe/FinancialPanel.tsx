"use client";

import { FinancialSnapshot } from "@/lib/types";

export function FinancialPanel({
  snapshots,
}: {
  snapshots: FinancialSnapshot[];
}) {
  return (
    <div className="bear-card p-6 transition-all duration-500 hover:border-white/20 hover:shadow-[0_30px_90px_rgba(8,12,30,0.55)]">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Revenue Orbits</h2>
          <p className="text-sm text-white/60">ARR + pipeline + deployments</p>
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-white/50 font-bold">
          Bearrobotics.ai
        </span>
      </header>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {snapshots.map((snapshot) => (
          <article
            key={snapshot.quarter}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-indigo-900/50 p-4"
          >
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>{snapshot.quarter}</span>
              <span>{snapshot.deployments} fleets</span>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/50">
                  ARR
                </p>
                <p className="text-3xl font-bold text-white">
                  ${(snapshot.arrUsd / 1_000_000).toFixed(0)}M
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-white/50">
                  Pipeline
                </p>
                <p className="text-3xl font-bold text-emerald-400">
                  ${(snapshot.pipelineUsd / 1_000_000).toFixed(0)}M
                </p>
              </div>
            </div>
            <div className="mt-3 text-sm text-white/70">{snapshot.note}</div>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500"
                style={{ width: `${snapshot.grossMargin}%` }}
              />
            </div>
            <p className="mt-2 text-xs uppercase tracking-wide text-white/50">
              Gross Margin {snapshot.grossMargin}%
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
