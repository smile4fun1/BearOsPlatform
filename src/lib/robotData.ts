import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

// Set seed for consistent data generation between server and client
faker.seed(42);

export interface Robot {
  id: string;
  name: string;
  model: "Servi" | "Servi Plus" | "Carti 100" | "Carti 600";
  vertical: "Restaurant" | "Healthcare" | "Staff Aid" | "Warehousing";
  status: "active" | "idle" | "charging" | "maintenance" | "offline" | "error";
  facility: string;
  city: string;
  region: "APAC" | "Americas" | "Europe";
  location: { lat: number; lng: number; floor: number };
  battery: number;
  uptime: number;
  totalTrips: number;
  lastSeen: string;
  firmware: string;
  serialNumber: string;
  assignedZone?: string;
  currentTask?: string;
  errors: string[];
  specs: {
    payloadCapacity: string;
    maxSpeed: string;
    runtime: string;
    trays?: number; // Only for food service robots
    dimensions: string;
    weight: string;
  };
  metrics: {
    avgTripTime: number;
    successRate: number;
    distanceTraveled: number;
    ordersToday: number;
    tripsCompleted: number;
    totalDistanceKm: number;
    ordersServed: number;
    battery: number; // Add battery to metrics
  };
}

const facilities = [
  { name: "Seoul Operations Center", city: "Seoul", region: "APAC" as const, coords: { lat: 37.5665, lng: 126.978 } },
  { name: "Redwood City HQ", city: "Redwood City", region: "Americas" as const, coords: { lat: 37.4852, lng: -122.2364 } },
  { name: "Los Angeles Distribution", city: "Los Angeles", region: "Americas" as const, coords: { lat: 34.0522, lng: -118.2437 } },
  { name: "London Service Hub", city: "London", region: "Europe" as const, coords: { lat: 51.5074, lng: -0.1278 } },
  { name: "Paris Operations", city: "Paris", region: "Europe" as const, coords: { lat: 48.8566, lng: 2.3522 } },
  { name: "Berlin Tech Center", city: "Berlin", region: "Europe" as const, coords: { lat: 52.5200, lng: 13.4050 } },
  { name: "Singapore Hub", city: "Singapore", region: "APAC" as const, coords: { lat: 1.3521, lng: 103.8198 } },
  { name: "Tokyo Service Center", city: "Tokyo", region: "APAC" as const, coords: { lat: 35.6762, lng: 139.6503 } },
];

const models: Robot["model"][] = ["Servi Plus", "Carti 100", "Carti 600"];

// Model specifications based on actual Bear Robotics products
const modelSpecs = {
  "Servi Plus": {
    vertical: "Restaurant" as const,
    payloadCapacity: "40 kg (88 lbs)",
    maxSpeed: "1.2 m/s",
    runtime: "14-18 hours",
    trays: 4,
    dimensions: "550×550×1350 mm",
    weight: "60 kg"
  },
  "Carti 100": {
    vertical: "Staff Aid" as const, // Can also be Warehousing
    payloadCapacity: "100 kg (220 lbs)",
    maxSpeed: "1.5 m/s",
    runtime: "10-14 hours",
    dimensions: "600×800×1100 mm",
    weight: "80 kg"
  },
  "Carti 600": {
    vertical: "Warehousing" as const,
    payloadCapacity: "600 kg (1320 lbs)",
    maxSpeed: "1.0 m/s",
    runtime: "8-12 hours",
    dimensions: "800×1200×1400 mm",
    weight: "180 kg"
  }
};

// Task descriptions vary by model vertical
const restaurantZones = ["Dining Area A", "Dining Area B", "Bar Section", "Kitchen Entrance", "Main Hall", "Private Rooms"];
const staffAidZones = ["East Wing", "West Wing", "Service Corridor", "Storage Area", "Central Hub", "North Section"];
const warehousingZones = ["Zone A", "Zone B", "Zone C", "Loading Dock", "Warehouse Floor", "Shipping Area"];

