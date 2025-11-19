import { Database, FileText, Cpu, DollarSign, Zap, TrendingUp, Activity } from "lucide-react";
import { KnowledgePanel } from "@/components/universe/KnowledgePanel";
import { ApiSurfacePanel } from "@/components/universe/ApiSurfacePanel";
import { FinancialPanel } from "@/components/universe/FinancialPanel";
import { composeCurationResponse } from "@/lib/dataCurator";
import { operationsDataset } from "@/lib/mockData";
import { Footer } from "@/components/Footer";

export const dynamic = 'force-dynamic';

export default async function DataLakePage() {
  const universe = composeCurationResponse();
  
  // Calculate data lake metrics
  const totalRecords = operationsDataset.length;
  const facilities = new Set(operationsDataset.map(op => op.facility)).size;
  const dataPoints = totalRecords * Object.keys(operationsDataset[0]).length;
  const avgRecordsPerDay = totalRecords / 112; // 16 weeks of data

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] text-white">
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        {/* Page Header */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3 text-sm text-rose-400">
              <Database className="h-5 w-5" />
              <span className="font-medium uppercase tracking-wider">Data Infrastructure</span>
            </div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight lg:text-5xl">
              Bear Data Lake
            </h1>
            <p className="mt-3 text-lg text-white/60">
              Centralized repository of operational telemetry, robot fleet data, knowledge base, and analytics across Servi Plus, Carti 100, and Carti 600 deployments
            </p>
          </div>
          
          <div className="flex items-center gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/10 px-6 py-4">
            <div className="h-3 w-3 rounded-full bg-sky-400 animate-pulse" />
            <div>
              <div className="text-sm font-semibold text-sky-400">Pipeline Active</div>
              <div className="text-xs text-white/50">Ingesting data in real-time</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-rose-400">
                <Database className="h-5 w-5" />
                <span className="text-sm font-medium">Total Records</span>
              </div>
            </div>
            <div className="mt-4 text-3xl font-bold">{totalRecords.toLocaleString()}</div>
            <div className="mt-2 text-sm text-white/50">{dataPoints.toLocaleString()} data points</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sky-400">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium">Facilities</span>
              </div>
            </div>
            <div className="mt-4 text-3xl font-bold">{facilities}</div>
            <div className="mt-2 text-sm text-white/50">Global coverage</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-indigo-400">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Ingestion Rate</span>
              </div>
            </div>
            <div className="mt-4 text-3xl font-bold">{avgRecordsPerDay.toFixed(0)}</div>
            <div className="mt-2 text-sm text-white/50">Records per day</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-emerald-400">
                <FileText className="h-5 w-5" />
                <span className="text-sm font-medium">Knowledge Base</span>
              </div>
            </div>
            <div className="mt-4 text-3xl font-bold">{universe.knowledge.length}</div>
            <div className="mt-2 text-sm text-white/50">Curated articles</div>
          </div>
        </div>

        {/* Data Sources Overview */}
        <div className="mb-10">
          <h2 className="mb-6 text-2xl font-bold">Data Sources</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20">
                  <Database className="h-6 w-6 text-sky-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Operations Dataset</h3>
                  <p className="text-sm text-white/50">{totalRecords} records</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/60">
                Shift-level telemetry including deliveries, uptime, NPS, incidents, battery performance, and energy consumption across global facilities.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">16 weeks</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">8 facilities</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">4 shifts/day</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                  <Activity className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Robot Fleet Telemetry</h3>
                  <p className="text-sm text-white/50">Real-time data streams</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/60">
                Live monitoring of Servi Plus, Carti 100, and Carti 600 robots including battery levels, location tracking, error states, and performance metrics.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Servi Plus</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Carti 100</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Carti 600</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                  <FileText className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Knowledge Base</h3>
                  <p className="text-sm text-white/50">{universe.knowledge.length} articles</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/60">
                Curated documentation covering Servi Plus, Carti 100, Carti 600 specifications, operational best practices, and technical documentation.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Robot Specs</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Operations</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Maintenance</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20">
                  <DollarSign className="h-6 w-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Financial Snapshots</h3>
                  <p className="text-sm text-white/50">{universe.financials.length} quarters</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/60">
                Quarterly ARR, pipeline, gross margin, and deployment metrics tracking business growth.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">ARR</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Pipeline</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Margins</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20">
                  <Cpu className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Training Telemetry</h3>
                  <p className="text-sm text-white/50">{universe.trainingPlans.length} models</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/60">
                Real-time metrics from AI model training including validation scores and hallucination rates.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">70B params</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">120B params</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
                  <Zap className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold">API Surfaces</h3>
                  <p className="text-sm text-white/50">{universe.apiSurfaces.length} endpoints</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/60">
                RESTful APIs for accessing curated data, insights, and operational metrics programmatically.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">REST</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">JSON</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                  <TrendingUp className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold">KPI Aggregations</h3>
                  <p className="text-sm text-white/50">{universe.kpis.length} metrics</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/60">
                Computed KPIs including deliveries completed, fleet uptime percentages, battery health, NPS scores, and incident rates.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Real-time</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Auto-delta</span>
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Base Section */}
        <div className="mb-10">
          <h2 className="mb-6 text-2xl font-bold">Knowledge Base</h2>
          <KnowledgePanel slices={universe.knowledge} />
        </div>

        {/* API Catalog */}
        <div className="mb-10">
          <h2 className="mb-6 text-2xl font-bold">API Catalog</h2>
          <ApiSurfacePanel apis={universe.apiSurfaces} />
        </div>

        {/* Financial Data */}
        <div className="mb-10">
          <h2 className="mb-6 text-2xl font-bold">Financial Insights</h2>
          <FinancialPanel snapshots={universe.financials} />
        </div>

        {/* Data Pipeline Architecture */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8">
          <h2 className="mb-6 text-2xl font-bold">Data Pipeline Architecture</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg">Data Ingestion</h3>
                <p className="mt-2 text-white/60">
                  Raw telemetry flows from Servi Plus, Carti 100, and Carti 600 robots across 8 global facilities via Bear Cloud API. 
                  Data includes deliveries, uptime, battery health, NPS, incidents, payload metrics, and energy consumption collected at shift-level granularity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg">Data Curation</h3>
                <p className="mt-2 text-white/60">
                  The <code className="rounded bg-white/10 px-2 py-1 text-sm">dataCurator.ts</code> module 
                  aggregates raw data into actionable KPIs, computes momentum deltas, analyzes fleet performance by model (Servi Plus, Carti 100, Carti 600), 
                  generates incident patterns, and tracks battery degradation trends.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg">API Layer</h3>
                <p className="mt-2 text-white/60">
                  RESTful endpoints (<code className="rounded bg-white/10 px-2 py-1 text-sm">/api/curation</code>, 
                  <code className="rounded bg-white/10 px-2 py-1 text-sm ml-1">/api/insights</code>) 
                  serve curated payloads to the frontend and external consumers with real-time updates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-lg">Frontend Visualization</h3>
                <p className="mt-2 text-white/60">
                  React components powered by Recharts render interactive dashboards with KPI cards, 
                  trend lines, incident radars with severity filtering, fleet status breakdowns, and AI-assisted troubleshooting 
                  for field engineers and operations teams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

