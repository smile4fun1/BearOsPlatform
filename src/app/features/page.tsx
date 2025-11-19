import { KPICardGrid } from "@/components/universe/KPICardGrid";
import { TrendPanel } from "@/components/universe/TrendPanel";
import { InteractiveIncidentRadar } from "@/components/incidents/InteractiveIncidentRadar";
import { KnowledgePanel } from "@/components/universe/KnowledgePanel";
import { FinancialPanel } from "@/components/universe/FinancialPanel";
import { ApiSurfacePanel } from "@/components/universe/ApiSurfacePanel";
import { TrainingPanel } from "@/components/universe/TrainingPanel";
import { BearFeaturesGrid } from "@/components/universe/BearFeaturesGrid";
import { UpcomingFeatures } from "@/components/universe/UpcomingFeatures";
import { composeCurationResponse } from "@/lib/dataCurator";
import { Footer } from "@/components/Footer";

export default async function FeaturesPage() {
  const universe = composeCurationResponse();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] text-white">
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:px-10">
        <section className="rounded-[40px] border border-white/10 bg-gradient-to-br from-[#090f2f] via-[#080d24] to-[#02040c] p-8 shadow-[0_30px_120px_rgba(3,4,10,0.8)] backdrop-blur-3xl transition-all duration-500 hover:shadow-[0_40px_140px_rgba(3,4,10,0.9)] lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-5">
              <p className="animate-fade-in text-xs uppercase tracking-[0.4em] text-sky-300">
                Bear Universe Platform
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Feature Showcase
                <span className="block bg-gradient-to-r from-sky-400 via-indigo-300 to-rose-400 bg-clip-text text-transparent">
                  All-in-One Dashboard
                </span>
              </h1>
              <p className="text-lg leading-relaxed text-white/70">
                Explore the complete Bear Universe feature set: real-time KPIs, fleet trends, 
                AI-powered incident detection, training monitoring, financial insights, and comprehensive analytics 
                for Servi Plus, Carti 100, and Carti 600 deployments.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-white/60">
                <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/10">
                  Robot Fleet · {universe.financials.at(-1)?.deployments ?? 0}+ units
                </span>
                <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/10">
                  APIs {universe.apiSurfaces.length}
                </span>
                <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/10">
                  Knowledge nodes {universe.knowledge.length}
                </span>
              </div>
            </div>
            <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80 backdrop-blur-sm sm:grid-cols-2">
              {universe.trainingPlans.map((plan) => (
                <div
                  key={plan.model.id}
                  className="group rounded-2xl border border-white/5 bg-black/30 p-4 transition-all duration-300 hover:scale-105 hover:border-white/10 hover:bg-black/40"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50 transition-colors duration-300 group-hover:text-white/70">
                    {plan.model.size} {plan.model.baseModel}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white transition-colors duration-300 group-hover:text-sky-300">
                    {plan.model.name}
                  </p>
                  <p className="text-xs text-white/60 transition-colors duration-300 group-hover:text-white/80">
                    Phase: {plan.model.currentPhase}
                  </p>
                  <p className="mt-2 text-xs text-white/50 transition-colors duration-300 group-hover:text-white/70">
                    Deployment target: {plan.model.deploymentTarget}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <KPICardGrid cards={universe.kpis} />

        <div className="grid gap-6 lg:grid-cols-1">
          <TrendPanel data={universe.trend} />
        </div>

        <InteractiveIncidentRadar />

        <BearFeaturesGrid />

        <UpcomingFeatures />

        <div className="grid gap-6 lg:grid-cols-2">
          <KnowledgePanel slices={universe.knowledge} />
          <TrainingPanel plans={universe.trainingPlans} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <FinancialPanel snapshots={universe.financials} />
          <ApiSurfacePanel apis={universe.apiSurfaces} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

