"use client";

import { useState, Fragment } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Info } from "lucide-react";
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

  const handleSort = (field: keyof OpsDataPoint) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedOps = [...operations].sort((a, b) => {
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

  const filteredOps = sortedOps.filter(
    (op) =>
      op.facility.toLowerCase().includes(filter.toLowerCase()) ||
      op.robotModel.toLowerCase().includes(filter.toLowerCase()) ||
      op.city.toLowerCase().includes(filter.toLowerCase())
  );

  const SortButton = ({ field, label }: { field: keyof OpsDataPoint; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-sm font-medium text-white/60 transition-colors hover:text-white"
    >
      {label}
      {sortField === field && (
        sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
      )}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Search Filter */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by facility, robot model, or city..."
          className="flex-1 rounded-xl bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none transition-colors focus:bg-white/15 focus:ring-2 focus:ring-sky-500/50"
        />
        <div className="text-sm text-white/50">
          {filteredOps.length} of {operations.length} records
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-4 pt-6 px-6 text-left">
                <SortButton field="facility" label="Facility" />
              </th>
              <th className="pb-4 pt-6 px-4 text-left">
                <SortButton field="region" label="Region" />
              </th>
              <th className="pb-4 pt-6 px-4 text-left">
                <SortButton field="robotModel" label="Model" />
              </th>
              <th className="pb-4 pt-6 px-4 text-left">
                <SortButton field="shift" label="Shift" />
              </th>
              <th className="pb-4 pt-6 px-4 text-left">
                <SortButton field="ordersServed" label="Orders" />
              </th>
              <th className="pb-4 pt-6 px-4 text-left">
                <SortButton field="uptime" label="Uptime" />
              </th>
              <th className="pb-4 pt-6 px-4 text-left">
                <SortButton field="nps" label="NPS" />
              </th>
              <th className="pb-4 pt-6 px-4 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {filteredOps.slice(0, 20).map((op) => (
              <Fragment key={op.id}>
                <tr
                  onClick={() => setSelectedRow(selectedRow === op.id ? null : op.id)}
                  className="group cursor-pointer border-b border-white/5 transition-all hover:bg-white/5"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-white group-hover:text-sky-400 transition-colors">
                      {op.facility}
                    </div>
                    <div className="text-sm text-white/50">{op.city}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        op.region === "APAC"
                          ? "bg-sky-500/20 text-sky-400"
                          : "bg-indigo-500/20 text-indigo-400"
                      }`}
                    >
                      {op.region}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-white/80">{op.robotModel}</td>
                  <td className="py-4 px-4">
                    <span className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white/80">
                      {op.shift}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold tabular-nums">
                    <AnimatedCounter value={op.ordersServed} duration={1000} separator />
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`font-semibold tabular-nums ${
                        op.uptime >= 95
                          ? "text-emerald-400"
                          : op.uptime >= 85
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      <AnimatedCounter value={op.uptime} duration={1200} decimals={1} suffix="%" />
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`font-semibold tabular-nums ${
                        op.nps >= 70
                          ? "text-emerald-400"
                          : op.nps >= 50
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      <AnimatedCounter value={op.nps} duration={1000} />
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="flex items-center gap-1 text-xs text-sky-400 opacity-0 transition-opacity group-hover:opacity-100">
                      <Info className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
                
                {/* Expanded Row Details */}
                {selectedRow === op.id && (
                  <tr className="bg-white/5 border-b border-white/5">
                    <td colSpan={8} className="py-6 px-6">
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl bg-black/20 p-4">
                          <div className="text-xs text-white/50 mb-1">Service Vertical</div>
                          <div className="font-semibold text-white/90">{op.vertical}</div>
                        </div>
                        
                        <div className="rounded-xl bg-black/20 p-4">
                          <div className="text-xs text-white/50 mb-1">Avg Turn Time</div>
                          <div className="font-semibold text-white/90">
                            <AnimatedCounter 
                              value={op.avgTurnTimeSeconds} 
                              duration={1000} 
                              suffix="s" 
                            />
                          </div>
                        </div>
                        
                        <div className="rounded-xl bg-black/20 p-4">
                          <div className="text-xs text-white/50 mb-1">Incidents</div>
                          <div className={`font-semibold ${op.incidents > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {op.incidents}
                          </div>
                        </div>
                        
                        <div className="rounded-xl bg-black/20 p-4">
                          <div className="text-xs text-white/50 mb-1">Energy</div>
                          <div className="font-semibold text-white/90">
                            <AnimatedCounter 
                              value={op.energyKwh} 
                              duration={1200} 
                              decimals={1} 
                              suffix=" kWh" 
                            />
                          </div>
                        </div>
                        
                        <div className="rounded-xl bg-black/20 p-4">
                          <div className="text-xs text-white/50 mb-1">Staffing Delta</div>
                          <div className={`font-semibold ${op.staffingDelta < 0 ? 'text-emerald-400' : 'text-white/90'}`}>
                            {op.staffingDelta > 0 ? '+' : ''}{op.staffingDelta}
                          </div>
                        </div>
                        
                        <div className="rounded-xl bg-black/20 p-4">
                          <div className="text-xs text-white/50 mb-1">Timestamp</div>
                          <div className="text-sm text-white/90">
                            {dayjs(op.timestamp).format("MMM D, h:mm A")}
                          </div>
                        </div>
                        
                        <div className="rounded-xl bg-black/20 p-4 md:col-span-2">
                          <div className="text-xs text-white/50 mb-2">Quick Actions</div>
                          <div className="flex flex-wrap gap-2">
                            <button className="flex items-center gap-1.5 rounded-lg bg-sky-500/20 px-3 py-1.5 text-xs text-sky-300 transition-colors hover:bg-sky-500/30">
                              <ExternalLink className="h-3 w-3" />
                              <span>View Robot Details</span>
                            </button>
                            <button className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/15">
                              Export Data
                            </button>
                            <button className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/15">
                              View Logs
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
    </div>
  );
}

