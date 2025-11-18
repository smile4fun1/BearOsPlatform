"use client";

import { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  AlertCircle, 
  AlertOctagon, 
  Info,
  X,
  Terminal,
  MessageSquare,
  Clock,
  MapPin,
  Activity,
  Zap,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import { RobotIncident, getActiveIncidents } from "@/lib/incidentData";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
faker.seed(42);

export function InteractiveIncidentRadar() {
  const [incidents, setIncidents] = useState<RobotIncident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<RobotIncident | null>(null);
  const [filter, setFilter] = useState<"all" | "critical" | "high">("all");
  const [isSSHOpen, setIsSSHOpen] = useState(false);

  useEffect(() => {
    // Load initial incidents
    setIncidents(getActiveIncidents());
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setIncidents(prev => {
        const updated = getActiveIncidents();
        // Only update if there are changes to avoid unnecessary re-renders
        if (JSON.stringify(prev.map(i => i.id)) !== JSON.stringify(updated.map(i => i.id))) {
          return updated;
        }
        return prev;
      });
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const filteredIncidents = incidents.filter(inc => {
    if (filter === "all") return true;
    return inc.severity === filter;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertOctagon className="h-5 w-5" />;
      case "high": return <AlertTriangle className="h-5 w-5" />;
      case "medium": return <AlertCircle className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400";
      case "high": return "from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400";
      case "medium": return "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400";
      default: return "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400";
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      open: "bg-red-500/20 text-red-400 border-red-500/30",
      investigating: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      in_progress: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      resolved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      escalated: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };
    return colors[status as keyof typeof colors] || colors.open;
  };

  const handleSendToAI = (incident: RobotIncident) => {
    // Comprehensive message with full context for AI
    const message = `🚨 INCIDENT INVESTIGATION REQUEST

**Error Code**: ${incident.errorCode}
**Robot**: ${incident.robotName} (ID: ${incident.robotId})
**Facility**: ${incident.facility}, ${incident.city}
**Severity**: ${incident.severity.toUpperCase()}
**Status**: ${incident.status}
**Category**: ${incident.category}

**Issue**: ${incident.title}

**Description**: ${incident.description}

**Affected Systems**: ${incident.affectedSystems.join(", ")}

**Current Telemetry**:
- Battery: ${incident.telemetry.battery}%
- CPU Temperature: ${incident.telemetry.cpuTemp}°C  
- Memory Usage: ${incident.telemetry.memoryUsage}%
- Network Latency: ${incident.telemetry.networkLatency}ms

**AI Analysis** (${incident.aiInsights.confidence}% confidence):
Root Cause: ${incident.aiInsights.rootCause}

**Business Impact**:
- Downtime: ${incident.downtime} minutes
- Orders Affected: ${incident.ordersAffected}
- Revenue Impact: $${incident.revenueImpact}

Please provide:
1. Immediate actions I should take
2. Diagnostic steps to confirm root cause
3. Long-term preventive measures
4. Estimated time to resolution`;
    
    // Trigger AI chat with pre-filled message
    if (typeof window !== "undefined") {
      localStorage.setItem("bear-ai-prefill", message);
      window.dispatchEvent(new CustomEvent("open-ai-chat", { detail: { message } }));
    }
    
    setSelectedIncident(null);
  };

  return (
    <div className="relative">
      {/* Header with filters */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Activity className="h-6 w-6 text-red-400" />
            Incident Radar
          </h2>
          <p className="text-sm text-white/60 mt-1">
            Real-time monitoring · {filteredIncidents.length} active incident{filteredIncidents.length !== 1 ? "s" : ""}
          </p>
        </div>
        
        <div className="flex gap-2">
          {["all", "critical", "high"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? "bg-indigo-500 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "all" && (
                <span className="ml-2 text-xs opacity-70">
                  ({incidents.filter(i => i.severity === f).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredIncidents.map((incident) => (
          <button
            key={incident.id}
            onClick={() => setSelectedIncident(incident)}
            className={`group relative rounded-2xl border bg-gradient-to-br p-5 text-left transition-all hover:scale-[1.02] hover:shadow-lg ${getSeverityColor(incident.severity)}`}
          >
            {/* Status badge */}
            <div className={`absolute top-3 right-3 rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusBadge(incident.status)}`}>
              {incident.status.replace("_", " ").toUpperCase()}
            </div>

            {/* Severity icon */}
            <div className="mb-3 flex items-center gap-3">
              {getSeverityIcon(incident.severity)}
              <div>
                <div className="text-xs text-white/60">{incident.errorCode}</div>
                <div className="text-sm font-semibold text-white/90">{incident.category.toUpperCase()}</div>
              </div>
            </div>

            {/* Title */}
            <h3 className="mb-2 text-base font-bold text-white line-clamp-1">
              {incident.title}
            </h3>

            {/* Robot info */}
            <div className="mb-3 flex items-center gap-2 text-xs text-white/60">
              <MapPin className="h-3 w-3" />
              <span>{incident.robotName} · {incident.facility}</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Clock className="h-3 w-3" />
              <span>{dayjs(incident.detectedAt).fromNow()}</span>
            </div>

            {/* Quick metrics */}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
              <div>
                <div className="text-xs text-white/50">Downtime</div>
                <div className="text-sm font-semibold text-white">{incident.downtime}m</div>
              </div>
              <div>
                <div className="text-xs text-white/50">Orders Lost</div>
                <div className="text-sm font-semibold text-white">{incident.ordersAffected}</div>
              </div>
            </div>

            {/* Hover indicator */}
            <div className="absolute bottom-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
              <ChevronRight className="h-5 w-5 text-white/60" />
            </div>
          </button>
        ))}
      </div>

      {/* Detailed Modal */}
      {selectedIncident && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedIncident(null)}
        >
          <div 
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/20 bg-gradient-to-br from-[#020511]/98 via-[#0a1628]/98 to-[#020511]/98 backdrop-blur-xl shadow-2xl m-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedIncident(null)}
              className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white/60 transition-colors hover:bg-white/20 hover:text-white z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className={`border-b border-white/10 p-6 bg-gradient-to-r ${getSeverityColor(selectedIncident.severity).replace("from-", "from-").replace("to-", "to-")}`}>
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white/10 p-3">
                  {getSeverityIcon(selectedIncident.severity)}
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusBadge(selectedIncident.status)}`}>
                      {selectedIncident.status.replace("_", " ").toUpperCase()}
                    </span>
                    <span className="text-xs text-white/60">{selectedIncident.errorCode}</span>
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-white">
                    {selectedIncident.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-white/70">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {selectedIncident.robotName} ({selectedIncident.robotId})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Activity className="h-4 w-4" />
                      {selectedIncident.facility}, {selectedIncident.city}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      Detected {dayjs(selectedIncident.detectedAt).fromNow()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsSSHOpen(!isSSHOpen)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-emerald-400 transition-all hover:bg-emerald-500/20 hover:scale-[1.02]"
                >
                  <Terminal className="h-5 w-5" />
                  <span className="font-medium">SSH to Robot</span>
                </button>
                <button
                  onClick={() => handleSendToAI(selectedIncident)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 px-4 py-3 text-indigo-400 transition-all hover:bg-indigo-500/20 hover:scale-[1.02]"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-medium">Investigate with AI</span>
                </button>
              </div>

              {/* SSH Terminal */}
              {isSSHOpen && (
                <div className="rounded-xl border border-emerald-500/30 bg-black/40 p-4 font-mono text-sm animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="mb-2 flex items-center gap-2 text-emerald-400">
                    <Terminal className="h-4 w-4" />
                    <span>SSH Session: root@{selectedIncident.robotId}</span>
                  </div>
                  <div className="text-emerald-300/80 space-y-1">
                    <div>$ ssh rfe@192.168.1.{faker.number.int({ min: 100, max: 254 })}</div>
                    <div className="text-white/40">Connecting...</div>
                    <div className="text-emerald-400">✓ Connected to {selectedIncident.robotName}</div>
                    <div className="mt-2 text-white/60">
                      <div>Robot Status: {selectedIncident.status}</div>
                      <div>Battery: {selectedIncident.telemetry.battery}%</div>
                      <div>CPU Temp: {selectedIncident.telemetry.cpuTemp}°C</div>
                      <div>Memory: {selectedIncident.telemetry.memoryUsage}%</div>
                      <div>Network Latency: {selectedIncident.telemetry.networkLatency}ms</div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-white/40">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Ready for commands...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-400" />
                  Incident Description
                </h3>
                <p className="text-white/70 leading-relaxed bg-white/5 rounded-xl p-4">
                  {selectedIncident.description}
                </p>
              </div>

              {/* AI Insights */}
              <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-sky-500/5 p-5">
                <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-indigo-400" />
                  AI Analysis
                  <span className="ml-auto text-sm font-normal text-indigo-400">
                    {selectedIncident.aiInsights.confidence}% confidence
                  </span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 text-sm font-medium text-white/80">Root Cause</div>
                    <p className="text-white/70 bg-black/20 rounded-lg p-3">
                      {selectedIncident.aiInsights.rootCause}
                    </p>
                  </div>

                  <div>
                    <div className="mb-2 text-sm font-medium text-white/80">Recommended Actions</div>
                    <div className="space-y-2">
                      {selectedIncident.aiInsights.recommendedActions.map((action, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-black/20 rounded-lg p-3">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-white/70">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                    <div>
                      <div className="text-xs text-white/50">Est. Resolution Time</div>
                      <div className="text-sm font-semibold text-white">{selectedIncident.aiInsights.estimatedResolutionTime}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/50">Similar Incidents</div>
                      <div className="text-sm font-semibold text-white">{selectedIncident.aiInsights.similarIncidents} found</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resolution Steps */}
              {selectedIncident.resolutionSteps.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Resolution Progress</h3>
                  <div className="space-y-3">
                    {selectedIncident.resolutionSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-xl bg-white/5 p-4">
                        <div className={`mt-0.5 rounded-full p-1 ${
                          step.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                          step.status === "failed" ? "bg-red-500/20 text-red-400" :
                          "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {step.status === "completed" ? <CheckCircle2 className="h-4 w-4" /> :
                           step.status === "failed" ? <XCircle className="h-4 w-4" /> :
                           <Loader2 className="h-4 w-4 animate-spin" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-white">{step.step}</div>
                          <div className="mt-1 text-xs text-white/50">
                            {step.performedBy} · {dayjs(step.timestamp).fromNow()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Telemetry */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-white">Current Telemetry</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(selectedIncident.telemetry).map(([key, value]) => {
                    if (key === "lastPosition") return null;
                    return (
                      <div key={key} className="rounded-xl bg-white/5 p-3">
                        <div className="text-xs text-white/50">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                        <div className="text-lg font-semibold text-white">
                          {typeof value === "number" ? value : typeof value === "string" ? value : JSON.stringify(value)}
                          {key === "battery" && "%"}
                          {key === "cpuTemp" && "°C"}
                          {key === "memoryUsage" && "%"}
                          {key === "networkLatency" && "ms"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
                <h3 className="mb-4 text-lg font-semibold text-white">Business Impact</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-white/50">Downtime</div>
                    <div className="text-2xl font-bold text-red-400">{selectedIncident.downtime}m</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50">Orders Affected</div>
                    <div className="text-2xl font-bold text-red-400">{selectedIncident.ordersAffected}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50">Revenue Impact</div>
                    <div className="text-2xl font-bold text-red-400">${selectedIncident.revenueImpact}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

