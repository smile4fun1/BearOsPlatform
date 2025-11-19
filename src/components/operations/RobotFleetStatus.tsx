"use client";

import { UtensilsCrossed, TruckIcon, Container, Battery, Zap, Activity, AlertCircle, CheckCircle } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export function RobotFleetStatus() {
  // Real-time fleet status data (in production, this would come from API)
  const fleetData = {
    serviPlus: {
      total: 45,
      active: 38,
      charging: 5,
      maintenance: 2,
      avgBattery: 87,
      avgUptime: 98.2,
    },
    carti100: {
      total: 35,
      active: 30,
      charging: 3,
      maintenance: 2,
      avgBattery: 82,
      avgUptime: 96.8,
    },
    carti600: {
      total: 21,
      active: 18,
      charging: 2,
      maintenance: 1,
      avgBattery: 85,
      avgUptime: 97.5,
    },
  };

  const models = [
    {
      name: "Servi Plus",
      icon: UtensilsCrossed,
      data: fleetData.serviPlus,
      color: "sky",
      gradient: "from-sky-500/20 to-sky-600/10",
      border: "border-sky-500/30",
      iconColor: "text-sky-400",
    },
    {
      name: "Carti 100",
      icon: TruckIcon,
      data: fleetData.carti100,
      color: "indigo",
      gradient: "from-indigo-500/20 to-indigo-600/10",
      border: "border-indigo-500/30",
      iconColor: "text-indigo-400",
    },
    {
      name: "Carti 600",
      icon: Container,
      data: fleetData.carti600,
      color: "purple",
      gradient: "from-purple-500/20 to-purple-600/10",
      border: "border-purple-500/30",
      iconColor: "text-purple-400",
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Robot Fleet Status</h2>
          <p className="text-sm text-white/60 mt-1">Real-time status across all robot models</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10">
          <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span className="text-sm text-emerald-400 font-medium">Live</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {models.map((model) => (
          <div
            key={model.name}
            className={`rounded-2xl border ${model.border} bg-gradient-to-br ${model.gradient} p-6 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-lg`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ${model.iconColor}`}>
                  <model.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{model.name}</h3>
                  <p className="text-xs text-white/50">Active Fleet</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter value={model.data.total} duration={1500} />
                </div>
                <div className="text-xs text-white/50">Total Units</div>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-white/80">Active</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  {model.data.active} units
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-white/80">Charging</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  {model.data.charging} units
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400" />
                  <span className="text-sm text-white/80">Maintenance</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  {model.data.maintenance} units
                </span>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="border-t border-white/10 pt-4 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Battery className="h-3 w-3" />
                    <span>Avg Battery</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    <AnimatedCounter value={model.data.avgBattery} duration={2000} decimals={0} suffix="%" />
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-${model.color}-400 to-${model.color}-500 transition-all duration-1000`}
                    style={{ width: `${model.data.avgBattery}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Activity className="h-3 w-3" />
                    <span>Avg Uptime</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    <AnimatedCounter value={model.data.avgUptime} duration={2000} decimals={1} suffix="%" />
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-1000`}
                    style={{ width: `${model.data.avgUptime}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fleet Summary */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              <AnimatedCounter 
                value={fleetData.serviPlus.total + fleetData.carti100.total + fleetData.carti600.total} 
                duration={2000} 
              />
            </div>
            <div className="text-sm text-white/50 mt-1">Total Fleet Size</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">
              <AnimatedCounter 
                value={fleetData.serviPlus.active + fleetData.carti100.active + fleetData.carti600.active} 
                duration={2000} 
              />
            </div>
            <div className="text-sm text-white/50 mt-1">Currently Active</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400">
              <AnimatedCounter 
                value={fleetData.serviPlus.charging + fleetData.carti100.charging + fleetData.carti600.charging} 
                duration={2000} 
              />
            </div>
            <div className="text-sm text-white/50 mt-1">Charging</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-rose-400">
              <AnimatedCounter 
                value={fleetData.serviPlus.maintenance + fleetData.carti100.maintenance + fleetData.carti600.maintenance} 
                duration={2000} 
                decimals={0}
              />
            </div>
            <div className="text-sm text-white/50 mt-1">In Maintenance</div>
          </div>
        </div>
      </div>
    </div>
  );
}

