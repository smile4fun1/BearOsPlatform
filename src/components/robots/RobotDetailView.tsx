"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Bot, Battery, Wifi, MapPin, Activity, AlertTriangle,
  Settings, Terminal, FileText, Video, Map, Gauge, Zap, Clock,
  ChevronRight, Play, Pause, RotateCcw, CheckCircle, XCircle, Wrench,
  QrCode, Share2, Phone, MessageSquare
} from "lucide-react";
import { Robot, getRobotImage } from "@/lib/robotData";
import Image from "next/image";
import { useRole } from "@/lib/roleContext";
import { Footer } from "@/components/Footer";
import { RFEDiagnosticPanel } from "./RFEDiagnosticPanel";
import { RobotQRCode } from "./RobotQRCode";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface RobotDetailViewProps {
  robot: Robot;
}

export function RobotDetailView({ robot }: RobotDetailViewProps) {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState<"overview" | "map" | "telemetry" | "diagnostics" | "logs">("overview");
  const [isLiveView, setIsLiveView] = useState(false);
  const [showRFEPanel, setShowRFEPanel] = useState(false);

  // Role-based access control
  const isInternalUser = role === 'internal_admin' || role === 'internal_rfe';
  const isAdmin = role === 'internal_admin';
  const isPartner = role === 'partner_qcom';
  const isCustomer = role === 'customer_manager';

  // Filter tabs based on role
  const allTabs = [
    { id: "overview", label: "Overview", icon: Activity, roles: ['internal_admin', 'internal_rfe', 'partner_qcom', 'customer_manager'] },
    { id: "map", label: "Navigation Map", icon: Map, roles: ['internal_admin', 'internal_rfe'] },
    { id: "telemetry", label: "Live Telemetry", icon: Gauge, roles: ['internal_admin', 'internal_rfe', 'partner_qcom'] },
    { id: "diagnostics", label: "Diagnostics", icon: Settings, roles: ['internal_admin', 'internal_rfe'] },
    { id: "logs", label: "System Logs", icon: Terminal, roles: ['internal_admin', 'internal_rfe'] },
  ];

  const tabs = allTabs.filter(tab => tab.roles.includes(role));

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
    <div className="min-h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] text-white relative">
      {/* Decorative Background Elements */}
      <div className="fixed top-20 right-0 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] bg-bear-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-0 w-[200px] sm:w-[300px] lg:w-[400px] h-[200px] sm:h-[300px] lg:h-[400px] bg-purple-500/3 rounded-full blur-3xl pointer-events-none" />
      
      <main className="relative mx-auto max-w-[1800px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link 
            href="/robots"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/60 hover:text-bear-blue hover:gap-3 transition-all mb-4 sm:mb-6 group"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Fleet</span>
          </Link>
        </motion.div>

        {/* Robot Header */}
        <motion.div 
          className="mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 sm:p-6 lg:p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Large Background Robot Image */}
          <div className="absolute right-0 bottom-0 w-40 sm:w-56 lg:w-72 h-40 sm:h-56 lg:h-72 opacity-5 pointer-events-none">
            <Image
              src={getRobotImage(robot.model)}
              alt=""
              width={288}
              height={288}
              className="object-contain translate-x-8 sm:translate-x-12 lg:translate-x-16 translate-y-8 sm:translate-y-12 lg:translate-y-16 w-full h-full"
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex items-start gap-4 xl:gap-6">
              {/* Robot Image & QR Code */}
              <div className="hidden xl:flex items-center gap-6">
                {/* Robot Image */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-bear-blue/20 to-purple-500/10 flex items-center justify-center border border-white/10 overflow-hidden">
                  <Image
                    src={getRobotImage(robot.model)}
                    alt={robot.model}
                    width={80}
                    height={80}
                    className="object-contain"
                    style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                
                {/* QR Code */}
                <RobotQRCode robot={robot} size="sm" showActions={isInternalUser} />
              </div>
              
              {/* Mobile & Tablet: Show robot image */}
              <div className="xl:hidden w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-bear-blue/20 to-purple-500/10 flex items-center justify-center border border-white/10 overflow-hidden shadow-lg shadow-bear-blue/10 flex-shrink-0">
                <Image
                  src={getRobotImage(robot.model)}
                  alt={robot.model}
                  width={64}
                  height={64}
                  className="object-contain"
                  style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold truncate">{robot.name}</h1>
                  <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium self-start ${getStatusColor(robot.status)}`}>
                    <Activity className="h-4 w-4" />
                    <span className="capitalize">{robot.status}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/60 mb-3">
                  <span className="font-mono">{robot.serialNumber}</span>
                  <span>•</span>
                  <span className="text-bear-blue font-medium">{robot.model}</span>
                  {isInternalUser && (
                    <>
                      <span>•</span>
                      <span>Firmware {robot.firmware}</span>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-white/60 bg-white/5 px-3 py-1.5 rounded-lg">
                    <MapPin className="h-4 w-4 text-bear-blue" />
                    <span>{robot.facility}</span>
                  </div>
                  {robot.assignedZone && (
                    <div className="flex items-center gap-2 text-sm text-white/60 bg-white/5 px-3 py-1.5 rounded-lg">
                      <Map className="h-4 w-4 text-purple-400" />
                      <span>{robot.assignedZone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:w-auto w-full">
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

          {/* Action Buttons - Role Aware */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            {/* RFE Diagnostic Panel - Internal Only */}
            {isInternalUser && (
              <button
                onClick={() => setShowRFEPanel(true)}
                className="flex-1 flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500/20 to-sky-500/20 border border-indigo-500/30 p-4 text-white transition-all hover:from-indigo-500/30 hover:to-sky-500/30 hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-500/20"
              >
                <Wrench className="h-5 w-5 text-indigo-300" />
                <span className="font-semibold">Open RFE Diagnostic Panel</span>
                <span className="text-xs text-white/60 ml-2">(AI-Powered)</span>
              </button>
            )}
            
            {/* Contact Support - For Partners & Customers */}
            {(isPartner || isCustomer) && (
              <Link
                href="/connect"
                className="flex-1 flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-bear-blue/20 to-indigo-500/20 border border-bear-blue/30 p-4 text-white transition-all hover:from-bear-blue/30 hover:to-indigo-500/30 hover:scale-[1.01] hover:shadow-lg hover:shadow-bear-blue/20"
              >
                <MessageSquare className="h-5 w-5 text-bear-blue" />
                <span className="font-semibold">Contact Support</span>
                <span className="text-xs text-white/60 ml-2">Get Help</span>
              </Link>
            )}
            
            {/* Share/QR Button - Mobile */}
            <button
              onClick={() => {
                const qrModal = document.querySelector('[data-qr-modal]');
                if (qrModal) (qrModal as HTMLElement).click();
              }}
              className="md:hidden flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 p-4 text-white transition-all hover:bg-white/10"
            >
              <QrCode className="h-5 w-5 text-bear-blue" />
              <span className="font-medium">Show QR Code</span>
            </button>
          </div>
        </motion.div>

        {/* Tabs - BearEmeaSupport Style */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Desktop & Tablet: Full width with evenly distributed tabs */}
          <div className="hidden sm:flex items-center gap-2 p-1.5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-bear-blue text-white shadow-lg shadow-bear-blue/30"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Mobile: Scrollable */}
          <div className="sm:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex items-center gap-2 p-1.5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 min-w-max">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-bear-blue text-white shadow-lg shadow-bear-blue/30"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <>
              {/* Comprehensive KPI Grid - Professional Cards */}
              <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-2 lg:grid-cols-4">
                {/* Performance Metrics */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-5 sm:p-6 flex flex-col hover:border-bear-blue/30 transition-all">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-bear-blue/10 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-bear-blue" />
                    </div>
                    <h3 className="text-sm font-bold text-white/80">Performance Metrics</h3>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-medium">Avg Trip Time</div>
                      <div className="text-2xl font-bold text-white tabular-nums">{robot.metrics.avgTripTime}<span className="text-base text-white/60 ml-1">s</span></div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-medium">Success Rate</div>
                      <div className="text-2xl font-bold text-emerald-400 tabular-nums">{robot.metrics.successRate}<span className="text-base text-emerald-400/60 ml-1">%</span></div>
                    </div>
                    <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-white/30 mb-1">Distance</div>
                        <div className="text-sm font-bold text-white tabular-nums">{robot.metrics.distanceTraveled}<span className="text-xs text-white/50 ml-0.5">km</span></div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-white/30 mb-1">Orders</div>
                        <div className="text-sm font-bold text-white tabular-nums">{robot.metrics.ordersToday}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lifetime Stats */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-5 sm:p-6 flex flex-col hover:border-bear-blue/30 transition-all">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-indigo-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white/80">Lifetime Stats</h3>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-medium">Total Trips</div>
                      <div className="text-2xl font-bold text-white tabular-nums">{robot.metrics.tripsCompleted.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-medium">Orders Served</div>
                      <div className="text-2xl font-bold text-bear-blue tabular-nums">{robot.metrics.ordersServed.toLocaleString()}</div>
                    </div>
                    <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-white/30 mb-1">Distance</div>
                        <div className="text-sm font-bold text-white tabular-nums">{robot.metrics.totalDistanceKm}<span className="text-xs text-white/50 ml-0.5">km</span></div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-white/30 mb-1">Uptime</div>
                        <div className="text-sm font-bold text-emerald-400 tabular-nums">{robot.uptime}<span className="text-xs text-emerald-400/50 ml-0.5">%</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Info */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-5 sm:p-6 flex flex-col hover:border-bear-blue/30 transition-all">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-purple-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white/80">Location Info</h3>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-medium">City</div>
                      <div className="text-xl font-bold text-white">{robot.city}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-medium">Region</div>
                      <div className="text-xl font-bold text-white">{robot.region}</div>
                    </div>
                    <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-white/30 mb-1">Zone</div>
                        <div className="text-sm font-bold text-white">{robot.assignedZone || "—"}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-white/30 mb-1">Floor</div>
                        <div className="text-sm font-bold text-white">Floor {robot.location.floor}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Robot Specifications */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-bear-blue/5 to-indigo-500/5 backdrop-blur-sm p-5 sm:p-6 flex flex-col hover:border-bear-blue/30 transition-all">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-bear-blue/20 flex items-center justify-center">
                      <Settings className="h-4 w-4 text-bear-blue" />
                    </div>
                    <h3 className="text-sm font-bold text-white/80">Robot Specifications</h3>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-medium">Vertical</div>
                      <div className="text-xl font-bold text-bear-blue">{robot.vertical}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-medium">Payload</div>
                      <div className="text-xl font-bold text-white">{robot.specs.payloadCapacity}</div>
                    </div>
                    <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-white/30 mb-1">Speed</div>
                        <div className="text-sm font-bold text-white">{robot.specs.maxSpeed}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-white/30 mb-1">Runtime</div>
                        <div className="text-sm font-bold text-emerald-400">{robot.specs.runtime}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Task - Full Width */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 sm:p-5 lg:p-6">
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 mb-3 sm:mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-bear-blue" />
                  Current Task
                </h3>
                {robot.currentTask ? (
                  <div className="rounded-xl bg-bear-blue/10 border border-bear-blue/30 p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-bear-blue mb-2">
                      <Activity className="h-4 w-4 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider">In Progress</span>
                    </div>
                    <div className="text-white text-lg sm:text-xl font-bold">{robot.currentTask}</div>
                    <div className="mt-3 pt-3 border-t border-bear-blue/20 text-xs text-white/50">
                      Started {dayjs(robot.lastSeen).format('HH:mm:ss')}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-white/5 border border-white/10 p-5 text-center">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-white/20" />
                    <div className="font-semibold text-white/60">No active task</div>
                    <div className="text-xs text-white/40 mt-1">Ready for assignment</div>
                  </div>
                )}
              </div>

              {/* Facility Details */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 sm:p-5 lg:p-6">
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 mb-3 sm:mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-bear-blue" />
                  Facility & Deployment
                </h3>
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
                  <div className="bg-black/20 rounded-xl p-3 sm:p-4">
                    <div className="text-[10px] sm:text-xs text-white/50 mb-1 uppercase tracking-wider font-medium">Facility Name</div>
                    <div className="font-bold text-white text-sm sm:text-base">{robot.facility}</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 sm:p-4">
                    <div className="text-[10px] sm:text-xs text-white/50 mb-1 uppercase tracking-wider font-medium">GPS Coordinates</div>
                    <div className="font-mono text-xs sm:text-sm text-white">{robot.location.lat.toFixed(6)}, {robot.location.lng.toFixed(6)}</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 sm:p-4">
                    <div className="text-[10px] sm:text-xs text-white/50 mb-1 uppercase tracking-wider font-medium">Model & Serial</div>
                    <div className="font-bold text-white text-sm sm:text-base">{robot.model}</div>
                    <div className="text-xs text-white/40 mt-0.5">{robot.serialNumber}</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Role Aware */}
              {isInternalUser && (
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 sm:p-5 lg:p-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-white/60 mb-3 sm:mb-4 flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-bear-blue" />
                    Quick Actions (RFE Tools)
                  </h3>
                  <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                    <button className="flex items-center gap-2 sm:gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 sm:p-4 text-left transition-all hover:bg-emerald-500/20 active:scale-[0.98]">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-emerald-400 text-xs sm:text-sm truncate">Run Diagnostics</div>
                        <div className="text-[10px] sm:text-xs text-white/50 truncate">Full system check</div>
                      </div>
                    </button>
                    <button className="flex items-center gap-2 sm:gap-3 rounded-xl bg-bear-blue/10 border border-bear-blue/30 p-3 sm:p-4 text-left transition-all hover:bg-bear-blue/20 active:scale-[0.98]">
                      <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 text-bear-blue flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-bear-blue text-xs sm:text-sm truncate">Recalibrate LIDAR</div>
                        <div className="text-[10px] sm:text-xs text-white/50 truncate">Navigation sensors</div>
                      </div>
                    </button>
                    <button className="flex items-center gap-2 sm:gap-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 p-3 sm:p-4 text-left transition-all hover:bg-indigo-500/20 active:scale-[0.98]">
                      <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-indigo-400 text-xs sm:text-sm truncate">Adjust Parameters</div>
                        <div className="text-[10px] sm:text-xs text-white/50 truncate">Speed, behavior</div>
                      </div>
                    </button>
                    <button className="flex items-center gap-2 sm:gap-3 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 sm:p-4 text-left transition-all hover:bg-rose-500/20 active:scale-[0.98]">
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-rose-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-rose-400 text-xs sm:text-sm truncate">Emergency Stop</div>
                        <div className="text-[10px] sm:text-xs text-white/50 truncate">Immediate halt</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Customer/Partner View - Support Actions */}
              {(isPartner || isCustomer) && (
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                  <h3 className="text-sm font-medium text-white/60 mb-4">Need Help?</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Link href="/knowledge" className="flex items-center gap-3 rounded-xl bg-bear-blue/10 border border-bear-blue/30 p-4 text-left transition-all hover:bg-bear-blue/20 hover:scale-[1.02]">
                      <FileText className="h-5 w-5 text-bear-blue" />
                      <div>
                        <div className="font-medium text-bear-blue">Knowledge Base</div>
                        <div className="text-xs text-white/50">Find answers</div>
                      </div>
                    </Link>
                    <Link href="/connect" className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-left transition-all hover:bg-emerald-500/20 hover:scale-[1.02]">
                      <MessageSquare className="h-5 w-5 text-emerald-400" />
                      <div>
                        <div className="font-medium text-emerald-400">Chat with Support</div>
                        <div className="text-xs text-white/50">Get live help</div>
                      </div>
                    </Link>
                    <button className="flex items-center gap-3 rounded-xl bg-purple-500/10 border border-purple-500/30 p-4 text-left transition-all hover:bg-purple-500/20 hover:scale-[1.02]">
                      <Phone className="h-5 w-5 text-purple-400" />
                      <div>
                        <div className="font-medium text-purple-400">Request Callback</div>
                        <div className="text-xs text-white/50">Urgent issues</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
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
                  {/* Check for actual errors by category */}
                  {(() => {
                    const sensorError = robot.errors.find(e => e.category === "sensor");
                    const mechanicalError = robot.errors.find(e => e.category === "mechanical");
                    const navigationError = robot.errors.find(e => e.category === "navigation");
                    const batteryError = robot.errors.find(e => e.category === "battery");
                    const networkError = robot.errors.find(e => e.category === "network");
                    
                    return (
                      <>
                        <DiagnosticItem 
                          label="LIDAR Sensor" 
                          status={sensorError ? "error" : navigationError ? "warning" : "healthy"} 
                          value={sensorError ? sensorError.errorCode : "±1° accuracy"} 
                        />
                        <DiagnosticItem 
                          label="Camera Array" 
                          status={sensorError ? "warning" : "healthy"} 
                          value={sensorError ? "Degraded" : "6/6 operational"} 
                        />
                        <DiagnosticItem 
                          label="Motor Controllers" 
                          status={mechanicalError ? "error" : "healthy"} 
                          value={mechanicalError ? mechanicalError.errorCode : "All nominal"} 
                        />
                        <DiagnosticItem 
                          label="Battery Health" 
                          status={batteryError ? "error" : robot.battery < 30 ? "warning" : "healthy"} 
                          value={batteryError ? batteryError.errorCode : `${robot.battery}% capacity`} 
                        />
                        <DiagnosticItem 
                          label="WiFi Connection" 
                          status={networkError ? "error" : "healthy"} 
                          value={networkError ? networkError.errorCode : "-52 dBm, 5GHz"} 
                        />
                        <DiagnosticItem 
                          label="Firmware Version" 
                          status="healthy" 
                          value={robot.firmware} 
                        />
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Show detailed errors if any exist */}
              {robot.errors.length > 0 && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-rose-400">Active Diagnostic Alerts</h3>
                  <div className="space-y-3">
                    {robot.errors.map((error, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-lg bg-black/20 p-4">
                        <AlertTriangle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-mono text-rose-300">{error.errorCode}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 uppercase">{error.severity}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60 capitalize">{error.category}</span>
                          </div>
                          <div className="text-sm text-white/80">{error.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "logs" && (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <h3 className="text-lg font-semibold mb-4">System Logs (Last 24h)</h3>
              <div className="space-y-2 font-mono text-xs">
                {(() => {
                  const now = new Date();
                  const logs = [];
                  
                  // Generate logs based on actual robot state
                  const baseTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
                  
                  // Add error logs first if there are errors
                  if (robot.errors.length > 0) {
                    robot.errors.forEach((error, idx) => {
                      const errorTime = baseTime - (idx * 120 + 180); // Errors 3-5 min ago
                      const h = Math.floor(errorTime / 3600) % 24;
                      const m = Math.floor((errorTime % 3600) / 60);
                      const s = errorTime % 60;
                      logs.push({
                        time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
                        level: error.severity === "critical" || error.severity === "high" ? "ERROR" : "WARN",
                        message: `${error.errorCode}: ${error.message}`
                      });
                    });
                  }
                  
                  // Recent task completion
                  const t1 = baseTime - 45;
                  logs.push({
                    time: `${String(Math.floor(t1/3600)%24).padStart(2,'0')}:${String(Math.floor((t1%3600)/60)).padStart(2,'0')}:${String(t1%60).padStart(2,'0')}`,
                    level: "INFO",
                    message: robot.currentTask ? `Task in progress: ${robot.currentTask}` : `Task completed: Delivery to ${robot.assignedZone || 'assigned zone'}`
                  });
                  
                  // Navigation update
                  const t2 = baseTime - 156;
                  logs.push({
                    time: `${String(Math.floor(t2/3600)%24).padStart(2,'0')}:${String(Math.floor((t2%3600)/60)).padStart(2,'0')}:${String(t2%60).padStart(2,'0')}`,
                    level: "INFO",
                    message: `Navigation: Position update - Floor ${robot.location.floor}`
                  });
                  
                  // Battery status based on actual level
                  const t3 = baseTime - 289;
                  logs.push({
                    time: `${String(Math.floor(t3/3600)%24).padStart(2,'0')}:${String(Math.floor((t3%3600)/60)).padStart(2,'0')}:${String(t3%60).padStart(2,'0')}`,
                    level: robot.battery < 30 ? "WARN" : "INFO",
                    message: `Battery level: ${robot.battery}% ${robot.battery < 30 ? '(Low - charging recommended)' : robot.battery > 80 ? '(Excellent)' : '(Good)'}`
                  });
                  
                  // Status-specific logs
                  if (robot.status === "charging") {
                    const t4 = baseTime - 612;
                    logs.push({
                      time: `${String(Math.floor(t4/3600)%24).padStart(2,'0')}:${String(Math.floor((t4%3600)/60)).padStart(2,'0')}:${String(t4%60).padStart(2,'0')}`,
                      level: "INFO",
                      message: "Charging station: Connection established"
                    });
                  } else if (robot.status === "error") {
                    const t4 = baseTime - 425;
                    logs.push({
                      time: `${String(Math.floor(t4/3600)%24).padStart(2,'0')}:${String(Math.floor((t4%3600)/60)).padStart(2,'0')}:${String(t4%60).padStart(2,'0')}`,
                      level: "ERROR",
                      message: "System status: Error state detected - immediate attention required"
                    });
                  } else if (robot.status === "maintenance") {
                    const t4 = baseTime - 732;
                    logs.push({
                      time: `${String(Math.floor(t4/3600)%24).padStart(2,'0')}:${String(Math.floor((t4%3600)/60)).padStart(2,'0')}:${String(t4%60).padStart(2,'0')}`,
                      level: "INFO",
                      message: "Maintenance mode activated by field engineer"
                    });
                  }
                  
                  // Trip stats
                  const t5 = baseTime - 1847;
                  logs.push({
                    time: `${String(Math.floor(t5/3600)%24).padStart(2,'0')}:${String(Math.floor((t5%3600)/60)).padStart(2,'0')}:${String(t5%60).padStart(2,'0')}`,
                    level: "INFO",
                    message: `Performance: ${robot.metrics.tripsCompleted} trips completed today (${robot.metrics.successRate}% success rate)`
                  });
                  
                  // Firmware check
                  const t6 = baseTime - 2941;
                  logs.push({
                    time: `${String(Math.floor(t6/3600)%24).padStart(2,'0')}:${String(Math.floor((t6%3600)/60)).padStart(2,'0')}:${String(t6%60).padStart(2,'0')}`,
                    level: "INFO",
                    message: `Firmware version ${robot.firmware} - System check OK`
                  });
                  
                  // Startup log
                  const t7 = baseTime - 7200;
                  logs.push({
                    time: `${String(Math.floor(t7/3600)%24).padStart(2,'0')}:${String(Math.floor((t7%3600)/60)).padStart(2,'0')}:${String(t7%60).padStart(2,'0')}`,
                    level: "INFO",
                    message: `System startup completed - ${robot.name} online at ${robot.facility}`
                  });
                  
                  return logs.map((log, idx) => (
                    <LogEntry key={idx} time={log.time} level={log.level} message={log.message} />
                  ));
                })()}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* RFE Diagnostic Panel - Internal Users Only */}
      {isInternalUser && showRFEPanel && (
        <RFEDiagnosticPanel
          robot={robot}
          onClose={() => setShowRFEPanel(false)}
        />
      )}
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

