/**
 * Realistic Robot Incident Data Generator
 * Based on real-world robot operations scenarios for Servi, Servi Plus, Carti 100, Carti 600
 */

import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { robotFleet, type RobotError } from "./robotData";

faker.seed(42);

export type IncidentSeverity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "open" | "investigating" | "in_progress" | "resolved" | "escalated";
export type IncidentCategory = 
  | "navigation" 
  | "battery" 
  | "sensor" 
  | "mechanical" 
  | "network" 
  | "software" 
  | "collision"
  | "performance";

export interface RobotIncident {
  id: string;
  robotId: string;
  robotName: string;
  facility: string;
  city: string;
  region: string;
  
  // Incident details
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  
  // Timestamps
  detectedAt: string;
  lastUpdated: string;
  resolvedAt?: string;
  
  // Technical details
  errorCode?: string;
  affectedSystems: string[];
  telemetry: {
    battery: number;
    cpuTemp: number;
    memoryUsage: number;
    networkLatency: number;
    lastPosition: { x: number; y: number };
  };
  
  // AI insights
  aiInsights: {
    rootCause: string;
    recommendedActions: string[];
    estimatedResolutionTime: string;
    similarIncidents: number;
    confidence: number; // 0-100
  };
  
  // Resolution tracking
  assignedTo?: string;
  resolutionSteps: Array<{
    step: string;
    timestamp: string;
    performedBy: string;
    status: "pending" | "completed" | "failed";
  }>;
  
  // Impact
  downtime: number; // minutes
  ordersAffected: number;
  revenueImpact: number; // USD
}

