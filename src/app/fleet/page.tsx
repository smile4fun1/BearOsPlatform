'use client';

import { memo, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, AlertTriangle, Bot, Zap, RefreshCw, ArrowRight } from "lucide-react";
import { LazyKPICardGrid, LazyTrendPanel, LazyInteractiveIncidentRadar, LazyFleetPerformanceDashboard, LazyRobotFleetStatus, LazyInteractiveOpsTable } from "@/components/LazyComponents";
import { composeCurationResponse } from "@/lib/dataCurator";
import { operationsDataset } from "@/lib/mockData";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useRole } from "@/lib/roleContext";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const dynamic = 'force-dynamic';

// Memoized stat card for performance - optimized animations
const StatCard = memo(function StatCard({ stat, index }: { stat: any; index: number }) {
  const colorClasses: Record<string, { icon: string; bg: string; text: string }> = {
    'bear-blue': { icon: 'bg-bear-blue/20 text-bear-blue', bg: 'from-bear-blue/10 to-bear-blue/5 hover:border-bear-blue/40', text: 'text-bear-blue' },
    'emerald-400': { icon: 'bg-emerald-500/20 text-emerald-400', bg: 'from-emerald-500/10 to-emerald-500/5 hover:border-emerald-500/40', text: 'text-emerald-400' },
    'rose-400': { icon: 'bg-rose-500/20 text-rose-400', bg: 'from-rose-500/10 to-rose-500/5 hover:border-rose-500/40', text: 'text-rose-400' },
    'purple-400': { icon: 'bg-purple-500/20 text-purple-400', bg: 'from-purple-500/10 to-purple-500/5 hover:border-purple-500/40', text: 'text-purple-400' },
  };

  const colors = colorClasses[stat.color] || colorClasses['bear-blue'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      className={`rounded-2xl border border-white/10 bg-gradient-to-br ${colors.bg} p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group`}
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className={`p-2 sm:p-2.5 rounded-xl ${colors.icon} transition-transform group-hover:scale-110`}>
          <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <span className={`text-xs sm:text-sm font-semibold ${colors.text}`}>{stat.label}</span>
      </div>
      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
        <AnimatedCounter 
          value={stat.value} 
          duration={800} 
          decimals={stat.decimals || 0}
          suffix={stat.suffix || ''}
          separator={!stat.suffix}
        />
      </div>
      <div className="text-xs sm:text-sm text-white/50">{stat.subtitle}</div>
    </motion.div>
  );
});

// Loading skeleton component
const SectionSkeleton = ({ height = "h-64" }: { height?: string }) => (
  <div className={`${height} w-full animate-pulse rounded-2xl bg-white/5 border border-white/5`} />
);

