"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  Search, Bot, MapPin, Battery, Clock, AlertTriangle, 
  Filter, ChevronDown, ExternalLink, Activity, Zap,
  WifiOff, Wrench, BatteryCharging, CircleAlert
} from "lucide-react";
import { robotFleet, Robot } from "@/lib/robotData";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function RobotsManagement() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [facilityFilter, setFacilityFilter] = useState<string>("all");
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<keyof Robot>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Prevent hydration mismatch by only rendering stats after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get unique values for filters
  const facilities = useMemo(() => 
    Array.from(new Set(robotFleet.map(r => r.facility))).sort(),
    []
  );
  const models = useMemo(() => 
    Array.from(new Set(robotFleet.map(r => r.model))).sort(),
    []
  );

  // Filter and sort robots
  const filteredRobots = useMemo(() => {
    let filtered = robotFleet;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.id.toLowerCase().includes(query) ||
          r.name.toLowerCase().includes(query) ||
          r.facility.toLowerCase().includes(query) ||
          r.serialNumber.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Facility filter
    if (facilityFilter !== "all") {
      filtered = filtered.filter(r => r.facility === facilityFilter);
    }

    // Model filter
    if (modelFilter !== "all") {
      filtered = filtered.filter(r => r.model === modelFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
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

    return filtered;
  }, [searchQuery, statusFilter, facilityFilter, modelFilter, sortBy, sortDirection]);

  // Calculate stats
  const stats = useMemo(() => {
    const active = robotFleet.filter(r => r.status === "active").length;
    const idle = robotFleet.filter(r => r.status === "idle").length;
    const charging = robotFleet.filter(r => r.status === "charging").length;
    const maintenance = robotFleet.filter(r => r.status === "maintenance").length;
    const offline = robotFleet.filter(r => r.status === "offline").length;
    const errors = robotFleet.filter(r => r.status === "error").length;
    const avgBattery = robotFleet.reduce((sum, r) => sum + r.battery, 0) / robotFleet.length;
    const avgUptime = robotFleet.reduce((sum, r) => sum + r.uptime, 0) / robotFleet.length;

    return { active, idle, charging, maintenance, offline, errors, avgBattery, avgUptime };
  }, []);

  const getStatusColor = (status: Robot["status"]) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "idle": return "bg-sky-500/20 text-sky-400 border-sky-500/30";
      case "charging": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "maintenance": return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
      case "offline": return "bg-white/10 text-white/50 border-white/20";
      case "error": return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default: return "bg-white/10 text-white/50";
    }
  };

  const getStatusIcon = (status: Robot["status"]) => {
    switch (status) {
      case "active": return <Activity className="h-4 w-4" />;
      case "idle": return <Clock className="h-4 w-4" />;
      case "charging": return <BatteryCharging className="h-4 w-4" />;
      case "maintenance": return <Wrench className="h-4 w-4" />;
      case "offline": return <WifiOff className="h-4 w-4" />;
      case "error": return <CircleAlert className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] text-white">
      <main className="mx-auto max-w-[1600px] px-6 py-12 lg:px-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 text-sm text-sky-400 mb-4">
            <Bot className="h-5 w-5" />
            <span className="font-medium uppercase tracking-wider">Fleet Management</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">
            Robot Fleet
          </h1>
          <p className="text-lg text-white/60 max-w-3xl">
            Monitor and manage your entire Servi robot fleet across all facilities. 
            {filteredRobots.length} of {robotFleet.length} robots shown.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-10 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <div className="text-xs text-emerald-400 mb-1">Active</div>
            <div className="text-2xl font-bold">{mounted ? stats.active : "..."}</div>
          </div>
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-4">
            <div className="text-xs text-sky-400 mb-1">Idle</div>
            <div className="text-2xl font-bold">{mounted ? stats.idle : "..."}</div>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
            <div className="text-xs text-amber-400 mb-1">Charging</div>
            <div className="text-2xl font-bold">{mounted ? stats.charging : "..."}</div>
          </div>
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
            <div className="text-xs text-rose-400 mb-1">Issues</div>
            <div className="text-2xl font-bold">{mounted ? stats.errors + stats.offline : "..."}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/50 mb-1">Avg Battery</div>
            <div className="text-2xl font-bold">{mounted ? `${stats.avgBattery.toFixed(0)}%` : "..."}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/50 mb-1">Avg Uptime</div>
            <div className="text-2xl font-bold">{mounted ? `${stats.avgUptime.toFixed(1)}%` : "..."}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search robots..."
              className="w-full rounded-xl bg-white/10 pl-12 pr-4 py-3 text-white placeholder-white/40 outline-none transition-colors focus:bg-white/15 focus:ring-2 focus:ring-sky-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl bg-white/10 px-4 py-3 text-white outline-none transition-colors focus:bg-white/15 focus:ring-2 focus:ring-sky-500/50"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="idle">Idle</option>
            <option value="charging">Charging</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
            <option value="error">Error</option>
          </select>

          <select
            value={facilityFilter}
            onChange={(e) => setFacilityFilter(e.target.value)}
            className="rounded-xl bg-white/10 px-4 py-3 text-white outline-none transition-colors focus:bg-white/15 focus:ring-2 focus:ring-sky-500/50"
          >
            <option value="all">All Facilities</option>
            {facilities.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <select
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            className="rounded-xl bg-white/10 px-4 py-3 text-white outline-none transition-colors focus:bg-white/15 focus:ring-2 focus:ring-sky-500/50"
          >
            <option value="all">All Models</option>
            {models.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Robots Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRobots.map((robot) => (
            <Link
              key={robot.id}
              href={`/robots/${robot.id}`}
              className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 transition-all hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/10"
            >
              {/* Robot Header */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="font-semibold text-white group-hover:text-sky-400 transition-colors">
                    {robot.name}
                  </div>
                  <div className="text-xs text-white/50">{robot.serialNumber}</div>
                </div>
                <ExternalLink className="h-4 w-4 text-white/40 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              {/* Status Badge */}
              <div className={`mb-4 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium ${getStatusColor(robot.status)}`}>
                {getStatusIcon(robot.status)}
                <span className="capitalize">{robot.status}</span>
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Model</span>
                  <span className="font-medium">{robot.model}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-white/60">
                    <MapPin className="h-3 w-3" />
                    Facility
                  </span>
                  <span className="truncate font-medium text-right max-w-[150px]" title={robot.facility}>
                    {robot.facility}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-white/60">
                    <Battery className="h-3 w-3" />
                    Battery
                  </span>
                  <span className={`font-semibold ${
                    robot.battery > 60 ? "text-emerald-400" : 
                    robot.battery > 30 ? "text-amber-400" : "text-rose-400"
                  }`}>
                    {robot.battery}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-white/60">
                    <Zap className="h-3 w-3" />
                    Uptime
                  </span>
                  <span className="font-semibold text-emerald-400">{robot.uptime}%</span>
                </div>

                {robot.errors.length > 0 && (
                  <div className="flex items-start gap-2 rounded-lg bg-rose-500/10 p-2 text-xs text-rose-400">
                    <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                    <span>{robot.errors[0]}</span>
                  </div>
                )}

                <div className="text-xs text-white/40">
                  Last seen: {dayjs(robot.lastSeen).fromNow()}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredRobots.length === 0 && (
          <div className="py-20 text-center">
            <Bot className="mx-auto h-16 w-16 text-white/20 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No robots found</h3>
            <p className="text-white/50">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  );
}

