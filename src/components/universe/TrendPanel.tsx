"use client";

import { TrendPoint } from "@/lib/types";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function TrendPanel({ data }: { data: TrendPoint[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#10142b]/80 via-[#0d1a2f]/70 to-[#081320]/80 p-6 shadow-[0_25px_80px_rgba(8,12,30,0.65)]">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Mission Throughput
          </h2>
          <p className="text-sm text-white/60">
            Weekly automation output vs uptime + safety signals
          </p>
        </div>
      </header>
      <div className="mt-6 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="throughput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#312e81" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="week" stroke="#9ca3af" />
            <YAxis
              yAxisId="left"
              stroke="#60a5fa"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <YAxis yAxisId="right" orientation="right" stroke="#fbbf24" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#050b18",
                borderRadius: "1rem",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="throughput"
              stroke="#60a5fa"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#throughput)"
              name="Orders"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="uptime"
              stroke="#fbbf24"
              strokeWidth={2}
              dot={false}
              name="Uptime %"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="satisfaction"
              stroke="#34d399"
              strokeWidth={2}
              dot={false}
              name="NPS"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="incidents"
              stroke="#f87171"
              strokeDasharray="6 6"
              name="Incidents"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
