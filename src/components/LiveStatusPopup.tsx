"use client";

import { useState, useEffect, useRef } from "react";
import { X, CheckCircle, AlertTriangle, AlertCircle, Activity } from "lucide-react";

interface SystemStatus {
  name: string;
  status: "operational" | "degraded" | "outage";
  description: string;
  responseTime?: number;
}

const SYSTEM_STATUSES: SystemStatus[] = [
  {
    name: "Fleet Operations",
    status: "operational",
    description: "All robots responding normally",
    responseTime: 45,
  },
  {
    name: "Data Pipeline",
    status: "operational",
    description: "Real-time telemetry streaming",
    responseTime: 120,
  },
  {
    name: "AI Models",
    status: "operational",
    description: "Ursa Minor & Ursa Major online",
    responseTime: 230,
  },
  {
    name: "Seoul Servi Factory",
    status: "operational",
    description: "Production line nominal",
    responseTime: 78,
  },
  {
    name: "Busan Pilot Cluster",
    status: "degraded",
    description: "Elevated navigation variance detected",
    responseTime: 650,
  },
  {
    name: "API Gateway",
    status: "operational",
    description: "All endpoints responding",
    responseTime: 35,
  },
  {
    name: "Database",
    status: "operational",
    description: "Query performance optimal",
    responseTime: 12,
  },
  {
    name: "Authentication",
    status: "operational",
    description: "Bearer token validation active",
    responseTime: 18,
  },
];

interface LiveStatusPopupProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

export function LiveStatusPopup({ isOpen, onClose, anchorRef }: LiveStatusPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const operational = SYSTEM_STATUSES.filter((s) => s.status === "operational").length;
  const degraded = SYSTEM_STATUSES.filter((s) => s.status === "degraded").length;
  const outage = SYSTEM_STATUSES.filter((s) => s.status === "outage").length;

  const getStatusIcon = (status: SystemStatus["status"]) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "outage":
        return <AlertCircle className="h-4 w-4 text-rose-400" />;
    }
  };

  const getStatusColor = (status: SystemStatus["status"]) => {
    switch (status) {
      case "operational":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "degraded":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "outage":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    }
  };

  const getStatusLabel = (status: SystemStatus["status"]) => {
    switch (status) {
      case "operational":
        return "Operational";
      case "degraded":
        return "Degraded";
      case "outage":
        return "Outage";
    }
  };

  return (
    <div
      ref={popupRef}
      className="fixed top-20 right-6 z-[10000] w-96 animate-in slide-in-from-top-5 fade-in duration-200"
    >
      <div className="rounded-2xl border border-white/20 bg-[#020511]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/10 bg-gradient-to-r from-emerald-500/20 to-sky-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-sky-500">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">System Status</div>
                <div className="text-xs text-white/60">Bear Universe • Real-time</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Status Summary */}
        <div className="border-b border-white/10 bg-black/20 p-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-center">
              <div className="text-2xl font-bold text-emerald-400">{operational}</div>
              <div className="text-xs text-emerald-400/80 mt-1">Operational</div>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-center">
              <div className="text-2xl font-bold text-amber-400">{degraded}</div>
              <div className="text-xs text-amber-400/80 mt-1">Degraded</div>
            </div>
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-center">
              <div className="text-2xl font-bold text-rose-400">{outage}</div>
              <div className="text-xs text-rose-400/80 mt-1">Outages</div>
            </div>
          </div>
        </div>

        {/* System List */}
        <div className="max-h-96 overflow-y-auto p-4">
          <div className="space-y-3">
            {SYSTEM_STATUSES.map((system, index) => (
              <div
                key={index}
                className="group rounded-xl border border-white/5 bg-white/5 p-3 transition-all hover:bg-white/10 hover:border-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5">{getStatusIcon(system.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-sm font-medium text-white">{system.name}</div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(
                            system.status
                          )}`}
                        >
                          {getStatusLabel(system.status)}
                        </span>
                      </div>
                      <div className="text-xs text-white/60">{system.description}</div>
                      {system.responseTime && (
                        <div className="text-xs text-white/40 mt-1">
                          Latency: {system.responseTime}ms
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-black/20 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

