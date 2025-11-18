import dayjs from "dayjs";
import {
  apiSurfaces,
  financialSnapshots,
  knowledgeBase,
  operationsDataset,
} from "./mockData";
import {
  AlertInsight,
  CurationResponsePayload,
  HeatmapCell,
  KPICard,
  KPIMomentum,
  TrendPoint,
} from "./types";
import { assembleTrainingPlans } from "./modelOrchestrator";

const numberFormatter = new Intl.NumberFormat("en-US");
const percentFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const getRecentData = (weeks = 4) => {
  const cutoff = dayjs().subtract(weeks, "week");
  return operationsDataset.filter((point) =>
    dayjs(point.timestamp).isAfter(cutoff),
  );
};

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);

const average = (values: number[]) =>
  values.length ? sum(values) / values.length : 0;

const compareDelta = (
  current: number,
  previous: number,
): { delta: string; momentum: KPIMomentum } => {
  const deltaValue =
    previous === 0 ? 0 : ((current - previous) / previous) * 100;
  const rounded = percentFormatter.format(deltaValue);
  let momentum: KPIMomentum = "steady";
  if (deltaValue > 1.5) momentum = "up";
  else if (deltaValue < -1.5) momentum = "down";
  return {
    delta: `${deltaValue >= 0 ? "+" : ""}${rounded}% vs prev`,
    momentum,
  };
};

export const curateKpis = (): KPICard[] => {
  const recent = getRecentData(2);
  const prior = getRecentData(4).filter((point) =>
    dayjs(point.timestamp).isBefore(dayjs().subtract(2, "week")),
  );

  const currentOrders = sum(recent.map((point) => point.ordersServed));
  const priorOrders = sum(prior.map((point) => point.ordersServed));

  const currentUptime = average(recent.map((point) => point.uptime));
  const priorUptime = average(prior.map((point) => point.uptime));

  const currentNps = average(recent.map((point) => point.nps));
  const priorNps = average(prior.map((point) => point.nps));

  const incidentsPer1000 =
    (sum(recent.map((point) => point.incidents)) / currentOrders) * 1000;
  const priorIncidents =
    (sum(prior.map((point) => point.incidents)) / priorOrders) * 1000;

  return [
    {
      id: "kpi-orders",
      label: "Orders Automated",
      value: numberFormatter.format(currentOrders),
      ...compareDelta(currentOrders, priorOrders),
      description: "Tasks completed autonomously over the last two weeks.",
    },
    {
      id: "kpi-uptime",
      label: "Fleet Uptime",
      value: `${percentFormatter.format(currentUptime)}%`,
      ...compareDelta(currentUptime, priorUptime),
      description: "Weighted average across all facilities.",
    },
    {
      id: "kpi-nps",
      label: "Guest NPS",
      value: percentFormatter.format(currentNps),
      ...compareDelta(currentNps, priorNps),
      description: "Service satisfaction captured via Bear Cloud surveys.",
    },
    {
      id: "kpi-incidents",
      label: "Incidents / 1k Jobs",
      value: incidentsPer1000.toFixed(2),
      ...compareDelta(incidentsPer1000, priorIncidents),
      description: "Safety and interruption signals normalized to workload.",
    },
  ];
};

export const buildTrendSeries = (weeks = 10): TrendPoint[] => {
  const grouped = new Map<
    string,
    { throughput: number; uptime: number[]; incidents: number; nps: number[] }
  >();

  operationsDataset.forEach((point) => {
    const weekLabel = dayjs(point.timestamp).startOf("week").format("MMM DD");
    const bucket = grouped.get(weekLabel) ?? {
      throughput: 0,
      uptime: [],
      incidents: 0,
      nps: [],
    };
    bucket.throughput += point.ordersServed;
    bucket.uptime.push(point.uptime);
    bucket.incidents += point.incidents;
    bucket.nps.push(point.nps);
    grouped.set(weekLabel, bucket);
  });

  return Array.from(grouped.entries())
    .slice(-weeks)
    .map(([week, metrics]) => ({
      week,
      throughput: metrics.throughput,
      uptime: parseFloat(average(metrics.uptime).toFixed(2)),
      incidents: metrics.incidents,
      satisfaction: parseFloat(average(metrics.nps).toFixed(1)),
    }));
};

export const buildHeatmap = (): HeatmapCell[] => {
  const grouped = new Map<
    string,
    {
      facility: HeatmapCell["facility"];
      shift: HeatmapCell["shift"];
      demand: number[];
      util: number[];
    }
  >();

  operationsDataset.forEach((point) => {
    const key = `${point.facility}-${point.shift}`;
    const bucket = grouped.get(key) ?? {
      facility: point.facility,
      shift: point.shift,
      demand: [],
      util: [],
    };
    bucket.demand.push(point.ordersServed);
    bucket.util.push(point.uptime);
    grouped.set(key, bucket);
  });

  return Array.from(grouped.values()).map((entry) => ({
    facility: entry.facility,
    shift: entry.shift,
    demandScore: parseFloat(
      (average(entry.demand) / Math.max(...entry.demand)).toFixed(2),
    ),
    utilization: parseFloat(average(entry.util).toFixed(2)),
  }));
};

export const buildAlerts = (): AlertInsight[] => {
  const latestWindow = getRecentData(1);
  const alerts = latestWindow
    .filter((point) => point.incidents >= 3 || point.uptime < 95)
    .slice(0, 5)
    .map((point, index) => ({
      id: `alert-${point.id}`,
      title: `${point.facility} ${point.shift} spike`,
      severity: point.incidents >= 4 ? "critical" : "high",
      detail: `Detected ${point.incidents} interruptions for ${point.robotModel} handling ${point.vertical.toLowerCase()} loads.`,
      owner: index % 2 === 0 ? "Seoul Reliability Pod" : "US Fleet Ops",
      etaHours: 12 + index * 4,
    }));

  if (!alerts.length) {
    alerts.push({
      id: "alert-stable",
      title: "No blocking incidents",
      severity: "low",
      detail: "Fleet within guardrails the last seven days.",
      owner: "Universe Guardian",
      etaHours: 0,
    });
  }

  return alerts;
};

export const composeCurationResponse = (): CurationResponsePayload => ({
  kpis: curateKpis(),
  trend: buildTrendSeries(12),
  heatmap: buildHeatmap(),
  alerts: buildAlerts(),
  knowledge: knowledgeBase,
  financials: financialSnapshots,
  apiSurfaces,
  trainingPlans: assembleTrainingPlans(),
});
