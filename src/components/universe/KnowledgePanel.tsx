"use client";

import { BearKnowledgeSlice } from "@/lib/types";
import { Book, Network } from "lucide-react";

export function KnowledgePanel({ slices }: { slices: BearKnowledgeSlice[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b1324] via-[#0f1c32] to-[#111b2e] p-6 text-white shadow-[0_25px_80px_rgba(4,7,16,0.7)]">
      <header className="flex items-center gap-3">
        <div className="rounded-2xl bg-white/5 p-3">
          <Book className="size-5 text-sky-300" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Bear Knowledge Core</h2>
          <p className="text-sm text-white/60">
            What the Aurora Bear Lore model memorizes
          </p>
        </div>
      </header>
      <div className="mt-5 space-y-4">
        {slices.map((slice) => (
          <article
            key={slice.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-wide text-white/60">
              <span>{slice.topic}</span>
              <span>Updated {slice.lastUpdated}</span>
            </div>
            <p className="mt-2 text-sm text-white/80">{slice.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/50">
              {slice.sources.map((source) => (
                <span
                  key={source}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1"
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
