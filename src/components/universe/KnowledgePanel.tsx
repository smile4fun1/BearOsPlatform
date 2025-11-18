"use client";

import { BearKnowledgeSlice } from "@/lib/types";
import { Book, Network } from "lucide-react";

export function KnowledgePanel({ slices }: { slices: BearKnowledgeSlice[] }) {
  return (
    <div className="bear-card p-6 transition-all duration-500 hover:border-white/20 hover:shadow-[0_30px_90px_rgba(8,12,30,0.55)]">
      <header className="flex items-center gap-3">
        <div className="rounded-2xl bg-white/10 p-3">
          <Book className="size-5 text-sky-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Bear Knowledge Core</h2>
          <p className="text-sm text-white/60">
            What the Aurora Bear Lore model memorizes
          </p>
        </div>
      </header>
      <div className="mt-5 space-y-4">
        {slices.map((slice) => (
          <article
            key={slice.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-wide text-white/50">
              <span>{slice.topic}</span>
              <span>Updated {slice.lastUpdated}</span>
            </div>
            <p className="mt-2 text-sm text-white/70">{slice.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
              {slice.sources.map((source) => (
                <span
                  key={source}
                  className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1"
                >
                  <Network className="size-3" />
                  {source}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