const restaurantTasks = [
  "Delivering to Table 12",
  "Returning to kitchen",
  "Waiting for pickup",
  "En route to Table 8",
  "Charging",
  "Idle - Ready for assignment",
];

const staffAidTasks = [
  "Transporting cleaning supplies",
  "Delivering tools to maintenance",
  "Moving supplies to storage",
  "Returning empty carts",
  "Charging",
  "Idle - Ready for assignment",
];

const warehousingTasks = [
  "Moving pallets to dock",
  "Transporting goods to Zone B",
  "Picking order items",
  "Returning to staging area",
  "Charging",
  "Idle - Ready for assignment",
];

// Predefined robot IDs for consistency
const ROBOT_IDS = [
  "c44e79", "a1b2c3", "d5e6f7", "g8h9i0", "j1k2l3", "m4n5o6", "p7q8r9", "s0t1u2",
  "v3w4x5", "y6z7a8", "b9c0d1", "e2f3g4", "h5i6j7", "k8l9m0", "n1o2p3", "q4r5s6",
  "t7u8v9", "w0x1y2", "z3a4b5", "c6d7e8", "f9g0h1", "i2j3k4", "l5m6n7", "o8p9q0",
  "r1s2t3", "u4v5w6", "x7y8z9", "a0b1c2", "d3e4f5", "g6h7i8", "j9k0l1", "m2n3o4",
  "p5q6r7", "s8t9u0", "v1w2x3", "y4z5a6", "b7c8d9", "e0f1g2", "h3i4j5", "k6l7m8",
  "n9o0p1", "q2r3s4", "t5u6v7", "w8x9y0", "z1a2b3", "c4d5e6", "f7g8h9", "i0j1k2",
  "l3m4n5", "o6p7q8", "r9s0t1", "u2v3w4", "x5y6z7", "a8b9c0", "d1e2f3", "g4h5i6",
  "j7k8l9", "m0n1o2", "p3q4r5", "s6t7u8", "v9w0x1", "y2z3a4", "b5c6d7", "e8f9g0",
  "h1i2j3", "k4l5m6", "n7o8p9", "q0r1s2", "t3u4v5", "w6x7y8", "z9a0b1", "c2d3e4",
  "f5g6h7", "i8j9k0", "l1m2n3", "o4p5q6", "r7s8t9", "u0v1w2", "x3y4z5", "a6b7c8",
  "d9e0f1", "g2h3i4", "j5k6l7", "m8n9o0", "p1q2r3", "s4t5u6", "v7w8x9", "y0z1a2",
  "b3c4d5", "e6f7g8", "h9i0j1", "k2l3m4", "n5o6p7", "q8r9s0", "t1u2v3", "w4x5y6",
  "z7a8b9", "c0d1e2", "f3g4h5", "i6j7k8", "l9m0n1", "o2p3q4", "r5s6t7", "u8v9w0",
];

