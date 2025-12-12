"use client";

import { useState, useEffect, useMemo } from "react";
import { Activity, Zap, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { robotFleet } from "@/lib/robotData";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export function FleetPerformanceDashboard() {
  const [ordersInProgress, setOrdersInProgress] = useState(0);

  // Memoize metrics calculation
  const liveMetrics = useMemo(() => {
    const active = robotFleet.filter(r => r.status === "active").length;
    const totalTrips = robotFleet.reduce((sum, r) => sum + (r.metrics.tripsCompleted || 0), 0);
    const avgResponse = Math.round(robotFleet.reduce((sum, r) => sum + (r.metrics.avgTripTime || 0), 0) / robotFleet.length);
    const efficiency = Math.round(robotFleet.reduce((sum, r) => sum + r.metrics.successRate, 0) / robotFleet.length);
    const predicted = Math.floor(totalTrips * 1.08);
    
    return {
      activeRobots: active,
      totalTripsToday: totalTrips,
      avgResponseTime: avgResponse,
      fleetEfficiency: efficiency,
      predictedCompletions: predicted,
    };
  }, []);

  useEffect(() => {
    setOrdersInProgress(Math.floor(liveMetrics.activeRobots * 0.7));
    
    // Simulate live updates every 5 seconds
    const interval = setInterval(() => {
      setOrdersInProgress(prev => 
        Math.max(10, Math.min(liveMetrics.activeRobots, prev + Math.floor(Math.random() * 3 - 1)))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [liveMetrics.activeRobots]);

  const healthStatus = liveMetrics.fleetEfficiency >= 95 ? "excellent" : liveMetrics.fleetEfficiency >= 85 ? "good" : "degraded";
  const statusColors = {
    excellent: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400",
    good: "from-bear-blue/20 to-bear-blue/5 border-bear-blue/30 text-bear-blue",
    degraded: "from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-4 sm:p-6 shadow-xl transition-all hover:border-white/20">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-bear-blue" />
            Fleet Performance Monitor
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Real-time operational intelligence
          </p>
        </div>
        
        <div className={`flex items-center gap-2 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r ${statusColors[healthStatus]} self-start sm:self-auto`}>
          <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: "currentColor" }} />
          <span className="text-xs sm:text-sm font-semibold uppercase">{healthStatus}</span>
        </div>
      </div>

      {/* Real-Time Metrics Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4 sm:mb-6">
        {/* Active Robots */}
        <div className="group rounded-xl sm:rounded-2xl border border-bear-blue/20 bg-gradient-to-br from-bear-blue/10 to-bear-blue/5 p-4 sm:p-5 transition-all hover:border-bear-blue/40 hover:shadow-lg">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="rounded-lg bg-bear-blue/20 p-1.5 sm:p-2">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-bear-blue" />
            </div>
            <div className="text-[10px] sm:text-xs text-white/50 font-medium">Live</div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">
            <AnimatedCounter value={liveMetrics.activeRobots} duration={1000} />
          </div>
          <div className="text-xs sm:text-sm text-white/60">Active Robots</div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] sm:text-xs text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span>+12% from yesterday</span>
          </div>
        </div>

        {/* Total Trips */}
        <div className="group rounded-xl sm:rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-4 sm:p-5 transition-all hover:border-indigo-500/40 hover:shadow-lg">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="rounded-lg bg-indigo-500/20 p-1.5 sm:p-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
            </div>
            <div className="text-[10px] sm:text-xs text-white/50 font-medium">Today</div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">
            <AnimatedCounter value={liveMetrics.totalTripsToday} duration={1200} />
          </div>
          <div className="text-xs sm:text-sm text-white/60">Trips Completed</div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] sm:text-xs text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span>Target: {liveMetrics.predictedCompletions}</span>
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="group rounded-xl sm:rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-4 sm:p-5 transition-all hover:border-purple-500/40 hover:shadow-lg sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="rounded-lg bg-purple-500/20 p-1.5 sm:p-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
            </div>
            <div className="text-[10px] sm:text-xs text-white/50 font-medium">Avg</div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">
            <AnimatedCounter value={liveMetrics.avgResponseTime} duration={1000} decimals={0} />s
          </div>
          <div className="text-xs sm:text-sm text-white/60">Response Time</div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] sm:text-xs text-emerald-400">
            <span>-8% improvement</span>
          </div>
        </div>
      </div>

      {/* Live Activity Bar */}
      <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <div className="text-sm font-semibold text-white">Fleet Efficiency</div>
            <div className="text-[10px] sm:text-xs text-white/50 mt-0.5">Real-time aggregate performance</div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">
            <AnimatedCounter value={liveMetrics.fleetEfficiency} duration={1200} decimals={1} />%
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-2.5 sm:h-3 rounded-full bg-white/10 overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-bear-blue to-indigo-400 transition-all duration-1000 shadow-lg"
            style={{ width: `${liveMetrics.fleetEfficiency}%` }}
          />
        </div>

        {/* Active Orders */}
        <div className="mt-3 sm:mt-4 flex items-center justify-between text-xs sm:text-sm">
          <span className="text-white/60">Orders in Progress</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">
              <AnimatedCounter value={ordersInProgress} duration={600} decimals={0} />
            </span>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="mt-4 sm:mt-6 grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
        <div className="flex items-start gap-2 sm:gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 sm:p-4">
          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs sm:text-sm font-medium text-white">Peak Performance</div>
            <div className="text-[10px] sm:text-xs text-white/60 mt-0.5 sm:mt-1">
              {Math.floor(liveMetrics.fleetEfficiency / 10)} robots exceeding targets
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-2 sm:gap-3 rounded-xl bg-bear-blue/10 border border-bear-blue/20 p-3 sm:p-4">
          <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-bear-blue mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs sm:text-sm font-medium text-white">Predictive Maintenance</div>
            <div className="text-[10px] sm:text-xs text-white/60 mt-0.5 sm:mt-1">
              All systems optimal · Next service in 12h
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

