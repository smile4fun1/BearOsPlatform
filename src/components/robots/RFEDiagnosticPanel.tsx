"use client";

import { useState } from "react";
import { 
  X, 
  Wrench, 
  Brain, 
  Zap, 
  RefreshCw, 
  Settings, 
  Power, 
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Activity,
  Battery,
  Gauge,
  MapPin,
  Clock,
  BarChart3,
  Loader2,
  Terminal,
  Sparkles,
  Target
} from "lucide-react";
import type { Robot } from "@/lib/robotData";
import { ActionModal } from "./ActionModals";

interface RFEDiagnosticPanelProps {
  robot: Robot;
  onClose: () => void;
}

export function RFEDiagnosticPanel({ robot, onClose }: RFEDiagnosticPanelProps) {
  const [activeTab, setActiveTab] = useState<"tools" | "ai-diagnosis">("tools");
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [aiDiagnostic, setAiDiagnostic] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<"diagnostics" | "recalibrate" | "restart" | "parameters" | "clear-errors" | "emergency-stop" | null>(null);

  // Calculate anomalies and patterns
  const batteryHealth = robot.battery > 80 ? "excellent" : robot.battery > 60 ? "good" : robot.battery > 40 ? "fair" : "critical";
  const uptimeHealth = robot.metrics.successRate > 95 ? "excellent" : robot.metrics.successRate > 85 ? "good" : "needs attention";
  
  // Detect anomalies
  const anomalies = [];
  if (robot.battery < 40) anomalies.push({ type: "battery", severity: "high", message: "Battery below 40% - schedule charging soon" });
  if (robot.metrics.successRate < 90) anomalies.push({ type: "performance", severity: "medium", message: "Success rate below target - review recent incidents" });
  if (robot.errors.length > 0) anomalies.push({ type: "error", severity: "high", message: `${robot.errors.length} active error(s) detected` });
  if (robot.status === "offline") anomalies.push({ type: "connectivity", severity: "critical", message: "Robot offline - check network connection" });
  
  // Usage statistics
  const avgTripsPerDay = Math.round(robot.totalTrips / 30); // Approximate
  const efficiencyScore = Math.round((robot.metrics.successRate * 0.7) + (Math.min(robot.battery, 100) * 0.3));

  const handleRunAIDiagnostic = async () => {
    setIsRunningDiagnostic(true);
    setAiDiagnostic(null);
    
    // Simulate AI analysis (in production, this would call the actual AI)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate comprehensive AI diagnostic
    const diagnostic = generateAIDiagnostic(robot, anomalies, batteryHealth, uptimeHealth, efficiencyScore);
    setAiDiagnostic(diagnostic);
    setIsRunningDiagnostic(false);
  };

  const handleQuickAction = (action: "diagnostics" | "recalibrate" | "restart" | "parameters" | "clear-errors" | "emergency-stop") => {
    setCurrentAction(action);
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 bg-gradient-to-br from-[#020511]/98 via-[#0a1628]/98 to-[#020511]/98 backdrop-blur-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 to-sky-500/10 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500/30 to-sky-500/30 p-3">
              <Wrench className="h-8 w-8 text-indigo-300" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">RFE Diagnostic Panel</h2>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span className="font-mono">{robot.name}</span>
                <span>•</span>
                <span>{robot.model}</span>
                <span>•</span>
                <span>{robot.facility}</span>
                <span>•</span>
                <span className={`font-semibold ${
                  robot.status === "active" ? "text-emerald-400" :
                  robot.status === "error" ? "text-red-400" :
                  robot.status === "charging" ? "text-yellow-400" :
                  "text-white/60"
                }`}>
                  {robot.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10 bg-white/5 px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("tools")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === "tools"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              <Wrench className="h-4 w-4" />
              <span className="font-medium">Quick Actions & Tools</span>
            </button>
            <button
              onClick={() => setActiveTab("ai-diagnosis")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === "ai-diagnosis"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              <Brain className="h-4 w-4" />
              <span className="font-medium">AI-Powered Diagnosis</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === "tools" && (
            <>
              {/* Quick Stats Overview */}
              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Battery className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs text-white/60">Battery</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{robot.battery}%</div>
                  <div className="text-xs text-white/50 mt-1 capitalize">{batteryHealth}</div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs text-white/60">Success Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{robot.metrics.successRate}%</div>
                  <div className="text-xs text-white/50 mt-1 capitalize">{uptimeHealth}</div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-sky-500/10 to-sky-500/5 border border-sky-500/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-sky-400" />
                    <span className="text-xs text-white/60">Total Trips</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{robot.totalTrips}</div>
                  <div className="text-xs text-white/50 mt-1">~{avgTripsPerDay}/day</div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="h-4 w-4 text-violet-400" />
                    <span className="text-xs text-white/60">Efficiency</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{efficiencyScore}</div>
                  <div className="text-xs text-white/50 mt-1">Overall Score</div>
                </div>
              </div>

              {/* Anomalies & Alerts */}
              {anomalies.length > 0 && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    Detected Anomalies ({anomalies.length})
                  </h3>
                  <div className="space-y-3">
                    {anomalies.map((anomaly, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-lg bg-black/20 p-3">
                        <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                          anomaly.severity === "critical" ? "bg-red-500" :
                          anomaly.severity === "high" ? "bg-orange-500" :
                          "bg-yellow-500"
                        }`} />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white capitalize">{anomaly.type} Issue</div>
                          <div className="text-xs text-white/70 mt-0.5">{anomaly.message}</div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          anomaly.severity === "critical" ? "bg-red-500/20 text-red-300" :
                          anomaly.severity === "high" ? "bg-orange-500/20 text-orange-300" :
                          "bg-yellow-500/20 text-yellow-300"
                        }`}>
                          {anomaly.severity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleQuickAction("diagnostics")}
                    className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 p-4 text-left transition-all hover:scale-[1.02] hover:from-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/20"
                  >
                    <Activity className="h-5 w-5 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-white">Run Full Diagnostics</div>
                      <div className="text-xs text-white/60">System health check</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickAction("recalibrate")}
                    className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-sky-500/10 to-sky-500/5 border border-sky-500/30 p-4 text-left transition-all hover:scale-[1.02] hover:from-sky-500/20 hover:shadow-lg hover:shadow-sky-500/20"
                  >
                    <Target className="h-5 w-5 text-sky-400" />
                    <div>
                      <div className="font-semibold text-white">Recalibrate Sensors</div>
                      <div className="text-xs text-white/60">LIDAR, IMU, encoders</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickAction("restart")}
                    className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/30 p-4 text-left transition-all hover:scale-[1.02] hover:from-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/20"
                  >
                    <RefreshCw className="h-5 w-5 text-indigo-400" />
                    <div>
                      <div className="font-semibold text-white">Soft Restart</div>
                      <div className="text-xs text-white/60">Reboot services</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickAction("parameters")}
                    className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/30 p-4 text-left transition-all hover:scale-[1.02] hover:from-violet-500/20 hover:shadow-lg hover:shadow-violet-500/20"
                  >
                    <Settings className="h-5 w-5 text-violet-400" />
                    <div>
                      <div className="font-semibold text-white">Adjust Parameters</div>
                      <div className="text-xs text-white/60">Speed, sensitivity</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickAction("clear-errors")}
                    className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 p-4 text-left transition-all hover:scale-[1.02] hover:from-amber-500/20 hover:shadow-lg hover:shadow-amber-500/20"
                  >
                    <Zap className="h-5 w-5 text-amber-400" />
                    <div>
                      <div className="font-semibold text-white">Clear Error Flags</div>
                      <div className="text-xs text-white/60">Reset error states</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickAction("emergency-stop")}
                    className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30 p-4 text-left transition-all hover:scale-[1.02] hover:from-red-500/20 hover:shadow-lg hover:shadow-red-500/20"
                  >
                    <Power className="h-5 w-5 text-red-400" />
                    <div>
                      <div className="font-semibold text-white">Emergency Stop</div>
                      <div className="text-xs text-white/60">Immediate halt</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Usage Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-white/60 mb-1">Trips Completed</div>
                    <div className="text-xl font-bold text-white">{robot.metrics.tripsCompleted}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1">Orders Served</div>
                    <div className="text-xl font-bold text-white">{robot.metrics.ordersServed}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1">Distance Traveled</div>
                    <div className="text-xl font-bold text-white">{robot.metrics.totalDistanceKm} km</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1">Avg Trip Time</div>
                    <div className="text-xl font-bold text-white">{robot.metrics.avgTripTime}s</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1">Distance Today</div>
                    <div className="text-xl font-bold text-white">{robot.metrics.distanceTraveled} km</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1">Orders Today</div>
                    <div className="text-xl font-bold text-white">{robot.metrics.ordersToday}</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "ai-diagnosis" && (
            <>
              {/* AI Diagnostic Button */}
              {!aiDiagnostic && !isRunningDiagnostic && (
                <button
                  onClick={handleRunAIDiagnostic}
                  className="w-full flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 p-6 text-white transition-all hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-[1.02]"
                >
                  <Sparkles className="h-6 w-6" />
                  <span className="text-lg font-semibold">Run AI-Powered Comprehensive Diagnosis</span>
                </button>
              )}

              {/* Running State */}
              {isRunningDiagnostic && (
                <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-sky-500/5 p-8 text-center">
                  <Loader2 className="h-12 w-12 text-indigo-400 animate-spin mx-auto mb-4" />
                  <div className="text-lg font-semibold text-white mb-2">Analyzing Robot Data...</div>
                  <div className="text-sm text-white/60">
                    Analyzing telemetry, performance patterns, error logs, and historical data
                  </div>
                </div>
              )}

              {/* AI Diagnostic Results */}
              {aiDiagnostic && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-gradient-to-br from-indigo-500/30 to-sky-500/30 p-3">
                        <Brain className="h-6 w-6 text-indigo-300" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">AI Diagnostic Report</h3>
                        <p className="text-sm text-white/60">Generated {new Date().toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRunAIDiagnostic}
                      className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Re-analyze
                    </button>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-white/80 leading-relaxed">
                        {aiDiagnostic}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Action Modals */}
      <ActionModal
        robot={robot}
        action={currentAction}
        onClose={() => setCurrentAction(null)}
      />
    </div>
  );
}

function generateAIDiagnostic(
  robot: Robot, 
  anomalies: any[], 
  batteryHealth: string, 
  uptimeHealth: string, 
  efficiencyScore: number
): string {
  const hasErrors = robot.errors.length > 0;
  const errorDetails = hasErrors 
    ? `\n\n**Active Errors Detected:**\n${robot.errors.map(e => `• ${e.errorCode}: ${e.message} (${e.severity.toUpperCase()})`).join('\n')}`
    : '';

  return `**COMPREHENSIVE ROBOT ANALYSIS**
Robot: ${robot.name}
Model: ${robot.model} (${robot.vertical})
Location: ${robot.facility}, ${robot.city}
Status: ${robot.status.toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**OVERALL HEALTH ASSESSMENT**

Efficiency Score: ${efficiencyScore}/100 ${efficiencyScore > 85 ? '✅ Excellent' : efficiencyScore > 70 ? '⚠️ Good' : '🔴 Needs Attention'}

Battery Health: ${batteryHealth.toUpperCase()} (${robot.battery}%)
${robot.battery < 40 ? '⚠️ Battery below optimal levels - schedule charging priority' : robot.battery > 80 ? '✅ Battery levels optimal' : '✓ Battery adequate for operations'}

Performance: ${uptimeHealth.toUpperCase()} (${robot.metrics.successRate}% success rate)
${robot.metrics.successRate < 90 ? '⚠️ Success rate below target - investigate recent failures' : '✅ Performance within expected parameters'}
${errorDetails}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**OPERATIONAL METRICS ANALYSIS**

Trip Performance:
• Total trips completed: ${robot.metrics.tripsCompleted}
• Average trip time: ${robot.metrics.avgTripTime}s ${robot.metrics.avgTripTime > 120 ? '(slower than average - check navigation efficiency)' : '(within normal range)'}
• Total distance: ${robot.metrics.totalDistanceKm} km
• Orders served: ${robot.metrics.ordersServed}

Today's Activity:
• Distance traveled: ${robot.metrics.distanceTraveled} km
• Orders completed: ${robot.metrics.ordersToday}
• Current battery consumption: ${robot.battery < 70 ? 'Higher than expected for time of day' : 'Normal for operational hours'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**ANOMALY DETECTION**

${anomalies.length > 0 ? anomalies.map(a => `⚠️ ${a.type.toUpperCase()}: ${a.message} (Severity: ${a.severity})`).join('\n') : '✅ No significant anomalies detected in current operational parameters'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**PREDICTIVE INSIGHTS**

Battery Projection:
${robot.battery < 30 ? '🔴 URGENT: Battery requires immediate attention. Estimated runtime: <2 hours' :
  robot.battery < 50 ? '⚠️ Battery should be charged within next 2-3 hours to avoid service interruption' :
  robot.battery < 70 ? '✓ Battery adequate for current shift. Plan charging for next break' :
  '✅ Battery levels excellent. Estimated runtime: 6-8 hours'}

Maintenance Recommendations:
${robot.totalTrips > 10000 ? '• High mileage detected - schedule comprehensive maintenance inspection' : ''}
${robot.metrics.successRate < 90 ? '• Performance degradation observed - review sensor calibration and navigation logs' : ''}
${robot.battery < 50 ? '• Battery showing signs of wear - monitor charging cycles and consider cell health check' : ''}
${hasErrors ? '• Active errors require immediate field engineer attention' : ''}
${!hasErrors && robot.metrics.successRate > 95 && robot.battery > 70 ? '• Robot performing optimally - continue standard operating procedures' : ''}

Optimization Opportunities:
• ${robot.metrics.avgTripTime > 100 ? 'Path planning optimization could reduce average trip time by 10-15%' : 'Trip time efficiency is optimal'}
• ${robot.metrics.successRate < 95 ? 'Success rate could be improved through navigation recalibration' : 'Success rate is at target levels'}
• ${robot.totalTrips > 5000 ? 'Consider predictive maintenance based on usage patterns' : 'Standard maintenance schedule appropriate'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**RECOMMENDED ACTIONS**

Immediate (0-4 hours):
${robot.battery < 30 ? '1. Send robot to charging station immediately\n' : ''}${hasErrors ? `2. Address active errors: ${robot.errors[0]?.errorCode}\n` : ''}${robot.status === "offline" ? '3. Investigate connectivity issues and restore network connection\n' : ''}${!hasErrors && robot.battery > 50 && robot.status !== "offline" ? '• No immediate actions required - robot operating normally\n' : ''}

Short-term (24-48 hours):
${robot.metrics.successRate < 90 ? '• Review and analyze failed trip logs\n' : ''}${robot.totalTrips % 1000 < 50 ? '• Schedule routine maintenance inspection\n' : ''}• Monitor battery performance during charging cycles
• Verify sensor calibration status

Long-term (1-2 weeks):
• Analyze usage patterns for optimization opportunities
• Review maintenance schedule based on actual usage
• Consider firmware updates if available
${robot.totalTrips > 10000 ? '• Plan comprehensive service due to high mileage\n' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**CONFIDENCE LEVEL**: ${hasErrors || robot.battery < 30 ? '85%' : '95%'} (Based on current telemetry and historical data)

This analysis is generated from real-time robot data and historical performance patterns. For critical issues, always validate with manual inspection and consult field engineering team.`;
}

