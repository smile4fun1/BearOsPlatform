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
  up: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  down: "text-rose-400 bg-rose-500/10 border-rose-500/30",
  steady: "text-gray-400 bg-white/5 border-white/20",
};

export function KPICardGrid({ cards }: { cards: KPICard[] }) {
  return (
    <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = iconMap[card.momentum];
        return (
          <article
            key={card.id}
            className="group rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 lg:p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/8 hover:-translate-y-1"
          >
            <header className="flex items-start justify-between gap-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-white/60 font-semibold leading-tight">
                {card.label}
              </span>
              <div
                className={clsx(
                  "flex items-center gap-1 rounded-full border px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium flex-shrink-0",
                  momentumStyles[card.momentum],
                )}
              >
                <Icon size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>{card.delta}</span>
              </div>
            </header>
            <div className="mt-3 sm:mt-4 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
              {card.value}
            </div>
            <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs lg:text-sm text-white/60 leading-relaxed line-clamp-2">{card.description}</p>
          </article>
        );
      })}
    </div>
  );
}
