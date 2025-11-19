"use client";

import { Rocket, Sparkles, Users, Globe, Cpu, Zap, Shield } from "lucide-react";

const upcomingFeatures = [
  {
    icon: Rocket,
    title: "Predictive Maintenance AI",
    description: "Deep learning models analyze sensor patterns to predict component failures 48-72 hours in advance, with automated RMA workflows",
    status: "Q1 2026",
    color: "from-blue-500/20 to-indigo-500/10",
    iconColor: "text-blue-400"
  },
  {
    icon: Cpu,
    title: "Advanced Pathfinding Engine",
    description: "Next-gen navigation with dynamic obstacle prediction, multi-robot coordination, and real-time traffic optimization",
    status: "Q2 2026",
    color: "from-cyan-500/20 to-sky-500/10",
    iconColor: "text-cyan-400"
  },
  {
    icon: Shield,
    title: "Autonomous Error Recovery",
    description: "Self-healing systems that automatically diagnose and resolve common issues without human intervention, reducing downtime by 60%",
    status: "Q2 2026",
    color: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400"
  },
  {
    icon: Sparkles,
    title: "Ursa Minor Deep Integration",
    description: "Expanded AI assistant capabilities with proactive anomaly detection, multi-step workflows, and predictive insights",
    status: "Q3 2026",
    color: "from-purple-500/20 to-violet-500/10",
    iconColor: "text-purple-400"
  },
  {
    icon: Zap,
    title: "Real-Time Fleet Orchestration",
    description: "Dynamic task allocation and load balancing across entire robot fleets with ML-powered efficiency optimization",
    status: "Q3 2026",
    color: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-400"
  },
  {
    icon: Users,
    title: "Customer Experience Analytics",
    description: "Enhanced sentiment tracking with NPS correlation, interaction heatmaps, and personalized service recommendations",
    status: "Q4 2026",
    color: "from-rose-500/20 to-pink-500/10",
    iconColor: "text-rose-400"
  },
  {
    icon: Globe,
    title: "Global Fleet Command Center",
    description: "Unified dashboard for cross-continental operations with timezone-aware analytics and regional performance benchmarking",
    status: "Q4 2026",
    color: "from-indigo-500/20 to-blue-500/10",
    iconColor: "text-indigo-400"
  }
];

export function UpcomingFeatures() {
  return (
    <div className="bear-card p-6 transition-all duration-500 hover:border-white/20 hover:shadow-[0_30px_90px_rgba(8,12,30,0.55)]">
      <header className="mb-6">
        <h2 className="text-xl font-bold text-white">Innovation Pipeline</h2>
        <p className="text-sm text-white/60">
          Next-generation features coming to Bear Universe
        </p>
      </header>
      <div className="space-y-4">
        {upcomingFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className={`rounded-2xl border border-white/10 bg-gradient-to-r ${feature.color} p-4 transition-all duration-300 hover:border-white/20`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10`}>
                  <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                      {feature.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

