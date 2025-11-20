"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  Zap,
  Target,
  RefreshCw,
  Settings,
  Power,
  Activity,
  TrendingUp
} from "lucide-react";
import type { Robot } from "@/lib/robotData";

interface ActionModalProps {
  robot: Robot;
  action: "diagnostics" | "recalibrate" | "restart" | "parameters" | "clear-errors" | "emergency-stop" | null;
  onClose: () => void;
}

export function ActionModal({ robot, action, onClose }: ActionModalProps) {
  if (!action) return null;

  switch (action) {
    case "recalibrate":
      return <RecalibrateSensorsModal robot={robot} onClose={onClose} />;
    case "diagnostics":
      return <FullDiagnosticsModal robot={robot} onClose={onClose} />;
    case "restart":
      return <SoftRestartModal robot={robot} onClose={onClose} />;
    case "parameters":
      return <AdjustParametersModal robot={robot} onClose={onClose} />;
    case "clear-errors":
      return <ClearErrorsModal robot={robot} onClose={onClose} />;
    case "emergency-stop":
      return <EmergencyStopModal robot={robot} onClose={onClose} />;
    default:
      return null;
  }
}

// Recalibrate Sensors Modal
function RecalibrateSensorsModal({ robot, onClose }: { robot: Robot; onClose: () => void }) {
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Model-specific sensors
  const getSensors = () => {
    const isServi = robot.model.includes("Servi");
    const baseServiSensors = [
      { id: "lidar", name: "LIDAR (360°)", description: "Primary navigation sensor" },
      { id: "camera-front", name: "Front Camera Array", description: "6x cameras, object detection" },
      { id: "camera-rear", name: "Rear Camera", description: "Backup navigation" },
      { id: "ultrasonic", name: "Ultrasonic Sensors", description: "8x proximity sensors" },
      { id: "imu", name: "IMU (Gyro/Accel)", description: "Motion tracking" },
      { id: "wheel-encoders", name: "Wheel Encoders", description: "3x precision encoders" },
      { id: "tray-sensors", name: "Tray Weight Sensors", description: "Load detection (3 trays)" },
      { id: "tray-presence", name: "Tray Presence Detection", description: "Optical sensors" },
    ];

    const cartiSensors = [
      { id: "lidar", name: "LIDAR (360°)", description: "Primary navigation sensor" },
      { id: "camera-front", name: "Front Camera Array", description: "4x cameras, object detection" },
      { id: "camera-rear", name: "Rear Camera", description: "Backup navigation" },
      { id: "ultrasonic", name: "Ultrasonic Sensors", description: "12x proximity sensors" },
      { id: "imu", name: "IMU (Gyro/Accel)", description: "Motion tracking" },
      { id: "wheel-encoders", name: "Wheel Encoders", description: "4x precision encoders" },
      { id: "cargo-sensors", name: "Cargo Bay Sensors", description: "Weight and presence detection" },
      { id: "door-sensors", name: "Door Position Sensors", description: "Cargo door status" },
    ];

    return isServi ? baseServiSensors : cartiSensors;
  };

  const sensors = getSensors();

  const toggleSensor = (id: string) => {
    setSelectedSensors(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedSensors(sensors.map(s => s.id));
  };

  const handleCalibrate = async () => {
    if (selectedSensors.length === 0) return;
    
    setIsCalibrating(true);
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate calibration
    setIsCalibrating(false);
    setCompleted(true);
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#020511]/98 via-[#0a1628]/98 to-[#020511]/98 backdrop-blur-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-sky-500/20 p-2">
              <Target className="h-6 w-6 text-sky-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Recalibrate Sensors</h3>
              <p className="text-sm text-white/60">{robot.name} • {robot.model}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-white/60 hover:bg-white/20 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isCalibrating && !completed && (
          <>
            {/* Instructions */}
            <div className="mb-4 rounded-lg bg-sky-500/10 border border-sky-500/30 p-3">
              <p className="text-sm text-sky-300">
                Select sensors to recalibrate. This process takes ~30 seconds per sensor and requires the robot to be stationary.
              </p>
            </div>

            {/* Sensor List */}
            <div className="mb-6 space-y-2 max-h-[400px] overflow-y-auto">
              {sensors.map(sensor => (
                <button
                  key={sensor.id}
                  onClick={() => toggleSensor(sensor.id)}
                  className={`w-full flex items-start gap-3 rounded-xl p-4 text-left transition-all ${
                    selectedSensors.includes(sensor.id)
                      ? "bg-sky-500/20 border-2 border-sky-500/50"
                      : "bg-white/5 border-2 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center ${
                    selectedSensors.includes(sensor.id)
                      ? "bg-sky-500 border-sky-500"
                      : "border-white/30"
                  }`}>
                    {selectedSensors.includes(sensor.id) && <CheckCircle2 className="h-4 w-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{sensor.name}</div>
                    <div className="text-xs text-white/60 mt-0.5">{sensor.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={selectAll}
                className="px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 text-sm"
              >
                Select All
              </button>
              <button
                onClick={handleCalibrate}
                disabled={selectedSensors.length === 0}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-sky-500/50 transition-all"
              >
                Calibrate {selectedSensors.length > 0 && `(${selectedSensors.length})`}
              </button>
            </div>
          </>
        )}

        {isCalibrating && (
          <div className="py-12 text-center">
            <Loader2 className="h-16 w-16 text-sky-400 animate-spin mx-auto mb-4" />
            <div className="text-lg font-semibold text-white mb-2">Calibrating Sensors...</div>
            <div className="text-sm text-white/60">
              Calibrating {selectedSensors.length} sensor{selectedSensors.length > 1 ? 's' : ''}
            </div>
            <div className="text-xs text-white/40 mt-2">Please keep robot stationary</div>
          </div>
        )}

        {completed && (
          <div className="py-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <div className="text-xl font-bold text-emerald-400 mb-2">Calibration Successful!</div>
            <div className="text-sm text-white/70">
              All selected sensors have been recalibrated and are now operational.
            </div>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}

// Full Diagnostics Modal
function FullDiagnosticsModal({ robot, onClose }: { robot: Robot; onClose: () => void }) {
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!isRunning && !completed) {
      setIsRunning(true);
      runDiagnostics();
    }
  }, []);

  const runDiagnostics = async () => {
    const tests = [
      { name: "LIDAR Sensor Check", duration: 500 },
      { name: "Camera Array Test", duration: 600 },
      { name: "Motor Controller Health", duration: 700 },
      { name: "Battery Cells Analysis", duration: 800 },
      { name: "Network Connectivity", duration: 400 },
      { name: "Navigation System", duration: 600 },
      { name: "Wheel Encoder Sync", duration: 500 },
      { name: "Emergency Stop Test", duration: 400 },
    ];

    const newResults = [];
    for (const test of tests) {
      await new Promise(resolve => setTimeout(resolve, test.duration));
      const hasError = robot.errors.some(e => 
        test.name.toLowerCase().includes(e.category) || 
        test.name.toLowerCase().includes("battery") && e.category === "battery"
      );
      newResults.push({
        name: test.name,
        status: hasError ? "warning" : "passed",
        value: hasError ? "Issues detected" : "OK"
      });
      setResults([...newResults]);
    }
    
    setIsRunning(false);
    setCompleted(true);
  };

  const passed = results.filter(r => r.status === "passed").length;
  const total = results.length;

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#020511]/98 via-[#0a1628]/98 to-[#020511]/98 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/20 p-2">
              <Activity className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Full System Diagnostics</h3>
              <p className="text-sm text-white/60">{robot.name}</p>
            </div>
          </div>
          {completed && (
            <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-white/60 hover:bg-white/20 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Progress */}
        {isRunning && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-white/60 mb-2">
              <span>Running diagnostic tests...</span>
              <span>{results.length} / 8</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-300"
                style={{ width: `${(results.length / 8) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto mb-4">
          {results.map((result, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
              <div className="flex items-center gap-3">
                {result.status === "passed" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                )}
                <span className="text-white">{result.name}</span>
              </div>
              <span className={`text-sm font-mono ${
                result.status === "passed" ? "text-emerald-400" : "text-amber-400"
              }`}>
                {result.value}
              </span>
            </div>
          ))}
        </div>

        {completed && (
          <div className="rounded-xl bg-gradient-to-r from-emerald-500/20 to-sky-500/20 border border-emerald-500/30 p-4">
            <div className="text-lg font-bold text-white mb-1">
              Diagnostics Complete: {passed}/{total} Tests Passed
            </div>
            <div className="text-sm text-white/70">
              {passed === total 
                ? "All systems operational. Robot is ready for service." 
                : `${total - passed} issue(s) detected. Review error logs for details.`}
            </div>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}

// Soft Restart Modal
function SoftRestartModal({ robot, onClose }: { robot: Robot; onClose: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (restarting && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (restarting && countdown === 0) {
      setTimeout(() => {
        setRestarting(false);
        setCompleted(true);
        setTimeout(onClose, 2000);
      }, 1000);
    }
  }, [restarting, countdown]);

  const handleRestart = () => {
    setConfirmed(true);
    setRestarting(true);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#020511]/98 via-[#0a1628]/98 to-[#020511]/98 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/20 p-2">
              <RefreshCw className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Soft Restart</h3>
              <p className="text-sm text-white/60">{robot.name}</p>
            </div>
          </div>
          {!restarting && (
            <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-white/60 hover:bg-white/20 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {!confirmed && !completed && (
          <>
            <div className="mb-6 rounded-lg bg-amber-500/10 border border-amber-500/30 p-4">
              <p className="text-sm text-amber-200 mb-2">
                <strong>This will restart the following services:</strong>
              </p>
              <ul className="text-sm text-white/70 space-y-1 ml-4 list-disc">
                <li>Navigation system</li>
                <li>Motor controllers</li>
                <li>Sensor processing</li>
                <li>Communication modules</li>
              </ul>
              <p className="text-sm text-amber-200 mt-3">
                Robot will be unavailable for ~45 seconds. Current task will be paused.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleRestart}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50"
              >
                Confirm Restart
              </button>
            </div>
          </>
        )}

        {restarting && !completed && (
          <div className="py-12 text-center">
            <RefreshCw className="h-16 w-16 text-indigo-400 animate-spin mx-auto mb-4" />
            <div className="text-4xl font-bold text-white mb-2">{countdown}</div>
            <div className="text-lg text-white/70 mb-1">Restarting Services...</div>
            <div className="text-sm text-white/50">Robot will be back online shortly</div>
          </div>
        )}

        {completed && (
          <div className="py-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <div className="text-xl font-bold text-emerald-400 mb-2">Restart Complete!</div>
            <div className="text-sm text-white/70">All services are back online and operational.</div>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}

// Adjust Parameters Modal
function AdjustParametersModal({ robot, onClose }: { robot: Robot; onClose: () => void }) {
  const [speed, setSpeed] = useState(1.0);
  const [sensitivity, setSensitivity] = useState(0.8);
  const [aggression, setAggression] = useState(0.5);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    setSaved(true);
    setTimeout(onClose, 1500);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-violet-500/30 bg-gradient-to-br from-[#020511]/98 via-[#0a1628]/98 to-[#020511]/98 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/20 p-2">
              <Settings className="h-6 w-6 text-violet-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Adjust Parameters</h3>
              <p className="text-sm text-white/60">{robot.name}</p>
            </div>
          </div>
          {!saving && !saved && (
            <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-white/60 hover:bg-white/20 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {!saving && !saved && (
          <>
            {/* Speed Parameter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white">Max Speed</label>
                <span className="text-sm font-mono text-violet-400">{speed.toFixed(1)} m/s</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>0.5 m/s</span>
                <span>Conservative</span>
                <span>Aggressive</span>
                <span>1.5 m/s</span>
              </div>
            </div>

            {/* Sensitivity Parameter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white">Obstacle Sensitivity</label>
                <span className="text-sm font-mono text-sky-400">{(sensitivity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="1.0"
                step="0.1"
                value={sensitivity}
                onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            {/* Aggression Parameter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white">Path Planning Aggression</label>
                <span className="text-sm font-mono text-emerald-400">{(aggression * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.9"
                step="0.1"
                value={aggression}
                onChange={(e) => setAggression(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>Cautious</span>
                <span>Balanced</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div className="rounded-lg bg-violet-500/10 border border-violet-500/30 p-3 mb-6">
              <p className="text-xs text-violet-200">
                Changes take effect immediately. Robot will adapt its behavior based on new parameters.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/50"
              >
                Apply Changes
              </button>
            </div>
          </>
        )}

        {saving && (
          <div className="py-12 text-center">
            <Loader2 className="h-16 w-16 text-violet-400 animate-spin mx-auto mb-4" />
            <div className="text-lg font-semibold text-white mb-2">Applying Parameters...</div>
            <div className="text-sm text-white/60">Updating robot configuration</div>
          </div>
        )}

        {saved && (
          <div className="py-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <div className="text-xl font-bold text-emerald-400 mb-2">Parameters Updated!</div>
            <div className="text-sm text-white/70">New settings are now active.</div>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}

// Clear Errors Modal
function ClearErrorsModal({ robot, onClose }: { robot: Robot; onClose: () => void }) {
  const [selectedErrors, setSelectedErrors] = useState<number[]>([]);
  const [clearing, setClearing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const toggleError = (idx: number) => {
    setSelectedErrors(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleClear = async () => {
    if (selectedErrors.length === 0) return;
    setClearing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setClearing(false);
    setCompleted(true);
    setTimeout(onClose, 1500);
  };

  if (robot.errors.length === 0) {
    return (
      <ModalOverlay onClose={onClose}>
        <div className="w-full max-w-lg rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#020511]/98 via-[#0a1628]/98 to-[#020511]/98 backdrop-blur-xl p-6">
          <div className="py-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <div className="text-xl font-bold text-emerald-400 mb-2">No Active Errors!</div>
            <div className="text-sm text-white/70 mb-6">Robot is operating normally with no error flags.</div>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
            >
              Close
            </button>
          </div>
        </div>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#020511]/98 via-[#0a1628]/98 to-[#020511]/98 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/20 p-2">
              <Zap className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Clear Error Flags</h3>
              <p className="text-sm text-white/60">{robot.name} • {robot.errors.length} active error(s)</p>
            </div>
          </div>
          {!clearing && !completed && (
            <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-white/60 hover:bg-white/20 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {!clearing && !completed && (
          <>
            <div className="mb-4 rounded-lg bg-amber-500/10 border border-amber-500/30 p-3">
              <p className="text-sm text-amber-200">
                ⚠️ Only clear errors after addressing root cause. Clearing flags does not fix underlying issues.
              </p>
            </div>

            <div className="mb-6 space-y-2 max-h-[400px] overflow-y-auto">
              {robot.errors.map((error, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleError(idx)}
                  className={`w-full flex items-start gap-3 rounded-xl p-4 text-left transition-all ${
                    selectedErrors.includes(idx)
                      ? "bg-amber-500/20 border-2 border-amber-500/50"
                      : "bg-white/5 border-2 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center ${
                    selectedErrors.includes(idx)
                      ? "bg-amber-500 border-amber-500"
                      : "border-white/30"
                  }`}>
                    {selectedErrors.includes(idx) && <CheckCircle2 className="h-4 w-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-amber-300">{error.errorCode}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 uppercase">{error.severity}</span>
                    </div>
                    <div className="text-sm text-white/80">{error.message}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedErrors(robot.errors.map((_, idx) => idx))}
                className="px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 text-sm"
              >
                Select All
              </button>
              <button
                onClick={handleClear}
                disabled={selectedErrors.length === 0}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/50"
              >
                Clear Selected ({selectedErrors.length})
              </button>
            </div>
          </>
        )}

        {clearing && (
          <div className="py-12 text-center">
            <Loader2 className="h-16 w-16 text-amber-400 animate-spin mx-auto mb-4" />
            <div className="text-lg font-semibold text-white mb-2">Clearing Error Flags...</div>
            <div className="text-sm text-white/60">Resetting {selectedErrors.length} error state(s)</div>
          </div>
        )}

        {completed && (
          <div className="py-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <div className="text-xl font-bold text-emerald-400 mb-2">Errors Cleared!</div>
            <div className="text-sm text-white/70">{selectedErrors.length} error flag(s) have been reset.</div>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}

// Emergency Stop Modal
function EmergencyStopModal({ robot, onClose }: { robot: Robot; onClose: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const [stopped, setStopped] = useState(false);

  const handleStop = async () => {
    setConfirmed(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setStopped(true);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-lg rounded-2xl border-2 border-red-500/50 bg-gradient-to-br from-red-950/80 via-[#0a1628]/98 to-[#020511]/98 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-500/30 p-2 animate-pulse">
              <Power className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-400">Emergency Stop</h3>
              <p className="text-sm text-white/60">{robot.name}</p>
            </div>
          </div>
          {!confirmed && (
            <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-white/60 hover:bg-white/20 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {!stopped && (
          <>
            <div className="mb-6 rounded-lg bg-red-500/20 border-2 border-red-500/50 p-4">
              <p className="text-red-200 font-semibold mb-2">⚠️ IMMEDIATE HALT</p>
              <p className="text-sm text-white/80 mb-2">
                This will immediately stop all robot motion and disable motors.
              </p>
              <p className="text-sm text-white/70">
                Use only in emergency situations. Robot will require manual restart.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleStop}
                className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-red-500/50 border-2 border-red-400"
              >
                EMERGENCY STOP
              </button>
            </div>
          </>
        )}

        {stopped && (
          <div className="py-12 text-center">
            <Power className="h-20 w-20 text-red-400 mx-auto mb-4" />
            <div className="text-2xl font-bold text-red-400 mb-2">ROBOT STOPPED</div>
            <div className="text-sm text-white/70 mb-6">
              All motors disabled. Robot is in safe state and requires manual restart.
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 font-semibold"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}

// Modal Overlay Component
function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

