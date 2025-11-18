import { Activity, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { KPICardGrid } from "@/components/universe/KPICardGrid";
import { TrendPanel } from "@/components/universe/TrendPanel";
import { HeatmapPanel } from "@/components/universe/HeatmapPanel";
import { InteractiveOpsTable } from "@/components/operations/InteractiveOpsTable";
import { InteractiveIncidentRadar } from "@/components/incidents/InteractiveIncidentRadar";
import { FleetPerformanceDashboard } from "@/components/operations/FleetPerformanceDashboard";
import { composeCurationResponse } from "@/lib/dataCurator";
import { operationsDataset } from "@/lib/mockData";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export const dynamic = 'force-dynamic';

export default async function OperationsPage() {
  const universe = composeCurationResponse();
  
  // Get latest operations data
  const latestOps = operationsDataset.slice(-10);
  const facilities = Array.from(new Set(operationsDataset.map(op => op.facility)));
  
  // Calculate real-time metrics
  const totalOrders = operationsDataset.reduce((sum, op) => sum + op.ordersServed, 0);
  const avgUptime = operationsDataset.reduce((sum, op) => sum + op.uptime, 0) / operationsDataset.length;
  const totalIncidents = operationsDataset.reduce((sum, op) => sum + op.incidents, 0);
  const avgNPS = operationsDataset.reduce((sum, op) => sum + op.nps, 0) / operationsDataset.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] text-white">
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        {/* Page Header */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3 text-sm text-sky-400">
              <Activity className="h-5 w-5" />
              <span className="font-medium uppercase tracking-wider">Live Operations</span>
            </div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight lg:text-5xl">
              Global Operations Dashboard
            </h1>
            <p className="mt-3 text-lg text-white/60">
              Real-time telemetry across {facilities.length} facilities monitoring Servi fleet performance
            </p>
          </div>
          
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-4">
            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-sm font-semibold text-emerald-400">All Systems Operational</div>
              <div className="text-xs text-white/50">Last updated: just now</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-6 transition-all hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sky-400">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Total Orders</span>
              </div>
            </div>
            <div className="mt-4 text-3xl font-bold">
              <AnimatedCounter value={totalOrders} duration={2500} separator />
            </div>
            <div className="mt-2 text-sm text-white/50">Across all facilities</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-6 transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-emerald-400">
                <Activity className="h-5 w-5" />
                <span className="text-sm font-medium">Avg Uptime</span>
              </div>
            </div>
            <div className="mt-4 text-3xl font-bold">
              <AnimatedCounter value={avgUptime} duration={2000} decimals={1} suffix="%" />
            </div>
            <div className="mt-2 text-sm text-white/50">Fleet-wide average</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-6 transition-all hover:border-rose-500/30 hover:shadow-lg hover:shadow-rose-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm font-medium">Incidents</span>
              </div>
            </div>
            <div className="mt-4 text-3xl font-bold">
              <AnimatedCounter value={totalIncidents} duration={1800} />
            </div>
            <div className="mt-2 text-sm text-white/50">Total logged</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-6 transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-indigo-400">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">Avg NPS</span>
              </div>
            </div>
            <div className="mt-4 text-3xl font-bold">
              <AnimatedCounter value={avgNPS} duration={1500} decimals={0} />
            </div>
            <div className="mt-2 text-sm text-white/50">Customer satisfaction</div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mb-10">
          <h2 className="mb-6 text-2xl font-bold">Key Performance Indicators</h2>
          <KPICardGrid cards={universe.kpis} />
        </div>

        {/* Fleet Performance Dashboard */}
        <div className="mb-10">
          <FleetPerformanceDashboard />
        </div>

        {/* Interactive Incident Radar */}
        <div className="mb-10">
          <InteractiveIncidentRadar />
        </div>

        {/* Trends */}
        <div className="mb-10">
          <TrendPanel data={universe.trend} />
        </div>

        {/* Heatmap */}
        <div className="mb-10">
          <h2 className="mb-6 text-2xl font-bold">Facility Heatmap</h2>
          <HeatmapPanel cells={universe.heatmap} />
        </div>

        {/* Interactive Operations Table */}
        <div className="mb-10">
          <h2 className="mb-6 text-2xl font-bold">Live Operations Data</h2>
          <InteractiveOpsTable operations={operationsDataset.slice(-50)} />
        </div>
      </main>
    </div>
  );
}

