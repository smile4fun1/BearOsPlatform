import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import {
  ApiSurface,
  BearKnowledgeSlice,
  Facility,
  FinancialSnapshot,
  OpsDataPoint,
  RobotModel,
  ServiceVertical,
} from "./types";

faker.seed(20251118);

const facilityMetadata: Record<
  Facility,
  { city: string; region: OpsDataPoint["region"] }
> = {
  "Seoul Operations Center": { city: "Seoul", region: "APAC" },
  "Redwood City HQ": { city: "Redwood City", region: "Americas" },
  "Los Angeles Distribution": { city: "Los Angeles", region: "Americas" },
  "London Service Hub": { city: "London", region: "Europe" },
  "Paris Operations": { city: "Paris", region: "Europe" },
  "Berlin Tech Center": { city: "Berlin", region: "Europe" },
  "Singapore Hub": { city: "Singapore", region: "APAC" },
  "Tokyo Service Center": { city: "Tokyo", region: "APAC" },
};

const verticals: ServiceVertical[] = [
  "Hospitality",
  "Enterprise Dining",
  "Healthcare",
  "Stadiums",
  "Korean Franchises",
];

const robotModels: RobotModel[] = [
  "Servi Plus",
  "Carti 100",
  "Carti 600",
];

const shifts: OpsDataPoint["shift"][] = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Late Night",
];

const weeksBack = 16;

export const operationsDataset: OpsDataPoint[] = Array.from(
  { length: weeksBack * 24 },
  (_, index) => {
    const facility = faker.helpers.arrayElement(
      Object.keys(facilityMetadata) as Facility[],
    );
    const shift = shifts[index % shifts.length];
    const vertical = faker.helpers.arrayElement(verticals);
    const robotModel = faker.helpers.arrayElement(robotModels);
    const ordersServed = faker.number.int({ min: 180, max: 720 });
    const avgTurnTimeSeconds = faker.number.int({ min: 90, max: 240 });
    const uptime = faker.number.float({ min: 94, max: 99.7, precision: 0.01 });
    const nps = faker.number.int({ min: 48, max: 92 });
    const incidents = faker.number.int({ min: 0, max: 4 });
    const energyKwh = faker.number.float({ min: 12, max: 36, precision: 0.1 });
    const staffingDelta = faker.number.float({
      min: -6,
      max: 4,
      precision: 0.1,
    });
    const timestamp = dayjs()
      .subtract(index % weeksBack, "week")
      .subtract(faker.number.int({ min: 0, max: 5 }), "day")
      .hour(
        shift === "Breakfast"
          ? 8
          : shift === "Lunch"
            ? 12
            : shift === "Dinner"
              ? 18
              : 23,
      )
      .minute(faker.number.int({ min: 0, max: 59 }))
      .second(0)
      .toISOString();

    return {
      id: `ops-${index}`,
      facility,
      city: facilityMetadata[facility].city,
      region: facilityMetadata[facility].region,
      vertical,
      robotModel,
      shift,
      ordersServed,
      avgTurnTimeSeconds,
      uptime,
      nps,
      incidents,
      energyKwh,
      staffingDelta,
      timestamp,
    };
  },
);

export const financialSnapshots: FinancialSnapshot[] = [
  {
    quarter: "2024 Q4",
    arrUsd: 142_000_000,
    pipelineUsd: 51_000_000,
    grossMargin: 63,
    deployments: 980,
    note: "APAC mega-franchise deals closed; ramping Servi Plus and Carti 100 production in Incheon.",
  },
  {
    quarter: "2025 Q1",
    arrUsd: 158_000_000,
    pipelineUsd: 72_500_000,
    grossMargin: 65,
    deployments: 1_120,
    note: "Healthcare pilots in Seoul + Tokyo driving higher-margin subscriptions.",
  },
  {
    quarter: "2025 Q2",
    arrUsd: 173_000_000,
    pipelineUsd: 88_000_000,
    grossMargin: 67,
    deployments: 1_340,
    note: "Carti 600 launched for heavy-duty warehousing; multi-industry expansion accelerating.",
  },
  {
    quarter: "2025 Q3 (proj)",
    arrUsd: 192_000_000,
    pipelineUsd: 101_000_000,
    grossMargin: 69,
    deployments: 1_560,
    note: "Large Korean conglomerate roll-out + US stadium retrofits.",
  },
];

