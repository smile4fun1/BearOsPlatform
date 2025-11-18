"use client";

import { Bot, Zap, Shield, BarChart3, Brain, Wifi, Battery, Gauge } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Autonomous Navigation",
    description: "Advanced SLAM with real-time obstacle avoidance and dynamic path planning",
    color: "from-sky-500/20 to-blue-500/10",
    iconColor: "text-sky-400"
  },
  {
    icon: Zap,
    title: "Fleet Orchestration",
    description: "Intelligent multi-robot coordination with automatic task delegation",
    color: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-400"
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "360° LiDAR sensors with AI-powered collision prevention systems",
    color: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400"
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Real-time performance metrics with predictive maintenance insights",
    color: "from-violet-500/20 to-purple-500/10",
    iconColor: "text-violet-400"
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Machine learning models for operational optimization and efficiency",
    color: "from-rose-500/20 to-pink-500/10",
    iconColor: "text-rose-400"
  },
  {
    icon: Wifi,
    title: "Cloud Integration",
    description: "Seamless connectivity with Bear Cloud for remote monitoring and updates",
    color: "from-indigo-500/20 to-blue-500/10",
    iconColor: "text-indigo-400"
  },
  {
    icon: Battery,
    title: "Smart Charging",
    description: "Autonomous docking with optimized battery management and scheduling",
    color: "from-green-500/20 to-emerald-500/10",
    iconColor: "text-green-400"
  },
  {
    icon: Gauge,
    title: "Performance Tuning",
    description: "Adaptive speed control with load balancing for maximum throughput",
    color: "from-cyan-500/20 to-sky-500/10",
    iconColor: "text-cyan-400"
  }
];

export function BearFeaturesGrid() {
  return (
    <div className="bear-card p-6 transition-all duration-500 hover:border-white/20 hover:shadow-[0_30px_90px_rgba(8,12,30,0.55)]">
      <header className="mb-6">
        <h2 className="text-xl font-bold text-white">Bear Platform Capabilities</h2>
        <p className="text-sm text-white/60">
          Core technologies powering the next generation of service robotics
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className={`rounded-2xl border border-white/10 bg-gradient-to-br ${feature.color} p-4 transition-all duration-300 hover:scale-105 hover:border-white/20`}
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10`}>
                <Icon className={`h-5 w-5 ${feature.iconColor}`} />
              </div>
              <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
              <p className="text-xs leading-relaxed text-white/60">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