function generateRobot(index: number): Robot {
  // Reset faker with index-based seed for deterministic generation
  faker.seed(42 + index);
  
  const facility = facilities[index % facilities.length];
  const robotId = ROBOT_IDS[index % ROBOT_IDS.length];
  const model = models[index % models.length];
  const specs = modelSpecs[model];
  
  // Allow Carti 100 to be either Staff Aid or Warehousing
  let vertical = specs.vertical;
  if (model === "Carti 100" && index % 3 === 0) {
    vertical = "Warehousing";
  }
  
  // Select zones and tasks based on vertical
  let zones: string[];
  let tasks: string[];
  if (vertical === "Restaurant") {
    zones = restaurantZones;
    tasks = restaurantTasks;
  } else if (vertical === "Staff Aid") {
    zones = staffAidZones;
    tasks = staffAidTasks;
  } else {
    zones = warehousingZones;
    tasks = warehousingTasks;
  }
  
  // Weighted status distribution
  const statusWeights = [40, 30, 15, 8, 5, 2]; // active, idle, charging, maintenance, offline, error
  const totalWeight = statusWeights.reduce((a, b) => a + b, 0);
  const random = (index * 137 + 42) % totalWeight; // Deterministic "random"
  let status: Robot["status"] = "active";
  let cumulative = 0;
  const statusOptions: Robot["status"][] = ["active", "idle", "charging", "maintenance", "offline", "error"];
  for (let i = 0; i < statusWeights.length; i++) {
    cumulative += statusWeights[i];
    if (random < cumulative) {
      status = statusOptions[i];
      break;
    }
  }
  
  const batteryLevel = status === "charging" 
    ? 40 + (index * 7) % 55 
    : 15 + (index * 11) % 85;
  
  const hasError = status === "error";
  const errors = hasError ? [
    ["LIDAR calibration drift detected", "WiFi signal weak", "Load sensor malfunction", "Navigation path blocked", "Battery degradation warning"]
    [(index * 13) % 5]
  ] : [];
  
  // Serial number prefix based on model
  const serialPrefix = model.startsWith("Servi") ? "SRV" : "CRT";
  
  return {
    id: robotId,
    name: `${model.replace(" ", "-")}-${robotId.slice(0, 4).toUpperCase()}`,
    model,
    vertical,
    status,
    facility: facility.name,
    city: facility.city,
    region: facility.region,
    location: {
      lat: facility.coords.lat + ((index * 17) % 1000 - 500) * 0.000001,
      lng: facility.coords.lng + ((index * 19) % 1000 - 500) * 0.000001,
      floor: 1 + (index % 3),
    },
    battery: batteryLevel,
    uptime: 85 + (index * 23) % 15 + ((index * 7) % 100) / 100,
    totalTrips: 500 + (index * 127) % 14500,
    lastSeen: status === "offline"
      ? dayjs().subtract(2 + (index % 46), 'hour').toISOString()
      : dayjs().subtract(1 + (index % 299), 'second').toISOString(),
    firmware: `v${2 + (index % 3)}.${(index * 3) % 10}.${(index * 7) % 21}`,
    serialNumber: `${serialPrefix}-${robotId.toUpperCase()}${String(10000000 + index).slice(1, 5)}`,
    assignedZone: (index % 5) !== 0 ? zones[index % zones.length] : undefined,
    currentTask: status === "active" ? tasks[index % tasks.length] : undefined,
    errors,
    specs: {
      payloadCapacity: specs.payloadCapacity,
      maxSpeed: specs.maxSpeed,
      runtime: specs.runtime,
      trays: specs.trays,
      dimensions: specs.dimensions,
      weight: specs.weight,
    },
    metrics: {
      avgTripTime: 45 + (index * 17) % 135,
      successRate: 92 + ((index * 11) % 80) / 10,
      distanceTraveled: 5.2 + ((index * 23) % 406) / 10,
      ordersToday: 12 + (index * 31) % 136,
      tripsCompleted: 100 + (index * 41) % 900,
      totalDistanceKm: 10 + ((index * 47) % 390) / 10,
      ordersServed: 200 + (index * 53) % 1300,
      battery: batteryLevel,
    },
  };
}

// Generate fleet of robots with consistent IDs
export const robotFleet: Robot[] = Array.from({ length: 101 }, (_, i) => generateRobot(i));

// Helper functions
export function getRobotById(id: string): Robot | undefined {
  return robotFleet.find(r => r.id === id);
}

export function getRobotsByFacility(facility: string): Robot[] {
  return robotFleet.filter(r => r.facility === facility);
}

export function getRobotsByStatus(status: Robot["status"]): Robot[] {
  return robotFleet.filter(r => r.status === status);
}

export function searchRobots(query: string): Robot[] {
  const lowerQuery = query.toLowerCase();
  return robotFleet.filter(
    r =>
      r.id.toLowerCase().includes(lowerQuery) ||
      r.name.toLowerCase().includes(lowerQuery) ||
      r.model.toLowerCase().includes(lowerQuery) ||
      r.facility.toLowerCase().includes(lowerQuery) ||
      r.serialNumber.toLowerCase().includes(lowerQuery)
  );
}