export const knowledgeBase: BearKnowledgeSlice[] = [
  {
    id: "kb-vision",
    topic: "Company Vision",
    summary:
      "Bear Robotics (Bearrobotics.ai) designs autonomous service robots that augment hospitality teams. Founded in Redwood City with a major Seoul R&D hub, the company blends Korean manufacturing with Silicon Valley software.",
    sources: ["https://bearrobotics.ai", "Press briefings 2024-11"],
    lastUpdated: "2025-09-12",
    confidence: 0.93,
  },
  {
    id: "kb-servi",
    topic: "Bear Robotics Product Line",
    summary:
      "Servi Plus delivers premium food service automation with 4 trays and 40kg payload. Carti 100 (100kg) supports staff operations and light warehousing. Carti 600 (600kg) handles heavy industrial loads. All models feature precision navigation and Bear Cloud integration.",
    sources: [
      "https://bearrobotics.ai/products",
      "Internal product specifications (rev 5)",
    ],
    lastUpdated: "2025-08-22",
    confidence: 0.9,
  },
  {
    id: "kb-market",
    topic: "Market Footprint",
    summary:
      "Global deployments across Korea, USA, UK, France, Germany, Japan, and Singapore. Restaurant partners, healthcare facilities, and warehouse operations across 8 countries.",
    sources: ["Deployment tracker", "Public partner releases"],
    lastUpdated: "2025-10-02",
    confidence: 0.88,
  },
  {
    id: "kb-api",
    topic: "Bear Cloud API",
    summary:
      "REST + WebSocket surfaces for telemetry, job queues, and 3rd-party orchestration. Supports OAuth device grant and signed event webhooks. Beta GraphQL schema for scene graph queries.",
    sources: ["https://bearrobotics.ai/cloud", "API changelog v3.4"],
    lastUpdated: "2025-11-05",
    confidence: 0.86,
  },
  {
    id: "kb-safety",
    topic: "Safety & Compliance",
    summary:
      "Robots certified under KC, CE, and UL with redundant 3D LiDAR, depth cameras, and real-time intrusion slow zones. Korea MFDS compliance for hospital workflows completed 2025.",
    sources: ["Internal compliance archive", "MFDS filing 2025-04"],
    lastUpdated: "2025-04-18",
    confidence: 0.91,
  },
];

export const apiSurfaces: ApiSurface[] = [
  {
    id: "api-telemetry",
    name: "Bear Cloud Telemetry",
    purpose: "Real-time robot vitals, routes, and battery data streaming.",
    availability: "public",
    latencyMs: 320,
    baseUrl: "https://api.bearrobotics.ai/v1/telemetry",
  },
  {
    id: "api-orchestration",
    name: "Mission Orchestration",
    purpose:
      "Queue and monitor delivery missions; supports multi-robot swarms.",
    availability: "beta",
    latencyMs: 410,
    baseUrl: "https://api.bearrobotics.ai/v1/missions",
  },
  {
    id: "api-vision",
    name: "Spatial Vision Stream",
    purpose: "WebRTC scene graph feed for digital twin overlays.",
    availability: "internal",
    latencyMs: 210,
    baseUrl: "https://vision.bearrobotics.ai/stream",
  },
  {
    id: "api-knowledge",
    name: "Bear Knowledge Graph",
    purpose:
      "GraphQL endpoint exposing configuration, playbooks, and SOP links.",
    availability: "beta",
    latencyMs: 380,
    baseUrl: "https://api.bearrobotics.ai/graph",
  },
];
