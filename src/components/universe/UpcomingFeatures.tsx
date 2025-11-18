"use client";

import { Rocket, Sparkles, Users, Globe } from "lucide-react";

const upcomingFeatures = [
  {
    icon: Rocket,
    title: "Predictive Maintenance",
    description: "AI-driven component health monitoring with automated service scheduling",
    status: "Q1 2026",
    color: "from-blue-500/20 to-indigo-500/10",
    iconColor: "text-blue-400"
  },
  {
    icon: Sparkles,
    title: "Natural Language Control",
    description: "Voice commands and conversational AI for hands-free robot management",
    status: "Q2 2026",
    color: "from-purple-500/20 to-violet-500/10",
    iconColor: "text-purple-400"
  },
  {
    icon: Users,
    title: "Guest Interaction Mode",
    description: "Enhanced customer engagement with personalized greetings and recommendations",
    status: "Q3 2026",
    color: "from-rose-500/20 to-pink-500/10",
    iconColor: "text-rose-400"
  },
  {
    icon: Globe,
    title: "Multi-Location Sync",
    description: "Cross-facility insights with centralized fleet management and analytics",
    status: "Q4 2026",
    color: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400"
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

