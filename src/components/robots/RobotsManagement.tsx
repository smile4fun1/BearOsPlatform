"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Bot, MapPin, Battery, Clock, AlertTriangle, 
  Filter, ChevronDown, ExternalLink, Activity, Zap,
  WifiOff, Wrench, BatteryCharging, CircleAlert,
  QrCode, ScanLine, X, Camera
} from "lucide-react";
import { robotFleet, Robot, searchRobots, getRobotImage } from "@/lib/robotData";
import Image from "next/image";
import { useRole } from "@/lib/roleContext";
import { Footer } from "@/components/Footer";
import { RobotQRBadge } from "./RobotQRCode";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function RobotsManagement() {
  const { role } = useRole();
  const isInternalUser = role === 'internal_admin' || role === 'internal_rfe';
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [facilityFilter, setFacilityFilter] = useState<string>("all");
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<keyof Robot>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanInput, setScanInput] = useState("");

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
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-bear-blue mb-2 sm:mb-4">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium uppercase tracking-wider">Fleet Management</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mb-2 sm:mb-4">
                Robot Fleet
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-white/60 max-w-3xl">
                Monitor and manage your entire robot fleet. 
                <span className="text-white font-medium"> {filteredRobots.length}</span> of {robotFleet.length} robots.
              </p>
            </div>
            
            {/* Scan QR Button - Full width on mobile */}
            <button
              onClick={() => setShowScanModal(true)}
              className="flex items-center justify-center sm:justify-start gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-bear-blue/20 to-indigo-500/20 border border-bear-blue/30 text-white transition-all hover:from-bear-blue/30 hover:to-indigo-500/30 active:scale-[0.98] sm:hover:scale-[1.02] hover:shadow-lg hover:shadow-bear-blue/20 w-full sm:w-auto sm:self-start"
            >
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-bear-blue/20">
                <ScanLine className="h-4 w-4 sm:h-5 sm:w-5 text-bear-blue" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm sm:text-base">Scan Robot QR</div>
                <div className="text-[10px] sm:text-xs text-white/60">Quick access to robot</div>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Cards - 2 cols mobile, 3 cols tablet, 6 cols desktop */}
        <div className="mb-6 sm:mb-8 lg:mb-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          <div className="rounded-lg sm:rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 sm:p-4">
            <div className="text-[10px] sm:text-xs text-emerald-400 mb-0.5 sm:mb-1">Active</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{mounted ? stats.active : "..."}</div>
          </div>
          <div className="rounded-lg sm:rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 sm:p-4">
            <div className="text-[10px] sm:text-xs text-sky-400 mb-0.5 sm:mb-1">Idle</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{mounted ? stats.idle : "..."}</div>
          </div>
          <div className="rounded-lg sm:rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 sm:p-4">
            <div className="text-[10px] sm:text-xs text-amber-400 mb-0.5 sm:mb-1">Charging</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{mounted ? stats.charging : "..."}</div>
          </div>
          <div className="rounded-lg sm:rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 sm:p-4">
            <div className="text-[10px] sm:text-xs text-rose-400 mb-0.5 sm:mb-1">Issues</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{mounted ? stats.errors + stats.offline : "..."}</div>
          </div>
          <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
            <div className="text-[10px] sm:text-xs text-white/50 mb-0.5 sm:mb-1">Avg Battery</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{mounted ? `${stats.avgBattery.toFixed(0)}%` : "..."}</div>
          </div>
          <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
            <div className="text-[10px] sm:text-xs text-white/50 mb-0.5 sm:mb-1">Avg Uptime</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{mounted ? `${stats.avgUptime.toFixed(1)}%` : "..."}</div>
          </div>
        </div>

        {/* Filters - Stack on mobile */}
        <div className="mb-4 sm:mb-6 grid gap-2 sm:gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search robots..."
              className="w-full rounded-lg sm:rounded-xl bg-white/10 pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/40 outline-none transition-colors focus:bg-white/15 focus:ring-2 focus:ring-bear-blue/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg sm:rounded-xl bg-white/10 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white outline-none transition-colors focus:bg-white/15 focus:ring-2 focus:ring-bear-blue/50 [&>option]:bg-gray-800 [&>option]:text-white"
          >
            <option value="all" className="bg-gray-800 text-white">All Statuses</option>
            <option value="active" className="bg-gray-800 text-white">Active</option>
            <option value="idle" className="bg-gray-800 text-white">Idle</option>
            <option value="charging" className="bg-gray-800 text-white">Charging</option>
            <option value="maintenance" className="bg-gray-800 text-white">Maintenance</option>
            <option value="offline" className="bg-gray-800 text-white">Offline</option>
            <option value="error" className="bg-gray-800 text-white">Error</option>
          </select>

          <select
            value={facilityFilter}
            onChange={(e) => setFacilityFilter(e.target.value)}
            className="rounded-lg sm:rounded-xl bg-white/10 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white outline-none transition-colors focus:bg-white/15 focus:ring-2 focus:ring-bear-blue/50 [&>option]:bg-gray-800 [&>option]:text-white"
          >
            <option value="all" className="bg-gray-800 text-white">All Facilities</option>
            {facilities.map(f => (
              <option key={f} value={f} className="bg-gray-800 text-white">{f}</option>
            ))}
          </select>

          <select
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            className="rounded-lg sm:rounded-xl bg-white/10 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white outline-none transition-colors focus:bg-white/15 focus:ring-2 focus:ring-bear-blue/50 [&>option]:bg-gray-800 [&>option]:text-white"
          >
            <option value="all" className="bg-gray-800 text-white">All Models</option>
            {models.map(m => (
              <option key={m} value={m} className="bg-gray-800 text-white">{m}</option>
            ))}
          </select>
        </div>

        {/* Robots Grid - Single column on mobile */}
        <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRobots.map((robot, index) => (
            <motion.div
              key={robot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
            >
              <Link
                href={`/robots/${robot.id}`}
                className="group block rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 sm:p-5 transition-all duration-300 hover:border-bear-blue/30 hover:shadow-lg hover:shadow-bear-blue/10 sm:hover:-translate-y-1 active:scale-[0.98] relative overflow-hidden h-full"
              >
                {/* Robot Image Background */}
                <div className="absolute -right-4 -bottom-4 w-20 sm:w-28 h-20 sm:h-28 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                  <Image
                    src={getRobotImage(robot.model)}
                    alt={robot.model}
                    width={112}
                    height={112}
                    className="object-contain"
                  />
                </div>
                
                {/* Robot Header with QR */}
                <div className="relative mb-3 sm:mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-bear-blue/20 to-purple-500/10 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-bear-blue/30 transition-colors flex-shrink-0">
                      <Image
                        src={getRobotImage(robot.model)}
                        alt={robot.model}
                        width={36}
                        height={36}
                        className="object-contain group-hover:scale-110 transition-transform w-7 h-7 sm:w-9 sm:h-9"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm sm:text-base text-white group-hover:text-bear-blue transition-colors truncate">
                        {robot.name}
                      </div>
                      <div className="text-[10px] sm:text-xs text-white/50 font-mono truncate">{robot.serialNumber}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-white/5 group-hover:bg-bear-blue/10 transition-colors">
                      <QrCode className="h-3 w-3 sm:h-4 sm:w-4 text-white/40 group-hover:text-bear-blue transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`mb-3 sm:mb-4 inline-flex items-center gap-1.5 sm:gap-2 rounded-md sm:rounded-lg border px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold ${getStatusColor(robot.status)}`}>
                  {getStatusIcon(robot.status)}
                  <span className="capitalize">{robot.status}</span>
                </div>

                {/* Metrics */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-white/60">Model</span>
                    <span className="font-medium text-bear-blue">{robot.model}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-1 sm:gap-1.5 text-white/60">
                      <MapPin className="h-3 w-3" />
                      <span className="hidden sm:inline">Facility</span>
                      <span className="sm:hidden">Loc</span>
                    </span>
                    <span className="truncate font-medium text-right max-w-[100px] sm:max-w-[150px]" title={robot.facility}>
                      {robot.facility.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-1 sm:gap-1.5 text-white/60">
                      <Battery className="h-3 w-3" />
                      Battery
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            robot.battery > 60 ? "bg-emerald-400" : 
                            robot.battery > 30 ? "bg-amber-400" : "bg-rose-400"
                          }`}
                          style={{ width: `${robot.battery}%` }}
                        />
                      </div>
                      <span className={`font-semibold text-[10px] sm:text-xs ${
                        robot.battery > 60 ? "text-emerald-400" : 
                        robot.battery > 30 ? "text-amber-400" : "text-rose-400"
                      }`}>
                        {robot.battery}%
                      </span>
                    </div>
                  </div>

                  {robot.errors.length > 0 && (
                    <div className="flex items-start gap-1.5 sm:gap-2 rounded-md sm:rounded-lg bg-rose-500/10 border border-rose-500/20 p-1.5 sm:p-2 text-[10px] sm:text-xs text-rose-400">
                      <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{robot.errors[0].errorCode}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/5 text-[10px] sm:text-xs text-white/40 flex items-center gap-1 sm:gap-1.5">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{dayjs(robot.lastSeen).fromNow()}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
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
      <Footer />

      {/* Scan QR Modal */}
      <AnimatePresence>
        {showScanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowScanModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1f36] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-bear-blue/20">
                    <ScanLine className="w-5 h-5 text-bear-blue" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Scan Robot QR Code</h3>
                    <p className="text-xs text-gray-400">Enter robot ID or scan QR</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowScanModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Camera Placeholder */}
              <div className="bg-black/40 rounded-2xl p-8 mb-6 border border-white/10 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-white/30" />
                </div>
                <p className="text-sm text-gray-400 mb-2">Camera access for QR scanning</p>
                <p className="text-xs text-gray-500">Coming soon - For now, enter robot ID below</p>
              </div>

              {/* Manual Entry */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Enter Robot ID or Serial Number
                </label>
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="e.g., c44e79 or SRV-C44E79"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none transition-all focus:bg-white/10 focus:border-bear-blue/50 focus:ring-2 focus:ring-bear-blue/20"
                  autoFocus
                />
              </div>

              {/* Recent Robots */}
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Quick Access</p>
                <div className="flex flex-wrap gap-2">
                  {robotFleet.slice(0, 5).map((r) => (
                    <Link
                      key={r.id}
                      href={`/robots/${r.id}`}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:border-bear-blue/30 hover:text-white transition-all"
                      onClick={() => setShowScanModal(false)}
                    >
                      {r.id.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={scanInput ? `/robots/${scanInput.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6)}` : '#'}
                onClick={(e) => {
                  if (!scanInput) e.preventDefault();
                  else setShowScanModal(false);
                }}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
                  scanInput 
                    ? 'bg-bear-blue text-white hover:bg-bear-blue/90 shadow-lg shadow-bear-blue/20' 
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Bot className="w-5 h-5" />
                Go to Robot
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