// Realistic incident templates based on real robot operations
const incidentTemplates = {
  navigation: [
    {
      title: "Path Planning Deviation",
      description: "Robot repeatedly deviating from optimal path, causing 15-20% longer delivery times. LIDAR showing inconsistent readings in high-traffic areas.",
      errorCode: "NAV-2104",
      affectedSystems: ["Path Planning", "LIDAR", "Localization"],
      rootCause: "Reflective surfaces in new dining area causing LIDAR scatter. SLAM map needs recalibration for updated floor plan.",
      actions: ["Recalibrate SLAM map with new environment", "Update no-go zones for reflective areas", "Adjust LIDAR sensitivity parameters"],
      resolutionTime: "45-60 minutes",
    },
    {
      title: "Localization Drift",
      description: "Robot experiencing gradual position drift, resulting in failed docking attempts. Position confidence dropping below 85% threshold.",
      errorCode: "NAV-3201",
      affectedSystems: ["Localization", "Wheel Encoders", "IMU"],
      rootCause: "Wheel encoder calibration drift detected. Floor surface change (new carpet) affecting odometry readings.",
      actions: ["Re-run wheel encoder calibration", "Update surface friction parameters", "Verify IMU sensor calibration"],
      resolutionTime: "30-45 minutes",
    },
    {
      title: "Dynamic Obstacle Avoidance Failure",
      description: "Robot failing to detect and avoid fast-moving objects (service staff). Near-miss incidents logged 3x in past hour.",
      errorCode: "NAV-4502",
      affectedSystems: ["3D Camera", "Obstacle Detection", "Emergency Stop"],
      rootCause: "3D camera firmware outdated, causing 200ms latency in object detection. Emergency stop threshold too permissive.",
      actions: ["Update 3D camera firmware to v2.4.1", "Reduce emergency stop threshold to 0.3m", "Increase obstacle detection frequency"],
      resolutionTime: "15-30 minutes",
    },
  ],
  battery: [
    {
      title: "Rapid Battery Degradation",
      description: "Battery capacity dropped 8% in 2 days. Charging cycles completing 25% faster than normal, indicating cell degradation.",
      errorCode: "BAT-1203",
      affectedSystems: ["Battery Management", "Charging System", "Power Distribution"],
      rootCause: "Battery pack showing signs of thermal stress. Cell #4 and #7 voltage imbalance detected (>0.2V difference). Likely due to sustained high-current draws during peak hours.",
      actions: ["Schedule battery pack replacement", "Implement charging curve optimization", "Enable cell balancing protocol", "Reduce max current draw to 80%"],
      resolutionTime: "24-48 hours (parts ordering)",
    },
    {
      title: "Charging Station Communication Error",
      description: "Robot unable to establish charging handshake. Docking successful but charging not initiating. Red LED flashing 3-2 pattern.",
      errorCode: "BAT-2401",
      affectedSystems: ["Charging Port", "CAN Bus", "Docking Sensors"],
      rootCause: "Charging port connector oxidation detected. Communication pins showing 15% resistance increase. Likely humidity exposure.",
      actions: ["Clean charging port contacts with isopropyl alcohol", "Apply contact protectant", "Inspect charging station pins", "Update charging firmware"],
      resolutionTime: "20-30 minutes",
    },
  ],
  sensor: [
    {
      title: "LIDAR Degraded Performance",
      description: "LIDAR effective range reduced to 4.2m (normal: 8m). Point cloud density down 40%. Dust accumulation suspected.",
      errorCode: "SEN-3104",
      affectedSystems: ["LIDAR", "Navigation", "Safety System"],
      rootCause: "LIDAR lens contamination from kitchen grease aerosols. Protective cover showing 60% opacity. Scanner motor RPM stable.",
      actions: ["Clean LIDAR lens and protective cover", "Schedule weekly cleaning routine", "Install aerosol shield", "Verify scanner RPM (5Hz nominal)"],
      resolutionTime: "15-20 minutes",
    },
    {
      title: "Ultrasonic Sensor Array Fault",
      description: "3 of 8 ultrasonic sensors reporting timeout errors. Low-level obstacle detection compromised. Close-range avoidance degraded.",
      errorCode: "SEN-4207",
      affectedSystems: ["Ultrasonic Array", "Obstacle Detection", "Low-Level Safety"],
      rootCause: "Water damage to front sensor array. Sensors #2, #4, #5 showing erratic readings. Possible liquid spill incident on charging area.",
      actions: ["Replace affected sensor units", "Test sensor array calibration", "Inspect for additional water damage", "Add water detection in charging area"],
      resolutionTime: "60-90 minutes (parts replacement)",
    },
  ],
  mechanical: [
    {
      title: "Drive Motor Unusual Vibration",
      description: "Left drive motor exhibiting abnormal vibration pattern. Motor current draw 12% higher than right motor. Audible grinding noise at low speeds.",
      errorCode: "MEC-5301",
      affectedSystems: ["Left Drive Motor", "Motor Controller", "Drivetrain"],
      rootCause: "Foreign object (plastic zip tie fragment) lodged in motor assembly. Bearing showing early wear signs. Motor encoder slight misalignment.",
      actions: ["Disassemble and inspect motor assembly", "Remove foreign object", "Replace motor bearing if worn", "Re-calibrate motor encoder", "Grease motor shaft"],
      resolutionTime: "90-120 minutes",
    },
    {
      title: "Tray Lift Mechanism Jam",
      description: "Upper tray servo unable to reach full extension. Stalling at 75% position. Servo error rate 15/minute. Increased power draw detected.",
      errorCode: "MEC-6105",
      affectedSystems: ["Tray Servo", "Lift Mechanism", "Load Sensing"],
      rootCause: "Lift rail misalignment causing binding. Servo pulley belt tension 20% below spec. Likely impact/collision event.",
      actions: ["Realign lift rail assembly", "Adjust belt tension to spec", "Lubricate lift mechanism", "Verify servo motor health", "Check for frame damage"],
      resolutionTime: "60-75 minutes",
    },
  ],
  network: [
    {
      title: "WiFi Connectivity Intermittent",
      description: "Robot experiencing connection drops every 5-8 minutes. Latency spikes to 800ms before disconnection. Affecting real-time telemetry and command responsiveness.",
      errorCode: "NET-7201",
      affectedSystems: ["WiFi Module", "Network Stack", "Telemetry System"],
      rootCause: "AP roaming issues between APs #3 and #4. Signal strength oscillating at -75dBm boundary. Microwave oven interference detected on 2.4GHz band.",
      actions: ["Switch to 5GHz band", "Adjust AP power levels", "Optimize roaming thresholds", "Add AP in coverage gap", "Shield microwave source"],
      resolutionTime: "30-45 minutes (network config)",
    },
  ],
  software: [
    {
      title: "Task Scheduler Deadlock",
      description: "Robot stuck in 'Waiting for Task' state despite pending orders. Task queue showing 5 orders but not processing. Requires manual restart.",
      errorCode: "SW-8403",
      affectedSystems: ["Task Scheduler", "Order Management", "State Machine"],
      rootCause: "Race condition in task prioritization logic. Concurrent order assignments causing mutex deadlock. Memory leak in task cleanup (450MB over 72 hours).",
      actions: ["Deploy hotfix patch v3.2.1", "Implement task timeout safeguard", "Add memory leak detection", "Improve concurrent task handling", "Enable debug logging"],
      resolutionTime: "Software update: 10-15 minutes",
    },
  ],
  collision: [
    {
      title: "Collision Event Detected",
      description: "Robot reported collision with stationary object. Emergency stop triggered. Minor cosmetic damage to bumper. Accelerometer spike: 2.3G.",
      errorCode: "COL-9101",
      affectedSystems: ["Bumper Sensors", "Emergency Stop", "Safety System"],
      rootCause: "New furniture placement not reflected in map. Robot navigated through previously clear path. Obstacle detection failed due to dark matte surface (LIDAR absorption).",
      actions: ["Update facility map with new furniture", "Inspect bumper sensors and frame", "Add manual no-go zone", "Increase safety margins in tight spaces", "Report for RFE inspection"],
      resolutionTime: "Immediate (map update) + RFE inspection",
    },
  ],
  performance: [
    {
      title: "Heavy Load Performance Degradation",
      description: "Robot showing reduced speed and increased battery consumption under maximum payload. Travel time 35% longer than baseline. Motor temperature elevated.",
      errorCode: "PERF-1001",
      affectedSystems: ["Drive Motors", "Power Management", "Load Sensors"],
      rootCause: "Motor controller tuning not optimized for sustained heavy loads. Battery cells showing voltage sag under high current draw (>45A). Possible overloading beyond rated capacity.",
      actions: ["Verify actual payload weight vs. rated capacity", "Recalibrate load sensors", "Update motor controller parameters", "Enable battery cell balancing", "Reduce max speed under heavy load"],
      resolutionTime: "45-60 minutes (calibration) or battery replacement",
    },
    {
      title: "Payload Shift Detection",
      description: "Load sensors detecting uneven weight distribution. Robot reporting center of gravity offset. Stability warnings triggered 8 times in past shift.",
      errorCode: "PERF-1102",
      affectedSystems: ["Load Sensors", "Gyroscope", "Stability Control"],
      rootCause: "Cargo not properly secured causing dynamic load shifts during acceleration/braking. Load sensor calibration drift on front-left sensor (#3). Uneven floor surface amplifying instability.",
      actions: ["Secure payload properly", "Recalibrate all load sensors", "Reduce max acceleration/deceleration", "Add no-go zones for uneven surfaces", "Enable enhanced stability mode"],
      resolutionTime: "20-30 minutes",
    },
    {
      title: "Repeated Docking Failures",
      description: "Robot failing to dock correctly 4 out of 5 attempts. Position accuracy degraded to ±15cm (normal: ±3cm). Requiring manual intervention for charging.",
      errorCode: "PERF-1205",
      affectedSystems: ["Localization", "Vision System", "Docking Controller"],
      rootCause: "Docking markers faded or obscured. Vision system having difficulty with ambient lighting changes. Wheel odometry drift from floor surface changes.",
      actions: ["Replace docking visual markers", "Adjust lighting around charging station", "Recalibrate vision system", "Update docking approach algorithm", "Clean docking sensors"],
      resolutionTime: "30-45 minutes",
    },
  ],
};

