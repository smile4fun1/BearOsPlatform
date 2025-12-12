"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TrendPoint } from "@/lib/types";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function TrendPanel({ data }: { data: TrendPoint[] }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({ width: rect.width, height: rect.height });
      }
    }
  }, []);

  useEffect(() => {
    // Use ResizeObserver for reliable dimension tracking
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      // Initial check after a small delay to ensure DOM is painted
      setTimeout(updateDimensions, 50);
    }

    return () => resizeObserver.disconnect();
  }, [updateDimensions]);

  const isReady = dimensions.width > 0 && dimensions.height > 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 sm:p-6 transition-all hover:border-white/20">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Mission Throughput
          </h2>
          <p className="text-xs sm:text-sm text-white/60">
            Weekly automation output vs uptime + safety signals
          </p>
        </div>
      </header>
      <div 
        ref={containerRef}
        className="h-[250px] sm:h-[300px] w-full min-w-0"
        style={{ minHeight: '250px' }}
      >
        {!isReady ? (
          <div className="h-full w-full flex items-center justify-center bg-white/5 rounded-xl">
            <div className="w-6 h-6 border-2 border-bear-blue/30 border-t-bear-blue rounded-full animate-spin" />
          </div>
        ) : (
          <ComposedChart 
            data={data} 
            width={dimensions.width} 
            height={dimensions.height}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
              <defs>
                <linearGradient id="throughput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#51A6D6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#51A6D6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis 
                dataKey="week" 
                stroke="#6b7280" 
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis
                yAxisId="left"
                stroke="#51A6D6"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#fbbf24"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(5, 11, 24, 0.95)",
                  borderRadius: "0.75rem",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "12px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                }}
                labelStyle={{ color: '#fff', fontWeight: 600 }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="throughput"
                stroke="#51A6D6"
                strokeWidth={2}
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
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                name="Incidents"
              />
            </ComposedChart>
        )}
      </div>
    </div>
  );
}
