"use client";

import { KPICard } from "@/lib/types";
import clsx from "clsx";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

const iconMap = {
  up: TrendingUp,
  down: TrendingDown,
  steady: Minus,
};

const momentumStyles = {
  up: "text-emerald-300 bg-emerald-500/10 border-emerald-500/40",
  down: "text-rose-300 bg-rose-500/10 border-rose-500/40",
  steady: "text-slate-300 bg-slate-500/10 border-slate-500/30",
};

export function KPICardGrid({ cards }: { cards: KPICard[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = iconMap[card.momentum];
        return (
          <article
            key={card.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.45)] backdrop-blur-3xl"
          >
            <header className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-[0.3em] text-white/60">
                {card.label}
              </span>
              <div
                className={clsx(
                  "flex items-center gap-1 rounded-full border px-2 py-1 text-xs",
                  momentumStyles[card.momentum],
                )}
              >
                <Icon size={14} />
                <span>{card.delta}</span>
              </div>
            </header>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-white">
              {card.value}
            </div>
            <p className="mt-3 text-sm text-white/70">{card.description}</p>
          </article>
        );
      })}
    </div>
  );
}