/**
 * Generate realistic robot incidents based on actual robot errors
 */
export function generateIncidents(maxCount?: number): RobotIncident[] {
  const incidents: RobotIncident[] = [];
  
  // Get robots with errors first - these are guaranteed to have incidents
  const robotsWithErrors = robotFleet.filter(r => r.errors && r.errors.length > 0);
  
  // Create incidents for ALL robots with errors (no limit at generation)
  robotsWithErrors.forEach((robot, i) => {
    robot.errors.forEach((error) => {
      const templates = incidentTemplates[error.category];
      // Find matching template by error code or use first template
      const template = templates.find(t => t.errorCode === error.errorCode) || templates[0];
      
      // Weighted selection for status (more open/investigating than resolved)
      const statusRoll = (i * 17 + 42) % 100; // Deterministic
      const status: IncidentStatus = 
        statusRoll <= 35 ? "open" :         // 35%
        statusRoll <= 55 ? "investigating" : // 20%
        statusRoll <= 75 ? "in_progress" :  // 20%
        statusRoll <= 90 ? "resolved" :     // 15%
        "escalated";                        // 10%
      
      const detectedAt = dayjs().subtract((i * 13 + 10) % 230 + 10, "minutes");
      const downtime = (i * 11) % 175 + 5;
      
      incidents.push({
        id: `INC-${robot.id}-${error.errorCode}`,
        robotId: robot.id,
        robotName: robot.name,
        facility: robot.facility,
        city: robot.city,
        region: robot.region,
        
        title: template.title,
        description: template.description,
        category: error.category,
        severity: error.severity,
        status,
        
        detectedAt: detectedAt.toISOString(),
        lastUpdated: dayjs().subtract((i * 7) % 30 + 1, "minutes").toISOString(),
        resolvedAt: status === "resolved" ? dayjs().subtract((i * 5) % 60 + 1, "minutes").toISOString() : undefined,
        
        errorCode: error.errorCode,
        affectedSystems: template.affectedSystems,
        telemetry: {
          battery: robot.battery,
          cpuTemp: 45 + (i * 11) % 40,
          memoryUsage: 40 + (i * 13) % 55,
          networkLatency: 5 + (i * 17) % 495,
          lastPosition: { 
            x: parseFloat((i * 3.7 % 50).toFixed(2)), 
            y: parseFloat((i * 2.3 % 30).toFixed(2)) 
          },
        },
        
        aiInsights: {
          rootCause: template.rootCause,
          recommendedActions: template.actions,
          estimatedResolutionTime: template.resolutionTime,
          similarIncidents: 2 + (i * 19) % 43,
          confidence: 75 + (i * 23) % 23,
        },
        
        assignedTo: status !== "open" ? ["RFE-001", "RFE-002", "RFE-003", "Auto-Resolution"][i % 4] : undefined,
        resolutionSteps: generateResolutionSteps(template.actions, status),
        
        downtime,
        ordersAffected: Math.floor(downtime / 8), // ~8 min per order average
        revenueImpact: Math.floor(downtime / 8) * (15 + (i * 7) % 30), // Revenue per order
      });
    });
  });
  
  // Sort by severity first (hot to cold: critical > high > medium > low), then by time
  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  const sorted = incidents.sort((a, b) => {
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
    if (severityDiff !== 0) return severityDiff;
    return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime();
  });
  
  // Only limit if maxCount specified
  return maxCount ? sorted.slice(0, maxCount) : sorted;
}

