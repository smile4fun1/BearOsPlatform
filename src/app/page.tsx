import { KPICardGrid } from "@/components/universe/KPICardGrid";
import { TrendPanel } from "@/components/universe/TrendPanel";
import { HeatmapPanel } from "@/components/universe/HeatmapPanel";
import { AlertsPanel } from "@/components/universe/AlertsPanel";
import { KnowledgePanel } from "@/components/universe/KnowledgePanel";
import { FinancialPanel } from "@/components/universe/FinancialPanel";
import { ApiSurfacePanel } from "@/components/universe/ApiSurfacePanel";
import { TrainingPanel } from "@/components/universe/TrainingPanel";
import { InsightConsole } from "@/components/universe/InsightConsole";
import { composeCurationResponse } from "@/lib/dataCurator";

export default async function Home() {
  const universe = composeCurationResponse();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] text-white">
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:px-10">
        <section className="rounded-[40px] border border-white/10 bg-gradient-to-br from-[#090f2f] via-[#080d24] to-[#02040c] p-8 shadow-[0_30px_120px_rgba(3,4,10,0.8)] lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-5">
              <p className="text-xs uppercase tracking-[0.4em] text-sky-200">
                Bear Robotics · Seoul ↔ Silicon Valley
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Bear Universe
                <span className="block text-transparent bg-gradient-to-r from-sky-400 via-indigo-300 to-rose-400 bg-clip-text">
                  KPI + Knowledge AI constellation
                </span>
              </h1>
              <p className="text-lg text-white/70">
                Automation models curate Bear&apos;s operational lake, train 70B
                + 120B specialists, and surface executive-ready KPIs with Korean
                hospitality flavor.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-white/60">
                <span className="rounded-full border border-white/20 px-4 py-2">
                  Servi fleets · {universe.financials.at(-1)?.deployments ?? 0}+
                </span>
                <span className="rounded-full border border-white/20 px-4 py-2">
                  APIs {universe.apiSurfaces.length}
                </span>
                <span className="rounded-full border border-white/20 px-4 py-2">
                  Knowledge nodes {universe.knowledge.length}
                </span>
              </div>
            </div>
            <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80 sm:grid-cols-2">
              {universe.trainingPlans.map((plan) => (
                <div
                  key={plan.model.id}
                  className="rounded-2xl bg-black/30 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                    {plan.model.size} {plan.model.baseModel}
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {plan.model.name}
                  </p>
                  <p className="text-xs text-white/60">
                    Phase: {plan.model.currentPhase}
                  </p>
                  <p className="mt-2 text-xs text-white/50">
                    Deployment target: {plan.model.deploymentTarget}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <KPICardGrid cards={universe.kpis} />

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <TrendPanel data={universe.trend} />
          <AlertsPanel alerts={universe.alerts} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <HeatmapPanel cells={universe.heatmap} />
          <InsightConsole />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <KnowledgePanel slices={universe.knowledge} />
          <TrainingPanel plans={universe.trainingPlans} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <FinancialPanel snapshots={universe.financials} />
          <ApiSurfacePanel apis={universe.apiSurfaces} />
        </div>
      </main>
    </div>
  );
}
