"use client";

import { TrainingPlan } from "@/lib/types";
import { Cpu, CheckCircle2, Circle } from "lucide-react";

export function TrainingPanel({ plans }: { plans: TrainingPlan[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b081c] via-[#0f1530] to-[#05060d] p-6 text-white">
      <header className="flex items-center gap-3">
        <Cpu className="size-6 text-violet-300" />
        <div>
          <h2 className="text-xl font-semibold">Model Training Orbits</h2>
          <p className="text-sm text-white/60">
            70B KPI analyst + 120B knowledge core
          </p>
        </div>
      </header>
      <div className="mt-5 space-y-5">
        {plans.map((plan) => (
          <article
            key={plan.model.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  {plan.model.size} / {plan.model.baseModel}
                </p>
                <h3 className="text-lg font-semibold">{plan.model.name}</h3>
              </div>
              <div className="text-right text-sm text-white/70">
                <p>{plan.model.tokens}</p>
                <p className="text-xs">
                  Last run{" "}
                  {new Date(plan.telemetry.lastRun).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/80">{plan.model.objective}</p>
            <div className="mt-4 grid gap-2 text-xs text-white/60 sm:grid-cols-2">
              <span>
                Validation {(plan.telemetry.validationScore * 100).toFixed(1)}%
              </span>
              <span>
                Hallucination{" "}
                {(plan.telemetry.hallucinationRate * 100).toFixed(2)}%
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {plan.milestones.map((milestone) => (
                <div
                  key={`${plan.model.id}-${milestone.label}`}
                  className="flex items-center gap-3 text-sm text-white/80"
                >
                  {milestone.status === "complete" ? (
                    <CheckCircle2 className="size-4 text-emerald-400" />
                  ) : milestone.status === "running" ? (
                    <Circle className="size-4 animate-pulse text-amber-300" />
                  ) : (
                    <Circle className="size-4 text-white/30" />
                  )}
                  <div>
                    <p className="font-medium">{milestone.label}</p>
                    <p className="text-xs text-white/60">{milestone.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