function generateResolutionSteps(actions: string[], status: IncidentStatus): RobotIncident["resolutionSteps"] {
  if (status === "open") return [];
  
  const steps = actions.slice(0, faker.number.int({ min: 1, max: actions.length }));
  return steps.map((action, idx) => ({
    step: action,
    timestamp: dayjs().subtract(faker.number.int({ min: idx * 5, max: idx * 5 + 20 }), "minutes").toISOString(),
    performedBy: faker.helpers.arrayElement(["RFE-001 (John Kim)", "RFE-002 (Sarah Chen)", "Auto-Diagnostics", "Remote Support"]),
    status: (idx < steps.length - 1 || status === "resolved") ? "completed" : 
            faker.helpers.arrayElement(["pending", "completed", "failed"]) as any,
  }));
}

// Real-time incident updates (simulates live system)
export function getActiveIncidents(): RobotIncident[] {
  // Generate ALL incidents (no limit) - matches robot error count
  const allIncidents = generateIncidents();
  
  // Add time-based variation to make incidents appear "live"
  const now = Date.now();
  
  return allIncidents
    .filter(i => i.status !== "resolved") // Only show non-resolved
    .map((incident, idx) => {
      // Randomly vary status based on time to simulate activity
      const timeVariation = (now + idx * 1000) % 60000;
      let status = incident.status;
      
      if (timeVariation < 15000 && status === "open") {
        status = "investigating";
      } else if (timeVariation >= 15000 && timeVariation < 30000 && status === "investigating") {
        status = "in_progress";
      } else if (timeVariation >= 45000 && status === "in_progress") {
        status = "open"; // Cycle back
      }
      
      return { ...incident, status } as RobotIncident;
    });
  // No slice - show ALL active incidents to match robot errors
}

export function getIncidentById(id: string): RobotIncident | undefined {
  const incidents = generateIncidents(50);
  return incidents.find(i => i.id === id);
}

export function getIncidentsByRobot(robotId: string): RobotIncident[] {
  return generateIncidents(50).filter(i => i.robotId === robotId);
}

export function getIncidentStats() {
  const incidents = generateIncidents(100);
  return {
    total: incidents.length,
    critical: incidents.filter(i => i.severity === "critical").length,
    open: incidents.filter(i => i.status === "open" || i.status === "investigating").length,
    avgResolutionTime: 45, // minutes
    byCategory: {
      navigation: incidents.filter(i => i.category === "navigation").length,
      battery: incidents.filter(i => i.category === "battery").length,
      sensor: incidents.filter(i => i.category === "sensor").length,
      mechanical: incidents.filter(i => i.category === "mechanical").length,
      network: incidents.filter(i => i.category === "network").length,
      software: incidents.filter(i => i.category === "software").length,
      collision: incidents.filter(i => i.category === "collision").length,
    },
  };
}

