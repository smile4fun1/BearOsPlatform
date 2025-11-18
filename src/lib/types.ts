export type Facility =
  | "Seoul HQ Automation Lab"
  | "Silicon Valley Command"
  | "Tokyo Robotics Studio"
  | "Seoul Servi Factory"
  | "Busan Pilot Cluster"
  | "Singapore Experience Hub";

export type ServiceVertical =
  | "Hospitality"
  | "Enterprise Dining"
  | "Healthcare"
  | "Stadiums"
  | "Korean Franchises";

export type RobotModel = "Servi" | "Servi Lift" | "Servi Plus" | "Servi Suite";

export type KPIMomentum = "up" | "down" | "steady";

export interface OpsDataPoint {
  id: string;
  facility: Facility;
  city: string;
  region: "APAC" | "Americas";
  vertical: ServiceVertical;
  robotModel: RobotModel;
  shift: "Breakfast" | "Lunch" | "Dinner" | "Late Night";
  ordersServed: number;
  avgTurnTimeSeconds: number;
  uptime: number;
  nps: number;
  incidents: number;
  energyKwh: number;
  staffingDelta: number;
  timestamp: string;
}

export interface FinancialSnapshot {
  quarter: string;
  arrUsd: number;
  pipelineUsd: number;
  grossMargin: number;
  deployments: number;
  note: string;
}

export interface BearKnowledgeSlice {
  id: string;
  topic: string;
  summary: string;
  sources: string[];
  lastUpdated: string;
  confidence: number;
}

export interface ApiSurface {
  id: string;
  name: string;
  purpose: string;
  availability: "public" | "beta" | "internal";
  latencyMs: number;
  baseUrl: string;
}

export interface KPICard {
  id: string;
  label: string;
  value: string;
  delta: string;
  momentum: KPIMomentum;
  description: string;
}

export interface TrendPoint {
  week: string;
  throughput: number;
  uptime: number;
  incidents: number;
  satisfaction: number;
}

export interface HeatmapCell {
  facility: Facility;
  shift: OpsDataPoint["shift"];
  demandScore: number;
  utilization: number;
}

export interface AlertInsight {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  detail: string;
  owner: string;
  etaHours: number;
}

export interface ModelBlueprint {
  id: string;
  name: string;
  size: "70B" | "120B";
  baseModel: string;
  objective: string;
  datasets: string[];
  tokens: string;
  alignment: string[];
  evaluation: string[];
  deploymentTarget: string;
  currentPhase: "dataset-curation" | "alignment" | "offline-eval" | "ready";
}

export interface TrainingMilestone {
  label: string;
  status: "pending" | "running" | "complete";
  summary: string;
}

export interface TrainingPlan {
  model: ModelBlueprint;
  milestones: TrainingMilestone[];
  telemetry: {
    lastRun: string;
    validationScore: number;
    hallucinationRate: number;
  };
}

export interface CurationResponsePayload {
  kpis: KPICard[];
  trend: TrendPoint[];
  heatmap: HeatmapCell[];
  alerts: AlertInsight[];
  knowledge: BearKnowledgeSlice[];
  financials: FinancialSnapshot[];
  apiSurfaces: ApiSurface[];
  trainingPlans: TrainingPlan[];
}
