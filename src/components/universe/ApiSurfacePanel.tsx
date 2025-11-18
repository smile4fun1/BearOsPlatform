"use client";

import { ApiSurface } from "@/lib/types";
import { Globe } from "lucide-react";

const availabilityColor = {
  public: "text-emerald-300 border-emerald-500/40",
  beta: "text-amber-300 border-amber-500/40",
  internal: "text-rose-300 border-rose-500/40",
};

export function ApiSurfacePanel({ apis }: { apis: ApiSurface[] }) {
  return (
    <div className="bear-card p-6 transition-all duration-500 hover:border-white/20 hover:shadow-[0_30px_90px_rgba(8,12,30,0.55)]">
      <header className="flex items-center gap-3">
        <Globe className="size-6 text-sky-400" />
        <div>
          <h2 className="text-xl font-bold text-white">Bear Cloud Surfaces</h2>
          <p className="text-sm text-white/60">
            APIs to plug into the universe
          </p>
        </div>
      </header>
      <div className="mt-5 space-y-4">
        {apis.map((api) => (
          <article
            key={api.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-white">{api.name}</h3>
              <span
                className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide ${availabilityColor[api.availability]}`}
              >
                {api.availability}
              </span>
            </div>
            <p className="mt-2 text-sm text-white/70">{api.purpose}</p>
            <div className="mt-3 grid gap-2 text-xs text-white/60 sm:grid-cols-2">
              <span>Latency: {api.latencyMs}ms p95</span>
              <span className="truncate">Base URL: {api.baseUrl}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
