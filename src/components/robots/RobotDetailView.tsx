"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Bot, Battery, Wifi, MapPin, Activity, AlertTriangle,
  Settings, Terminal, FileText, Video, Map, Gauge, Zap, Clock,
  ChevronRight, Play, Pause, RotateCcw, CheckCircle, XCircle
} from "lucide-react";
import { Robot } from "@/lib/robotData";
import { Footer } from "@/components/Footer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface RobotDetailViewProps {
  robot: Robot;
}

export function RobotDetailView({ robot }: RobotDetailViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "map" | "telemetry" | "diagnostics" | "logs">("overview");
  const [isLiveView, setIsLiveView] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "map", label: "Navigation Map", icon: Map },
    { id: "telemetry", label: "Live Telemetry", icon: Gauge },
    { id: "diagnostics", label: "Diagnostics", icon: Settings },
    { id: "logs", label: "System Logs", icon: Terminal },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] text-white">
      <main className="mx-auto max-w-[1800px] px-6 py-8 lg:px-10">
        {/* Breadcrumb */}
        <Link 
          href="/robots"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Fleet</span>
        </Link>

        {/* Robot Header */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-sky-500/30">
                <Bot className="h-10 w-10 text-indigo-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{robot.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
                  <span>{robot.serialNumber}</span>
                  <span>•</span>
                  <span>{robot.model}</span>
                  <span>•</span>
                  <span>Firmware {robot.firmware}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium ${getStatusColor(robot.status)}`}>
                    <Activity className="h-4 w-4" />
                    <span className="capitalize">{robot.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <MapPin className="h-4 w-4" />
                    <span>{robot.facility}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-xl bg-black/20 p-4">
                <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                  <Battery className="h-3 w-3" />
                  <span>Battery</span>
                </div>
                <div className={`text-2xl font-bold ${
                  robot.battery > 60 ? "text-emerald-400" : 
                  robot.battery > 30 ? "text-amber-400" : "text-rose-400"
                }`}>
                  {robot.battery}%
                </div>
              </div>
              <div className="rounded-xl bg-black/20 p-4">
                <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                  <Zap className="h-3 w-3" />
                  <span>Uptime</span>
                </div>
                <div className="text-2xl font-bold text-emerald-400">{robot.uptime}%</div>
              </div>
              <div className="rounded-xl bg-black/20 p-4">
                <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                  <Activity className="h-3 w-3" />
                  <span>Trips Today</span>
                </div>
                <div className="text-2xl font-bold">{robot.metrics.ordersToday}</div>
              </div>
              <div className="rounded-xl bg-black/20 p-4">
                <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                  <Clock className="h-3 w-3" />
                  <span>Last Seen</span>
                </div>
                <div className="text-sm font-semibold">{dayjs(robot.lastSeen).fromNow()}</div>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {robot.errors.length > 0 && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
              <AlertTriangle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-rose-400 mb-2">Active Issues</div>
                {robot.errors.map((error, idx) => (
                  <div key={idx} className="mb-2 last:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-rose-300">{error.errorCode}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 uppercase">{error.severity}</span>
                    </div>
                    <div className="text-sm text-white/80">{error.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                    : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="grid gap-6">
          {activeTab === "overview" && (
            <>
              {/* Comprehensive KPI Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                  <h3 className="text-sm font-medium text-white/60 mb-4">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Avg Trip Time</span>
                      <span className="font-semibold">{robot.metrics.avgTripTime}s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Success Rate</span>
                      <span className="font-semibold text-emerald-400">{robot.metrics.successRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Distance Today</span>
                      <span className="font-semibold">{robot.metrics.distanceTraveled} km</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Orders Today</span>
                      <span className="font-semibold">{robot.metrics.ordersToday}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                  <h3 className="text-sm font-medium text-white/60 mb-4">Lifetime Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Total Trips</span>
                      <span className="font-semibold">{robot.metrics.tripsCompleted.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Orders Served</span>
                      <span className="font-semibold text-sky-400">{robot.metrics.ordersServed.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Total Distance</span>
                      <span className="font-semibold">{robot.metrics.totalDistanceKm} km</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Avg Uptime</span>
                      <span className="font-semibold text-emerald-400">{robot.uptime}%</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                  <h3 className="text-sm font-medium text-white/60 mb-4">Location Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">City</span>
                      <span className="font-semibold">{robot.city}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Region</span>
                      <span className="font-semibold">{robot.region}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Assigned Zone</span>
                      <span className="font-semibold">{robot.assignedZone || "Unassigned"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Floor</span>
                      <span className="font-semibold">Floor {robot.location.floor}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/5 to-sky-500/5 p-6">
                  <h3 className="text-sm font-medium text-white/60 mb-4">Robot Specifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Vertical</span>
                      <span className="font-semibold text-indigo-400">{robot.vertical}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Payload</span>
                      <span className="font-semibold">{robot.specs.payloadCapacity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Max Speed</span>
                      <span className="font-semibold">{robot.specs.maxSpeed}</span>
                    </div>
                    {robot.specs.trays && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">Trays</span>
                        <span className="font-semibold">{robot.specs.trays}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Runtime</span>
                      <span className="font-semibold text-emerald-400">{robot.specs.runtime}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                  <h3 className="text-sm font-medium text-white/60 mb-4">Current Task</h3>
                  {robot.currentTask ? (
                    <div className="rounded-xl bg-sky-500/10 border border-sky-500/30 p-4">
                      <div className="flex items-center gap-2 text-sky-400 mb-2">
                        <Activity className="h-4 w-4 animate-pulse" />
                        <span className="text-xs font-medium">IN PROGRESS</span>
                      </div>
                      <div className="text-white/90">{robot.currentTask}</div>
                      <div className="mt-3 pt-3 border-t border-sky-500/20 text-xs text-white/60">
                        Started {dayjs(robot.lastSeen).format('HH:mm:ss')}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-white/5 p-4 text-center text-white/50">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <div>No active task</div>
                      <div className="text-xs mt-1">Ready for assignment</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Facility Details */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                <h3 className="text-sm font-medium text-white/60 mb-4">Facility & Deployment</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <div className="text-xs text-white/50 mb-1">Facility Name</div>
                    <div className="font-semibold">{robot.facility}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 mb-1">GPS Coordinates</div>
                    <div className="font-mono text-sm">{robot.location.lat.toFixed(6)}, {robot.location.lng.toFixed(6)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 mb-1">Model & Serial</div>
                    <div className="font-semibold">{robot.model}</div>
                    <div className="text-xs text-white/40">{robot.serialNumber}</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                <h3 className="text-sm font-medium text-white/60 mb-4">Quick Actions (RFE Tools)</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <button className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-left transition-all hover:bg-emerald-500/20">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <div>
                      <div className="font-medium text-emerald-400">Run Diagnostics</div>
                      <div className="text-xs text-white/50">Full system check</div>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 rounded-xl bg-sky-500/10 border border-sky-500/30 p-4 text-left transition-all hover:bg-sky-500/20">
                    <RotateCcw className="h-5 w-5 text-sky-400" />
                    <div>
                      <div className="font-medium text-sky-400">Recalibrate LIDAR</div>
                      <div className="text-xs text-white/50">Navigation sensors</div>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 p-4 text-left transition-all hover:bg-indigo-500/20">
                    <Settings className="h-5 w-5 text-indigo-400" />
                    <div>
                      <div className="font-medium text-indigo-400">Adjust Parameters</div>
                      <div className="text-xs text-white/50">Speed, behavior</div>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-left transition-all hover:bg-rose-500/20">
                    <XCircle className="h-5 w-5 text-rose-400" />
                    <div>
                      <div className="font-medium text-rose-400">Emergency Stop</div>
                      <div className="text-xs text-white/50">Immediate halt</div>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "map" && (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Navigation Map - Floor {robot.location.floor}</h3>
                <button className="flex items-center gap-2 rounded-lg bg-sky-500/20 px-4 py-2 text-sm text-sky-400 transition-colors hover:bg-sky-500/30">
                  <Map className="h-4 w-4" />
                  <span>Edit Map</span>
                </button>
              </div>
              <div className="aspect-video rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <div className="text-center text-white/40">
                  <Map className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Live navigation map will render here</p>
                  <p className="text-xs mt-2">WebGL/Canvas-based real-time robot tracking</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "telemetry" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Live Telemetry Stream</h3>
                    <p className="text-xs text-white/50 mt-1">Real-time robot performance monitoring</p>
                  </div>
                  <button 
                    onClick={() => setIsLiveView(!isLiveView)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors ${
                      isLiveView 
                        ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" 
                        : "bg-white/10 text-white/60 hover:bg-white/15"
                    }`}
                  >
                    {isLiveView ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    <span>{isLiveView ? "Pause" : "Start"} Live Feed</span>
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-black/20 p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                      <Gauge className="h-3 w-3" />
                      <span>CPU Usage</span>
                    </div>
                    <div className="text-2xl font-bold text-sky-400">42%</div>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-400 transition-all" style={{ width: "42%" }} />
                    </div>
                    <div className="text-xs text-white/40 mt-2">Nominal</div>
                  </div>
                  <div className="rounded-xl bg-black/20 p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                      <Zap className="h-3 w-3" />
                      <span>Memory</span>
                    </div>
                    <div className="text-2xl font-bold text-indigo-400">1.8 GB</div>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400 transition-all" style={{ width: "65%" }} />
                    </div>
                    <div className="text-xs text-white/40 mt-2">2.8 GB total</div>
                  </div>
                  <div className="rounded-xl bg-black/20 p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                      <Wifi className="h-3 w-3" />
                      <span>Network Signal</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">-52 dBm</div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                      <Wifi className="h-3 w-3" />
                      <span>Excellent • 5GHz</span>
                    </div>
                    <div className="text-xs text-white/40 mt-1">Low latency (12ms)</div>
                  </div>
                  <div className="rounded-xl bg-black/20 p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                      <Battery className="h-3 w-3" />
                      <span>Battery Status</span>
                    </div>
                    <div className={`text-2xl font-bold ${
                      robot.battery > 60 ? "text-emerald-400" : 
                      robot.battery > 30 ? "text-amber-400" : "text-rose-400"
                    }`}>
                      {robot.battery}%
                    </div>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${
                        robot.battery > 60 ? "bg-emerald-400" : 
                        robot.battery > 30 ? "bg-amber-400" : "bg-rose-400"
                      }`} style={{ width: `${robot.battery}%` }} />
                    </div>
                    <div className="text-xs text-white/40 mt-2">{robot.status === "charging" ? "Charging..." : "Estimated 4.5h remaining"}</div>
                  </div>
                </div>
              </div>

              {/* Sensor Health */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                  <h3 className="text-sm font-medium text-white/60 mb-4">Navigation Sensors</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm">LIDAR (360°)</span>
                      </div>
                      <span className="text-xs text-white/60">10Hz • ±1° accuracy</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm">Camera Array</span>
                      </div>
                      <span className="text-xs text-white/60">6/6 operational</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm">Ultrasonic Sensors</span>
                      </div>
                      <span className="text-xs text-white/60">8/8 active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm">IMU (Gyro/Accel)</span>
                      </div>
                      <span className="text-xs text-white/60">Calibrated</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                  <h3 className="text-sm font-medium text-white/60 mb-4">Motion & Control</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm">Motor Controllers</span>
                      </div>
                      <span className="text-xs text-white/60">All nominal</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm">Wheel Encoders</span>
                      </div>
                      <span className="text-xs text-white/60">3/3 synced</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm">Tray Sensors</span>
                      </div>
                      <span className="text-xs text-white/60">Weight calibrated</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm">Emergency Stop</span>
                      </div>
                      <span className="text-xs text-white/60">Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "diagnostics" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                <h3 className="text-lg font-semibold mb-4">System Health</h3>
                <div className="space-y-3">
                  <DiagnosticItem label="LIDAR Sensor" status="healthy" value="±1° accuracy" />
                  <DiagnosticItem label="Camera Array" status="healthy" value="6/6 operational" />
                  <DiagnosticItem label="Motor Controllers" status="healthy" value="All nominal" />
                  <DiagnosticItem label="Battery Health" status={robot.battery < 30 ? "warning" : "healthy"} value={`${robot.battery}% capacity`} />
                  <DiagnosticItem label="WiFi Connection" status="healthy" value="-52 dBm, 5GHz" />
                  <DiagnosticItem label="Firmware Version" status="healthy" value={robot.firmware} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <h3 className="text-lg font-semibold mb-4">System Logs (Last 24h)</h3>
              <div className="space-y-2 font-mono text-xs">
                <LogEntry time="10:32:14" level="INFO" message="Task completed: Delivery to Table 12" />
                <LogEntry time="10:31:58" level="INFO" message="Navigation: Reached waypoint WP-08" />
                <LogEntry time="10:31:42" level="INFO" message="Task assigned: Table 12 delivery" />
                <LogEntry time="10:30:15" level="WARN" message="Obstacle detected, rerouting" />
                <LogEntry time="10:28:03" level="INFO" message="Battery level: 87%" />
                {robot.errors.length > 0 && (
                  <LogEntry time="10:15:32" level="ERROR" message={robot.errors[0]} />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Helper Components
function DiagnosticItem({ label, status, value }: { label: string; status: "healthy" | "warning" | "error"; value: string }) {
  const statusColors = {
    healthy: "text-emerald-400",
    warning: "text-amber-400",
    error: "text-rose-400",
  };

  const statusIcons = {
    healthy: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
  };

  const Icon = statusIcons[status];

  return (
    <div className="flex items-center justify-between rounded-lg bg-black/20 p-3">
      <div className="flex items-center gap-3">
        <Icon className={`h-4 w-4 ${statusColors[status]}`} />
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-white/60 text-sm">{value}</span>
    </div>
  );
}

function LogEntry({ time, level, message }: { time: string; level: string; message: string }) {
  const levelColors: Record<string, string> = {
    INFO: "text-sky-400",
    WARN: "text-amber-400",
    ERROR: "text-rose-400",
  };

  return (
    <div className="flex gap-3 rounded-lg bg-black/20 p-2 hover:bg-black/30 transition-colors">
      <span className="text-white/40">{time}</span>
      <span className={`font-semibold ${levelColors[level] || "text-white/60"}`}>[{level}]</span>
      <span className="text-white/80 selectable">{message}</span>
    </div>
  );
}

