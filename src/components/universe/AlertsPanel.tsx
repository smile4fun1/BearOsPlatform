"use client";

import { AlertInsight } from "@/lib/types";

const severityColors: Record<AlertInsight["severity"], string> = {
  low: "from-slate-700/60 to-slate-900/40",
  medium: "from-amber-500/20 to-orange-500/10",
  high: "from-rose-500/20 to-red-600/20",
  critical: "from-red-600/30 to-rose-600/30",
};

export function AlertsPanel({ alerts }: { alerts: AlertInsight[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_25px_80px_rgba(8,12,30,0.45)] backdrop-blur-2xl">
      <header>
        <h2 className="text-xl font-semibold text-white">Incident Radar</h2>
        <p className="text-sm text-white/60">
          AI-created blockers + human owners and ETAs
        </p>
      </header>
      <div className="mt-4 space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`group rounded-2xl border border-white/10 bg-gradient-to-r ${severityColors[alert.severity]} p-4 transition-all duration-300 hover:scale-[1.02] hover:border-white/20`}
          >
            <div className="flex items-center justify-between text-sm text-white/70 transition-colors duration-300 group-hover:text-white/90">
              <span className="capitalize">{alert.severity} priority</span>
              <span>{alert.etaHours}h ETA</span>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-white transition-transform duration-300 group-hover:scale-[1.01]">
              {alert.title}
            </h3>
            <p className="mt-1 text-sm text-white/70 transition-colors duration-300 group-hover:text-white/90">{alert.detail}</p>
            <p className="mt-3 text-xs uppercase tracking-wide text-white/50 transition-colors duration-300 group-hover:text-white/70">
              Owner: {alert.owner}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
