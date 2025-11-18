"use client";

import { Zap, Globe2, Brain } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

interface HomeStatsProps {
  ordersValue: string;
  ordersDelta: string;
  deployments: number;
  aiModels: number;
}

export function HomeStats({ ordersValue, ordersDelta, deployments, aiModels }: HomeStatsProps) {
  // Parse ordersValue (e.g., "12.4M" -> 12.4)
  const ordersNumeric = parseFloat(ordersValue.replace(/[^0-9.]/g, ""));
  const ordersSuffix = ordersValue.replace(/[0-9.]/g, "");

  return (
    <div className="mt-16 grid gap-6 sm:grid-cols-3 w-full max-w-3xl">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-emerald-400">
          <Zap className="h-5 w-5" />
          <span className="text-sm font-medium">Orders Automated</span>
        </div>
        <div className="mt-2 text-3xl font-bold">
          <AnimatedCounter 
            value={ordersNumeric} 
            duration={2500} 
            decimals={1}
            suffix={ordersSuffix}
          />
        </div>
        <div className="mt-1 text-sm text-white/50">
          {ordersDelta} from last period
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-sky-400">
          <Globe2 className="h-5 w-5" />
          <span className="text-sm font-medium">Active Deployments</span>
        </div>
        <div className="mt-2 text-3xl font-bold">
          <AnimatedCounter 
            value={deployments} 
            duration={2000} 
            separator={true}
            suffix="+"
          />
        </div>
        <div className="mt-1 text-sm text-white/50">Across 6 countries</div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-indigo-400">
          <Brain className="h-5 w-5" />
          <span className="text-sm font-medium">AI Models Training</span>
        </div>
        <div className="mt-2 text-3xl font-bold">
          <AnimatedCounter 
            value={aiModels} 
            duration={1500}
          />
        </div>
        <div className="mt-1 text-sm text-white/50">40B + 70B + 120B parameters</div>
      </div>
    </div>
  );
}

