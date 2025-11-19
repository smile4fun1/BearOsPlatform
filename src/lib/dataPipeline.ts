/**
 * Data Pipeline Utilities
 * Provides real-time data generation and streaming capabilities
 */

import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { OpsDataPoint, Facility, ServiceVertical, RobotModel } from "./types";

const facilities: Facility[] = [
  "Seoul HQ Automation Lab",
  "Silicon Valley Command",
  "Tokyo Robotics Studio",
  "Seoul Servi Factory",
  "Busan Pilot Cluster",
  "Singapore Experience Hub",
];

const cities = ["Seoul", "Mountain View", "Tokyo", "Seoul", "Busan", "Singapore"];
const regions = ["APAC", "Americas", "APAC", "APAC", "APAC", "APAC"];

const verticals: ServiceVertical[] = [
  "Hospitality",
  "Enterprise Dining",
  "Healthcare",
  "Stadiums",
  "Korean Franchises",
];

const robotModels: RobotModel[] = ["Servi Plus", "Carti 100", "Carti 600"];

const shifts = ["Breakfast", "Lunch", "Dinner", "Late Night"];

/**
 * Generate a single real-time operational data point
 */
export function generateLiveDataPoint(): OpsDataPoint {
  const facilityIndex = faker.number.int({ min: 0, max: facilities.length - 1 });
  
  return {
    id: faker.string.uuid(),
    facility: facilities[facilityIndex],
    city: cities[facilityIndex],
    region: regions[facilityIndex] as "APAC" | "Americas",
    vertical: faker.helpers.arrayElement(verticals),
    robotModel: faker.helpers.arrayElement(robotModels),
    shift: faker.helpers.arrayElement(shifts) as OpsDataPoint["shift"],
    ordersServed: faker.number.int({ min: 80, max: 320 }),
    avgTurnTimeSeconds: faker.number.int({ min: 45, max: 180 }),
    uptime: faker.number.float({ min: 85, max: 99.9, fractionDigits: 2 }),
    nps: faker.number.int({ min: 60, max: 95 }),
    incidents: faker.number.int({ min: 0, max: 3 }),
    energyKwh: faker.number.float({ min: 8, max: 25, fractionDigits: 2 }),
    staffingDelta: faker.number.int({ min: -3, max: 1 }),
    timestamp: dayjs().toISOString(),
  };
}

/**
 * Generate multiple live data points
 */
export function generateLiveDataBatch(count: number): OpsDataPoint[] {
  return Array.from({ length: count }, () => generateLiveDataPoint());
}

/**
 * Simulate real-time data streaming with a callback
 * Useful for Server-Sent Events or WebSocket implementations
 */
export function startDataStream(
  callback: (data: OpsDataPoint) => void,
  intervalMs: number = 5000
): () => void {
  const interval = setInterval(() => {
    const dataPoint = generateLiveDataPoint();
    callback(dataPoint);
  }, intervalMs);

  // Return cleanup function
  return () => clearInterval(interval);
}

/**
 * Generate simulated real-time metrics
 */
export function generateLiveMetrics() {
  return {
    timestamp: dayjs().toISOString(),
    activeRobots: faker.number.int({ min: 1200, max: 1300 }),
    ordersPerMinute: faker.number.int({ min: 45, max: 85 }),
    avgResponseTime: faker.number.int({ min: 120, max: 180 }),
    systemUptime: faker.number.float({ min: 98.5, max: 99.9, fractionDigits: 2 }),
    activeAlerts: faker.number.int({ min: 0, max: 5 }),
    energyConsumption: faker.number.float({ min: 8500, max: 12000, fractionDigits: 0 }),
  };
}

/**
 * Generate training telemetry updates
 */
export function generateTrainingUpdate() {
  return {
    timestamp: dayjs().toISOString(),
    modelsTraining: faker.number.int({ min: 1, max: 3 }),
    avgLoss: faker.number.float({ min: 0.1, max: 0.4, fractionDigits: 4 }),
    tokensProcessed: faker.number.int({ min: 100000000, max: 500000000 }),
    gpuUtilization: faker.number.float({ min: 85, max: 99, fractionDigits: 1 }),
    estimatedCompletion: dayjs().add(faker.number.int({ min: 2, max: 48 }), 'hour').toISOString(),
  };
}

/**
 * Simulate API response times
 */
export function generateApiMetrics() {
  return {
    timestamp: dayjs().toISOString(),
    endpoints: [
      {
        path: "/api/curation",
        avgLatency: faker.number.int({ min: 45, max: 120 }),
        requestsPerMin: faker.number.int({ min: 20, max: 80 }),
        successRate: faker.number.float({ min: 99.5, max: 100, fractionDigits: 2 }),
      },
      {
        path: "/api/insights",
        avgLatency: faker.number.int({ min: 800, max: 2000 }),
        requestsPerMin: faker.number.int({ min: 5, max: 25 }),
        successRate: faker.number.float({ min: 98, max: 100, fractionDigits: 2 }),
      },
      {
        path: "/api/live",
        avgLatency: faker.number.int({ min: 20, max: 60 }),
        requestsPerMin: faker.number.int({ min: 50, max: 150 }),
        successRate: faker.number.float({ min: 99.8, max: 100, fractionDigits: 2 }),
      },
    ],
  };
}

