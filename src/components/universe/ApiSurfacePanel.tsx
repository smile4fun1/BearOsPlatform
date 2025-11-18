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
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#060d1d] to-[#0a1428] p-6 text-white">
      <header className="flex items-center gap-3">
        <Globe className="size-6 text-sky-300" />
        <div>
          <h2 className="text-xl font-semibold">Bear Cloud Surfaces</h2>
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
              <h3 className="text-lg font-semibold">{api.name}</h3>
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