export default function FleetPage() {
  const { role } = useRole();
  
  // Memoize expensive calculations
  const { universe, facilities, totalOrders, avgUptime, totalIncidents, avgNPS } = useMemo(() => {
    const universe = composeCurationResponse();
    const facilities = Array.from(new Set(operationsDataset.map(op => op.facility)));
    const totalOrders = operationsDataset.reduce((sum, op) => sum + op.ordersServed, 0);
    const avgUptime = operationsDataset.reduce((sum, op) => sum + op.uptime, 0) / operationsDataset.length;
    const totalIncidents = operationsDataset.reduce((sum, op) => sum + op.incidents, 0);
    const avgNPS = operationsDataset.reduce((sum, op) => sum + op.nps, 0) / operationsDataset.length;
    return { universe, facilities, totalOrders, avgUptime, totalIncidents, avgNPS };
  }, []);

  // Permission check
  if (!['internal_admin', 'internal_rfe'].includes(role)) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen px-4">
        <motion.div 
          className="text-center bear-glass-card p-8 sm:p-12 max-w-md w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center mx-auto mb-5 sm:mb-6">
            <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-rose-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-sm sm:text-base text-gray-400 mb-6">You do not have permission to view fleet operations.</p>
          <Link href="/" className="btn-primary">
            Return to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Orders', value: totalOrders, icon: TrendingUp, color: 'bear-blue', subtitle: 'Across all facilities' },
    { label: 'Avg Uptime', value: avgUptime, icon: Activity, color: 'emerald-400', suffix: '%', decimals: 1, subtitle: 'Fleet-wide average' },
    { label: 'Incidents', value: totalIncidents, icon: AlertTriangle, color: 'rose-400', subtitle: 'Total logged' },
    { label: 'Avg NPS', value: avgNPS, icon: Zap, color: 'purple-400', decimals: 0, subtitle: 'Customer satisfaction' },
  ];

  return (
    <div className="h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto relative">
        <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-[1600px] mx-auto w-full">
      {/* Decorative Background - Optimized for performance */}
      <div className="fixed top-20 right-0 w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[600px] bg-bear-blue/5 rounded-full blur-3xl pointer-events-none opacity-30 will-change-transform" />
      <div className="fixed bottom-20 left-0 w-[200px] sm:w-[300px] lg:w-[400px] h-[200px] sm:h-[300px] lg:h-[400px] bg-purple-500/3 rounded-full blur-3xl pointer-events-none opacity-30 will-change-transform" />
      
      {/* Page Header */}
      <motion.header 
        className="relative mb-6 sm:mb-8 lg:mb-10"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-bear-blue mb-2 sm:mb-3">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-semibold uppercase tracking-wider">Live Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white mb-1 sm:mb-2">
              Fleet Operations
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/60">
              Real-time telemetry across <span className="text-white font-semibold">{facilities.length}</span> facilities
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button className="btn-tertiary text-sm sm:text-base">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <div className="flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 sm:px-5 py-3 sm:py-3.5">
              <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <div>
                <div className="text-xs sm:text-sm font-semibold text-emerald-400">All Systems Operational</div>
                <div className="text-[10px] sm:text-xs text-white/50">Last updated: just now</div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Quick Stats Grid */}
      <section className="mb-6 sm:mb-8 lg:mb-10 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </section>

      {/* Quick Access Card */}
      <motion.section 
        className="mb-6 sm:mb-8 lg:mb-10 bear-glass-card p-4 sm:p-5 lg:p-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-bear-blue" />
            Quick Access
          </h3>
          <Link href="/robots" className="text-bear-blue text-xs sm:text-sm font-semibold hover:underline flex items-center gap-1">
            View All Robots <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </div>
        <p className="text-xs sm:text-sm text-gray-400">
          Jump to individual robot pages or use the Fleet Management view for detailed control.
        </p>
      </motion.section>

      {/* KPI Cards */}
      <section className="mb-6 sm:mb-8 lg:mb-10">
        <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-bear-blue" />
          Key Performance Indicators
        </h2>
        <Suspense fallback={<SectionSkeleton height="h-40" />}>
          <LazyKPICardGrid cards={universe.kpis} />
        </Suspense>
      </section>

      {/* Fleet Performance Dashboard */}
      <section className="mb-6 sm:mb-8 lg:mb-10">
        <Suspense fallback={<SectionSkeleton height="h-80" />}>
          <LazyFleetPerformanceDashboard />
        </Suspense>
      </section>

      {/* Interactive Incident Radar */}
      <section className="mb-6 sm:mb-8 lg:mb-10">
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <LazyInteractiveIncidentRadar />
        </Suspense>
      </section>

      {/* Trends Chart */}
      <section className="mb-6 sm:mb-8 lg:mb-10">
        <Suspense fallback={<SectionSkeleton height="h-80" />}>
          <LazyTrendPanel data={universe.trend} />
        </Suspense>
      </section>

      {/* Robot Fleet Status */}
      <section className="mb-6 sm:mb-8 lg:mb-10">
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <LazyRobotFleetStatus />
        </Suspense>
      </section>

      {/* Interactive Operations Table */}
      <section className="mb-6 sm:mb-8 lg:mb-10">
        <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-bear-blue" />
          Live Operations Data
        </h2>
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <LazyInteractiveOpsTable operations={operationsDataset.slice(-50)} />
        </Suspense>
      </section>
      </div>
      </main>
      <Footer />
    </div>
  );
}
