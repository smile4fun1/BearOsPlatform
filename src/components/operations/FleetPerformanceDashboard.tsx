"use client";

import { useState, useEffect } from "react";
import { Activity, Zap, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { robotFleet } from "@/lib/robotData";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export function FleetPerformanceDashboard() {
  const [liveMetrics, setLiveMetrics] = useState({
    activeRobots: 0,
    totalTripsToday: 0,
    avgResponseTime: 0,
    fleetEfficiency: 0,
    ordersInProgress: 0,
    predictedCompletions: 0,
  });

  useEffect(() => {
    // Calculate real-time metrics
    const active = robotFleet.filter(r => r.status === "active").length;
    const totalTrips = robotFleet.reduce((sum, r) => sum + (r.metrics.tripsCompleted || 0), 0);
    const avgResponse = Math.round(robotFleet.reduce((sum, r) => sum + (r.metrics.avgTripTime || 0), 0) / robotFleet.length);
    const efficiency = Math.round(robotFleet.reduce((sum, r) => sum + r.metrics.successRate, 0) / robotFleet.length);
    const inProgress = Math.floor(active * 0.7); // ~70% of active robots on task
    const predicted = Math.floor(totalTrips * 1.08); // 8% growth prediction
    
    setLiveMetrics({
      activeRobots: active,
      totalTripsToday: totalTrips,
      avgResponseTime: avgResponse,
      fleetEfficiency: efficiency,
      ordersInProgress: inProgress,
      predictedCompletions: predicted,
    });

    // Simulate live updates every 5 seconds
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        ordersInProgress: Math.max(10, Math.min(active, prev.ordersInProgress + Math.floor(Math.random() * 3 - 1))),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const healthStatus = liveMetrics.fleetEfficiency >= 95 ? "excellent" : liveMetrics.fleetEfficiency >= 85 ? "good" : "degraded";
  const statusColors = {
    excellent: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400",
    good: "from-sky-500/20 to-sky-500/5 border-sky-500/30 text-sky-400",
    degraded: "from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400",
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a1628]/95 via-[#020511]/95 to-[#0d1b2a]/95 backdrop-blur-xl p-6 shadow-2xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Activity className="h-6 w-6 text-sky-400" />
            Fleet Performance Monitor
          </h2>
          <p className="text-sm text-white/60 mt-1">
            Real-time operational intelligence · Live data streaming
          </p>
        </div>
        
        <div className={`flex items-center gap-2 rounded-full border px-4 py-2 bg-gradient-to-r ${statusColors[healthStatus]}`}>
          <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: "currentColor" }} />
          <span className="text-sm font-semibold uppercase">{healthStatus}</span>
        </div>
      </div>

      {/* Real-Time Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* Active Robots */}
        <div className="group rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-5 transition-all hover:scale-[1.02] hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-lg bg-sky-500/20 p-2">
              <Zap className="h-5 w-5 text-sky-400" />
            </div>
            <div className="text-xs text-white/50">Live</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            <AnimatedCounter value={liveMetrics.activeRobots} duration={1200} />
          </div>
          <div className="text-sm text-white/60">Active Robots</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span>+12% from yesterday</span>
          </div>
        </div>

        {/* Total Trips */}
        <div className="group rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-5 transition-all hover:scale-[1.02] hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-lg bg-indigo-500/20 p-2">
              <CheckCircle className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="text-xs text-white/50">Today</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            <AnimatedCounter value={liveMetrics.totalTripsToday} duration={1500} />
          </div>
          <div className="text-sm text-white/60">Trips Completed</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span>Target: {liveMetrics.predictedCompletions}</span>
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="group rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-5 transition-all hover:scale-[1.02] hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-lg bg-purple-500/20 p-2">
              <Clock className="h-5 w-5 text-purple-400" />
            </div>
            <div className="text-xs text-white/50">Avg</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            <AnimatedCounter value={liveMetrics.avgResponseTime} duration={1200} decimals={0} />s
          </div>
          <div className="text-sm text-white/60">Response Time</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
            <span>-8% improvement</span>
          </div>
        </div>
      </div>

      {/* Live Activity Bar */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold text-white">Fleet Efficiency</div>
            <div className="text-xs text-white/50 mt-0.5">Real-time aggregate performance</div>
          </div>
          <div className="text-2xl font-bold text-white">
            <AnimatedCounter value={liveMetrics.fleetEfficiency} duration={1500} decimals={1} />%
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-3 rounded-full bg-white/10 overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 transition-all duration-1000 shadow-lg"
            style={{ width: `${liveMetrics.fleetEfficiency}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Active Orders */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-white/60">Orders in Progress</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">
              <AnimatedCounter value={liveMetrics.ordersInProgress} duration={800} decimals={0} />
            </span>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="flex items-start gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
          <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-white">Peak Performance</div>
            <div className="text-xs text-white/60 mt-1">
              {Math.floor(liveMetrics.fleetEfficiency / 10)} robots exceeding targets
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-3 rounded-xl bg-sky-500/10 border border-sky-500/20 p-4">
          <Activity className="h-5 w-5 text-sky-400 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-white">Predictive Maintenance</div>
            <div className="text-xs text-white/60 mt-1">
              All systems optimal · Next service in 12h
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

