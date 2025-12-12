'use client';

import { Brain, Zap, CheckCircle2, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { TrainingPanel } from "@/components/universe/TrainingPanel";
import { DepartmentalModels } from "@/components/ai-models/DepartmentalModels";
import { composeCurationResponse } from "@/lib/dataCurator";
import { useRole } from "@/lib/roleContext";

export const dynamic = 'force-dynamic';

export default function AIModelsPage() {
  const { role } = useRole();
  const universe = composeCurationResponse();
  
  if (role !== 'internal_admin') {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Restricted Access</h2>
          <p>This module is only available to Bear Robotics Administrators.</p>
        </div>
      </div>
    );
  }

  // Calculate aggregate metrics
  const totalModels = universe.trainingPlans.length;
  const totalMilestones = universe.trainingPlans.reduce((sum, plan) => sum + plan.milestones.length, 0);
  const completedMilestones = universe.trainingPlans.reduce(
    (sum, plan) => sum + plan.milestones.filter(m => m.status === 'complete').length, 
    0
  );
  const avgValidation = universe.trainingPlans.reduce((sum, plan) => sum + plan.telemetry.validationScore, 0) / totalModels;
  const avgHallucination = universe.trainingPlans.reduce((sum, plan) => sum + plan.telemetry.hallucinationRate, 0) / totalModels;

  return (
    <div className="p-8 max-w-7xl mx-auto pb-32">
      {/* Page Header */}
      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3 text-sm text-indigo-400">
            <Brain className="h-5 w-5" />
            <span className="font-medium uppercase tracking-wider">AI Training</span>
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white lg:text-5xl">
            Model Orchestration Hub
          </h1>
          <p className="mt-3 text-lg text-white/60">
            Track training progress for large-scale models with real-time telemetry
          </p>
        </div>
        
        <div className="flex items-center gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-6 py-4">
          <div className="h-3 w-3 rounded-full bg-indigo-400 animate-pulse" />
          <div>
            <div className="text-sm font-semibold text-indigo-400">{totalModels} Models Active</div>
            <div className="text-xs text-white/50">Training in progress</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-indigo-400">
              <Brain className="h-5 w-5" />
              <span className="text-sm font-medium">Active Models</span>
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold text-white">{totalModels}</div>
          <div className="mt-2 text-sm text-white/50">70B + 120B parameters</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Milestones</span>
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold text-white">{completedMilestones}/{totalMilestones}</div>
          <div className="mt-2 text-sm text-white/50">Completion rate: {((completedMilestones / totalMilestones) * 100).toFixed(0)}%</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sky-400">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Avg Validation</span>
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold text-white">{avgValidation.toFixed(1)}%</div>
          <div className="mt-2 text-sm text-white/50">Across all models</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Hallucination</span>
            </div>
          </div>
          <div className="mt-4 text-3xl font-bold text-white">{avgHallucination.toFixed(2)}%</div>
          <div className="mt-2 text-sm text-white/50">Average rate</div>
        </div>
      </div>

      {/* Model Overview Cards */}
      <div className="mb-10 grid gap-6 lg:grid-cols-2">
        {universe.trainingPlans.map((plan) => {
          const completedCount = plan.milestones.filter(m => m.status === 'complete').length;
          const progress = (completedCount / plan.milestones.length) * 100;

          return (
            <div
              key={plan.model.id}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-rose-500/20">
                      <Brain className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{plan.model.name}</h3>
                      <p className="text-sm text-white/50">
                        {plan.model.size} · {plan.model.baseModel}
                      </p>
                    </div>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  plan.model.currentPhase === 'ready' 
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : plan.model.currentPhase === 'offline-eval'
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {plan.model.currentPhase.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              </div>

              {/* Objective */}
              <p className="mt-6 text-white/70 leading-relaxed">
                {plan.model.objective}
              </p>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-white/60">Training Progress</span>
                  <span className="font-semibold text-white">{progress.toFixed(0)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Telemetry */}
              <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div>
                  <div className="text-xs text-white/50">Validation</div>
                  <div className="mt-1 text-lg font-bold text-emerald-400">
                    {plan.telemetry.validationScore}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/50">Hallucination</div>
                  <div className="mt-1 text-lg font-bold text-rose-400">
                    {plan.telemetry.hallucinationRate}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/50">Last Run</div>
                  <div className="mt-1 text-lg font-bold text-white/80">
                    {new Date(plan.telemetry.lastRun).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="mt-6">
                <div className="mb-3 text-sm font-medium text-white/60">Milestones</div>
                <div className="space-y-2">
                  {plan.milestones.map((milestone, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
                    >
                      {milestone.status === 'complete' ? (
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                      ) : milestone.status === 'running' ? (
                        <Clock className="h-5 w-5 flex-shrink-0 text-sky-400 animate-pulse" />
                      ) : (
                        <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-white/20" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{milestone.label}</div>
                        <div className="text-xs text-white/50">{milestone.summary}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Training Details Panel */}
      <div className="mb-10">
        <h2 className="mb-6 text-2xl font-bold text-white">Detailed Training Metrics</h2>
        <TrainingPanel plans={universe.trainingPlans} />
      </div>

      {/* Departmental Models */}
      <div className="mb-10">
        <DepartmentalModels />
      </div>
    </div>
  );
}
