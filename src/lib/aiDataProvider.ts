/**
 * AI Data Provider - Fetches real data from the platform for AI responses
 */

import { robotFleet, getRobotById } from "./robotData";
import { operationsDataset } from "./mockData";
import dayjs from "dayjs";

export interface TimeRange {
  hours?: number;
  days?: number;
  weeks?: number;
  months?: number;
}

/**
 * Get robot fleet statistics for a given time range
 */
export function getFleetStats(timeRange?: TimeRange) {
  const totalRobots = robotFleet.length;
  const activeRobots = robotFleet.filter(r => r.status === "active").length;
  const idleRobots = robotFleet.filter(r => r.status === "idle").length;
  const chargingRobots = robotFleet.filter(r => r.status === "charging").length;
  const errorRobots = robotFleet.filter(r => r.status === "error").length;
  const maintenanceRobots = robotFleet.filter(r => r.status === "maintenance").length;

  // Calculate averages - USE ACTUAL DATA
  const avgBattery = robotFleet.reduce((sum, r) => sum + r.battery, 0) / totalRobots;
  const avgUptime = robotFleet.reduce((sum, r) => sum + r.metrics.successRate, 0) / totalRobots;
  const avgTrips = robotFleet.reduce((sum, r) => sum + (r.metrics.tripsCompleted || 0), 0) / totalRobots;
  const totalDistance = robotFleet.reduce((sum, r) => sum + (r.metrics.totalDistanceKm || 0), 0);
  const totalOrders = robotFleet.reduce((sum, r) => sum + (r.metrics.ordersServed || 0), 0);
  const totalTrips = robotFleet.reduce((sum, r) => sum + (r.metrics.tripsCompleted || 0), 0);

  // Critical alerts
  const lowBatteryRobots = robotFleet.filter(r => r.status === "charging"); // Approximate low battery by charging status
  const errorMessages = robotFleet
    .filter(r => r.status === "error")
    .map(r => ({ id: r.id, name: r.name, error: r.errors[0]?.message || "Unknown error", errorCode: r.errors[0]?.errorCode || "ERR-000" }));

  // Facility breakdown
  const facilityCounts = robotFleet.reduce((acc, r) => {
    acc[r.facility] = (acc[r.facility] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total: totalRobots,
    active: activeRobots,
    idle: idleRobots,
    charging: chargingRobots,
    error: errorRobots,
    maintenance: maintenanceRobots,
    averages: {
      battery: Math.round(avgBattery * 10) / 10,
      uptime: Math.round(avgUptime * 10) / 10,
      tripsPerRobot: Math.round(avgTrips * 10) / 10,
    },
    totals: {
      distance: Math.round(totalDistance * 10) / 10,
      orders: totalOrders,
      trips: totalTrips,
    },
    alerts: {
      lowBattery: lowBatteryRobots.map(r => ({
        id: r.id,
        name: r.name,
        battery: r.battery, // USE ACTUAL battery level
        facility: r.facility,
      })),
      errors: errorMessages.map(e => ({
        id: e.id,
        name: e.name,
        error: e.error,
        errorCode: e.errorCode,
        battery: robotFleet.find(r => r.id === e.id)?.battery || 0, // ADD actual battery
        facility: robotFleet.find(r => r.id === e.id)?.facility || "Unknown",
      })),
    },
    facilities: facilityCounts,
  };
}

/**
 * Get detailed statistics for a specific robot
 */
export function getRobotStats(robotId: string) {
  const robot = getRobotById(robotId);
  if (!robot) return null;

  return {
    id: robot.id,
    name: robot.name,
    status: robot.status,
    model: robot.model,
    facility: robot.facility,
    city: robot.city,
    region: robot.region,
    batteryLevel: robot.battery, // Use ACTUAL battery from robot data
    errorCount: robot.errorCount || 0,
    metrics: {
      battery: robot.battery, // Use ACTUAL battery from robot data
      uptime: robot.metrics.successRate, // Use success rate as uptime proxy
      errorRate: 100 - robot.metrics.successRate, // Inverse of success rate
      tripsCompleted: robot.metrics.tripsCompleted,
      totalDistanceKm: robot.metrics.totalDistanceKm,
      ordersServed: robot.metrics.ordersServed,
      avgTripTime: robot.metrics.avgTripTime,
      successRate: robot.metrics.successRate,
    },
    location: robot.location,
    errorMessage: robot.errors[0]?.message || null,
    errorCode: robot.errors[0]?.errorCode || null,
    lastSeen: robot.lastSeen,
  };
}

/**
 * Get operations data for a time range
 */
export function getOperationsStats(timeRange?: TimeRange) {
  // Use the last 100 operations from the dataset
  const ops = operationsDataset.slice(-100);
  
  const totalOps = ops.length;
  // Most operations are successful, estimate based on uptime
  const avgUptime = ops.reduce((sum, o) => sum + o.uptime, 0) / totalOps;
  const successfulOps = Math.round((avgUptime / 100) * totalOps);
  const failedOps = ops.filter(o => o.incidents > 0).length;
  const pendingOps = totalOps - successfulOps - failedOps;

  // Calculate success rate
  const successRate = (successfulOps / totalOps) * 100;

  // Facility breakdown
  const facilityOps = ops.reduce((acc, o) => {
    acc[o.facility] = (acc[o.facility] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Robot model breakdown (type)
  const typeOps = ops.reduce((acc, o) => {
    acc[o.robotModel] = (acc[o.robotModel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total: totalOps,
    successful: successfulOps,
    pending: pendingOps,
    failed: failedOps,
    successRate: Math.round(successRate * 10) / 10,
    byFacility: facilityOps,
    byType: typeOps,
  };
}

/**
 * Get time-filtered data based on time range
 */
export function getTimeRangeLabel(timeRange?: TimeRange): string {
  if (!timeRange) return "all time";
  if (timeRange.hours) return `last ${timeRange.hours} hour${timeRange.hours > 1 ? 's' : ''}`;
  if (timeRange.days) return `last ${timeRange.days} day${timeRange.days > 1 ? 's' : ''}`;
  if (timeRange.weeks) return `last ${timeRange.weeks} week${timeRange.weeks > 1 ? 's' : ''}`;
  if (timeRange.months) return `last ${timeRange.months} month${timeRange.months > 1 ? 's' : ''}`;
  return "all time";
}

/**
 * Parse time range from user query
 */
export function parseTimeRange(query: string): TimeRange | undefined {
  const lowerQuery = query.toLowerCase();
  
  // Match patterns like "last 24 hours", "past 3 days", "last week", etc.
  const hourMatch = lowerQuery.match(/(?:last|past)\s+(\d+)\s+hours?/);
  if (hourMatch) return { hours: parseInt(hourMatch[1]) };
  
  const dayMatch = lowerQuery.match(/(?:last|past)\s+(\d+)\s+days?/);
  if (dayMatch) return { days: parseInt(dayMatch[1]) };
  
  const weekMatch = lowerQuery.match(/(?:last|past)\s+(\d+)\s+weeks?/);
  if (weekMatch) return { weeks: parseInt(weekMatch[1]) };
  
  const monthMatch = lowerQuery.match(/(?:last|past)\s+(\d+)\s+months?/);
  if (monthMatch) return { months: parseInt(monthMatch[1]) };
  
  // Handle singular forms without numbers
  if (lowerQuery.includes("last hour") || lowerQuery.includes("past hour")) return { hours: 1 };
  if (lowerQuery.includes("today")) return { days: 1 };
  if (lowerQuery.includes("last day") || lowerQuery.includes("past day")) return { days: 1 };
  if (lowerQuery.includes("last week") || lowerQuery.includes("past week") || lowerQuery.includes("this week")) return { weeks: 1 };
  if (lowerQuery.includes("last month") || lowerQuery.includes("past month") || lowerQuery.includes("this month")) return { months: 1 };
  
  return undefined;
}

/**
 * Get facility-specific statistics
 */
export function getFacilityStats(facilityName: string) {
  const facilityRobots = robotFleet.filter(r => r.facility === facilityName);
  const facilityOps = operationsDataset.filter(o => o.facility === facilityName).slice(-50);
  
  if (facilityRobots.length === 0) {
    return null;
  }
  
  const activeCount = facilityRobots.filter(r => r.status === "active").length;
  const avgBattery = facilityRobots.reduce((sum, r) => sum + r.battery, 0) / facilityRobots.length;
  const avgUptime = facilityOps.reduce((sum, o) => sum + o.uptime, 0) / facilityOps.length;
  const totalOrders = facilityOps.reduce((sum, o) => sum + o.ordersServed, 0);
  const errorCount = facilityRobots.filter(r => r.status === "error").length;
  
  // Model breakdown
  const modelBreakdown = facilityRobots.reduce((acc, r) => {
    acc[r.model] = (acc[r.model] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    facility: facilityName,
    city: facilityRobots[0].city,
    region: facilityRobots[0].region,
    totalRobots: facilityRobots.length,
    activeRobots: activeCount,
    errorRobots: errorCount,
    avgBattery: Math.round(avgBattery * 10) / 10,
    avgUptime: Math.round(avgUptime * 10) / 10,
    totalOrders,
    modelBreakdown,
    recentIncidents: facilityOps.reduce((sum, o) => sum + o.incidents, 0),
  };
}

/**
 * Get comprehensive data summary for AI context
 */
export function getAIDataContext(query: string) {
  const timeRange = parseTimeRange(query);
  const timeLabel = getTimeRangeLabel(timeRange);
  
  const fleetStats = getFleetStats(timeRange);
  const opsStats = getOperationsStats(timeRange);
  
  // Add model breakdown
  const modelBreakdown = robotFleet.reduce((acc, r) => {
    acc[r.model] = (acc[r.model] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    timeRange: timeLabel,
    fleet: {
      ...fleetStats,
      modelBreakdown,
      availableModels: ["Servi Plus", "Carti 100", "Carti 600"],
    },
    operations: opsStats,
  };
}

