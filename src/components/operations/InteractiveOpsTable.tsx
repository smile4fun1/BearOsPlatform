"use client";

import { useState, Fragment, useMemo, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Info, Search, Filter } from "lucide-react";
import { OpsDataPoint } from "@/lib/types";
import { AnimatedCounter } from "../AnimatedCounter";
import dayjs from "dayjs";

interface InteractiveOpsTableProps {
  operations: OpsDataPoint[];
}

export function InteractiveOpsTable({ operations }: InteractiveOpsTableProps) {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof OpsDataPoint | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleSort = (field: keyof OpsDataPoint) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Memoize sorted and filtered operations
  const filteredOps = useMemo(() => {
    const sorted = [...operations].sort((a, b) => {
      if (!sortField) return 0;
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc" 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });

    return sorted.filter(
      (op) =>
        op.facility.toLowerCase().includes(filter.toLowerCase()) ||
        op.robotModel.toLowerCase().includes(filter.toLowerCase()) ||
        op.city.toLowerCase().includes(filter.toLowerCase())
    );
  }, [operations, sortField, sortDirection, filter]);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredOps.length) {
          setVisibleCount(prev => Math.min(prev + 5, filteredOps.length));
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, filteredOps.length]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(5);
  }, [filter]);

  const SortButton = ({ field, label, className = "" }: { field: keyof OpsDataPoint; label: string; className?: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center gap-1 text-xs sm:text-sm font-semibold text-white/60 transition-colors hover:text-white whitespace-nowrap ${className}`}
    >
      {label}
      {sortField === field && (
        sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
      )}
    </button>
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Search Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by facility, model, or city..."
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/40 outline-none transition-all focus:bg-white/10 focus:border-bear-blue/50 focus:ring-2 focus:ring-bear-blue/20"
          />
        </div>
        <div className="flex items-center justify-between sm:justify-start gap-2 text-xs sm:text-sm text-white/50">
          <Filter className="h-4 w-4 sm:hidden" />
          <span>{filteredOps.length} of {operations.length} records</span>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {filteredOps.slice(0, visibleCount).map((op) => (
          <div
            key={op.id}
            onClick={() => setSelectedRow(selectedRow === op.id ? null : op.id)}
            className={`rounded-xl border bg-gradient-to-br from-white/5 to-white/[0.02] p-4 cursor-pointer transition-all ${
              selectedRow === op.id ? 'border-bear-blue/40 bg-white/8' : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white text-sm truncate">{op.facility}</div>
                <div className="text-xs text-white/50">{op.city}</div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold flex-shrink-0 ${
                  op.region === "APAC"
                    ? "bg-bear-blue/20 text-bear-blue"
                    : "bg-indigo-500/20 text-indigo-400"
                }`}
              >
                {op.region}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-3 text-xs text-white/60">
              <span className="bg-white/10 px-2 py-0.5 rounded">{op.robotModel}</span>
              <span className="bg-white/10 px-2 py-0.5 rounded">{op.shift}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
              <div>
                <div className="text-[10px] text-white/50 mb-0.5">Orders</div>
                <div className="font-semibold text-white text-sm">{op.ordersServed.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] text-white/50 mb-0.5">Uptime</div>
                <div className={`font-semibold text-sm ${
                  op.uptime >= 95 ? "text-emerald-400" : op.uptime >= 85 ? "text-amber-400" : "text-rose-400"
                }`}>
                  {op.uptime.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-white/50 mb-0.5">NPS</div>
                <div className={`font-semibold text-sm ${
                  op.nps >= 70 ? "text-emerald-400" : op.nps >= 50 ? "text-amber-400" : "text-rose-400"
                }`}>
                  {op.nps}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedRow === op.id && (
              <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-black/20 p-3">
                  <div className="text-[10px] text-white/50 mb-1">Service Vertical</div>
                  <div className="text-xs font-semibold text-white">{op.vertical}</div>
                </div>
                <div className="rounded-lg bg-black/20 p-3">
                  <div className="text-[10px] text-white/50 mb-1">Avg Turn Time</div>
                  <div className="text-xs font-semibold text-white">{op.avgTurnTimeSeconds}s</div>
                </div>
                <div className="rounded-lg bg-black/20 p-3">
                  <div className="text-[10px] text-white/50 mb-1">Incidents</div>
                  <div className={`text-xs font-semibold ${op.incidents > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {op.incidents}
                  </div>
                </div>
                <div className="rounded-lg bg-black/20 p-3">
                  <div className="text-[10px] text-white/50 mb-1">Energy</div>
                  <div className="text-xs font-semibold text-white">{op.energyKwh.toFixed(1)} kWh</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-3 pt-4 px-4 text-left">
                <SortButton field="facility" label="Facility" />
              </th>
              <th className="pb-3 pt-4 px-3 text-left">
                <SortButton field="region" label="Region" />
              </th>
              <th className="pb-3 pt-4 px-3 text-left">
                <SortButton field="robotModel" label="Model" />
              </th>
              <th className="pb-3 pt-4 px-3 text-left">
                <SortButton field="shift" label="Shift" />
              </th>
              <th className="pb-3 pt-4 px-3 text-left">
                <SortButton field="ordersServed" label="Orders" />
              </th>
              <th className="pb-3 pt-4 px-3 text-left">
                <SortButton field="uptime" label="Uptime" />
              </th>
              <th className="pb-3 pt-4 px-3 text-left">
                <SortButton field="nps" label="NPS" />
              </th>
              <th className="pb-3 pt-4 px-3 text-left w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filteredOps.slice(0, visibleCount).map((op) => (
              <Fragment key={op.id}>
                <tr
                  onClick={() => setSelectedRow(selectedRow === op.id ? null : op.id)}
                  className="group cursor-pointer border-b border-white/5 transition-all hover:bg-white/5"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-white group-hover:text-bear-blue transition-colors text-sm">
                      {op.facility}
                    </div>
                    <div className="text-xs text-white/50">{op.city}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        op.region === "APAC"
                          ? "bg-bear-blue/20 text-bear-blue"
                          : "bg-indigo-500/20 text-indigo-400"
                      }`}
                    >
                      {op.region}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-sm text-white/80">{op.robotModel}</td>
                  <td className="py-3 px-3">
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/80">
                      {op.shift}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold tabular-nums text-sm text-white">
                    <AnimatedCounter value={op.ordersServed} duration={800} separator />
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-semibold tabular-nums text-sm ${
                        op.uptime >= 95
                          ? "text-emerald-400"
                          : op.uptime >= 85
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      <AnimatedCounter value={op.uptime} duration={1000} decimals={1} suffix="%" />
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-semibold tabular-nums text-sm ${
                        op.nps >= 70
                          ? "text-emerald-400"
                          : op.nps >= 50
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      <AnimatedCounter value={op.nps} duration={800} />
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button className="flex items-center gap-1 text-xs text-bear-blue opacity-0 transition-opacity group-hover:opacity-100">
                      <Info className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
                
                {/* Expanded Row Details */}
                {selectedRow === op.id && (
                  <tr className="bg-white/5 border-b border-white/5">
                    <td colSpan={8} className="py-4 px-4">
                      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl bg-black/20 p-3">
                          <div className="text-[10px] text-white/50 mb-1">Service Vertical</div>
                          <div className="font-semibold text-white/90 text-sm">{op.vertical}</div>
                        </div>
                        
                        <div className="rounded-xl bg-black/20 p-3">
                          <div className="text-[10px] text-white/50 mb-1">Avg Turn Time</div>
                          <div className="font-semibold text-white/90 text-sm">{op.avgTurnTimeSeconds}s</div>
                        </div>
                        
                        <div className="rounded-xl bg-black/20 p-3">
                          <div className="text-[10px] text-white/50 mb-1">Incidents</div>
                          <div className={`font-semibold text-sm ${op.incidents > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {op.incidents}
                          </div>
                        </div>
                        
                        <div className="rounded-xl bg-black/20 p-3">
                          <div className="text-[10px] text-white/50 mb-1">Energy</div>
                          <div className="font-semibold text-white/90 text-sm">{op.energyKwh.toFixed(1)} kWh</div>
                        </div>
                        
                        <div className="rounded-xl bg-black/20 p-3">
                          <div className="text-[10px] text-white/50 mb-1">Staffing Delta</div>
                          <div className={`font-semibold text-sm ${op.staffingDelta < 0 ? 'text-emerald-400' : 'text-white/90'}`}>
                            {op.staffingDelta > 0 ? '+' : ''}{op.staffingDelta}
                          </div>
                        </div>
                        
                        <div className="rounded-xl bg-black/20 p-3">
                          <div className="text-[10px] text-white/50 mb-1">Timestamp</div>
                          <div className="text-xs text-white/90">
                            {dayjs(op.timestamp).format("MMM D, h:mm A")}
                          </div>
                        </div>
                        
                        <div className="rounded-xl bg-black/20 p-3 col-span-2">
                          <div className="text-[10px] text-white/50 mb-2">Quick Actions</div>
                          <div className="flex flex-wrap gap-2">
                            <button className="flex items-center gap-1.5 rounded-lg bg-bear-blue/20 px-3 py-1.5 text-xs text-bear-blue font-medium transition-colors hover:bg-bear-blue/30">
                              <ExternalLink className="h-3 w-3" />
                              <span>View Robot</span>
                            </button>
                            <button className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/80 font-medium transition-colors hover:bg-white/15">
                              Export
                            </button>
                            <button className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/80 font-medium transition-colors hover:bg-white/15">
                              Logs
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More Trigger */}
      {visibleCount < filteredOps.length && (
        <div ref={loadMoreRef} className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-sm text-white/40">
            <div className="w-2 h-2 bg-bear-blue/50 rounded-full animate-pulse" />
            <span>Loading more...</span>
          </div>
        </div>
      )}

      {visibleCount >= filteredOps.length && filteredOps.length > 5 && (
        <div className="flex items-center justify-center py-6 text-sm text-white/30">
          <span>All {filteredOps.length} records loaded</span>
        </div>
      )}
    </div>
  );
}

