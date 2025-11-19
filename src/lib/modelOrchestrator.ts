import dayjs from "dayjs";
import { knowledgeBase, operationsDataset } from "./mockData";
import { ModelBlueprint, TrainingMilestone, TrainingPlan } from "./types";

const totalTokens = (approxDocs: number, avgTokensPerDoc = 1200) =>
  `${Math.round((approxDocs * avgTokensPerDoc) / 1_000_000)}M tokens`;

const ursaMinorBlueprint: ModelBlueprint = {
  id: "ursa-minor-40b",
  name: "Ursa Minor",
  size: "70B",
  baseModel: "Llama 3.1 40B",
  objective:
    "Real-time assistant for Bear Universe operators—navigate dashboards, modify robot parameters, and execute commands with permission-based controls.",
  datasets: [
    "Bear Universe documentation",
    "Robot parameter schemas",
    "Command execution logs",
    "User interaction patterns",
  ],
  tokens: totalTokens(180_000),
  alignment: ["Tool-calling RLHF", "Permission-aware guardrails", "Context retention"],
  evaluation: [
    "Command accuracy",
    "Parameter validation",
    "Context coherence",
  ],
  deploymentTarget: "Universe chat interface + interactive assistant",
  currentPhase: "offline-eval",
};

const ursaMajorBlueprint: ModelBlueprint = {
  id: "ursa-major-70b",
  name: "Ursa Major",
  size: "70B",
  baseModel: "Llama 3.1 70B",
  objective:
    "Analyze Bear fleet telemetry, surface KPIs, auto-draft diagnostic briefs, and orchestrate multi-agent task delegation.",
  datasets: [
    "Fleet telemetry lake (anonymized)",
    "Mission sensor bundles",
    "Ops postmortems 2023-2025",
    "Agent coordination protocols",
  ],
  tokens: totalTokens(680_000),
  alignment: ["Goal-conditioned RLHF", "Toolformer call graph", "Agent orchestration", "Guardrails"],
  evaluation: [
    "Telemetry summarization",
    "Fleet incident triage",
    "Multi-agent coordination",
    "Regression harness",
  ],
  deploymentTarget: "Universe KPI panels + automation planners + task delegation",
  currentPhase: "ready",
};

const bearLoreBlueprint: ModelBlueprint = {
  id: "grizzly-lore-120b",
  name: "Grizzly",
  size: "120B",
  baseModel: "Mixtral 8x22B",
  objective:
    "Act as the institutional memory for Bear Robotics—answer anything about products, partners, compliance, or brand voice.",
  datasets: [
    "Bearrobotics.ai public site crawl",
    "Partner enablement wiki",
    "API docs & release notes",
    "CEO + field leadership townhalls",
  ],
  tokens: totalTokens(420_000),
  alignment: [
    "Constitutional policy tuned for Korean + English",
    "Long-horizon retrieval",
  ],
  evaluation: ["Brand tone TTS", "Compliance Q/A", "Product marketing briefs"],
  deploymentTarget: "Universe knowledge graph + customer copilots",
  currentPhase: "alignment",
};

const milestonesFor = (
  stages: Array<TrainingMilestone["label"]>,
  currentStage: TrainingMilestone["label"],
): TrainingMilestone[] =>
  stages.map((label) => ({
    label,
    status:
      label === currentStage
        ? "running"
        : stages.indexOf(label) < stages.indexOf(currentStage)
          ? "complete"
          : "pending",
    summary:
      label === "Dataset Curation"
        ? "Filtering sensitive PII, deduping missions, writing eval harnesses."
        : label === "Pretraining & Adaptation"
          ? "Warm-started on base weights, mixing mission-trace tokens."
          : label === "Alignment"
            ? "Preference optimization with ops SMEs + automated reward models."
            : "Shadow evals on golden datasets before exposure to crews.",
  }));

const validationScore = (model: ModelBlueprint) => {
  const telemetryCoverage =
    model.size === "70B"
      ? 0.91 + Math.random() * 0.04
      : 0.88 + Math.random() * 0.05;
  return parseFloat(telemetryCoverage.toFixed(3));
};

const hallucinationRate = (model: ModelBlueprint) => {
  const base = model.size === "70B" ? 0.018 : 0.024;
  const noise = Math.random() * 0.004;
  return parseFloat((base + noise).toFixed(3));
};

export const assembleTrainingPlans = (): TrainingPlan[] => {
  const telemetryDocs = operationsDataset.length;
  const knowledgeDocs = knowledgeBase.length * 120; // treat as aggregated collections

  const minorMilestones = milestonesFor(
    [
      "Dataset Curation",
      "Pretraining & Adaptation",
      "Alignment",
      "Offline Evaluation",
    ],
    "Offline Evaluation",
  );

  const majorMilestones = milestonesFor(
    [
      "Dataset Curation",
      "Pretraining & Adaptation",
      "Alignment",
      "Offline Evaluation",
    ],
    "Offline Evaluation",
  );

  const loreMilestones = milestonesFor(
    [
      "Dataset Curation",
      "Pretraining & Adaptation",
      "Alignment",
      "Offline Evaluation",
    ],
    "Alignment",
  );

  return [
    {
      model: {
        ...ursaMinorBlueprint,
        tokens: totalTokens(180_000, 800),
      },
      milestones: minorMilestones,
      telemetry: {
        lastRun: dayjs().subtract(2, "hour").toISOString(),
        validationScore: validationScore(ursaMinorBlueprint),
        hallucinationRate: hallucinationRate(ursaMinorBlueprint),
      },
    },
    {
      model: {
        ...ursaMajorBlueprint,
        tokens: totalTokens(telemetryDocs, 1800),
      },
      milestones: majorMilestones,
      telemetry: {
        lastRun: dayjs().subtract(1, "day").toISOString(),
        validationScore: validationScore(ursaMajorBlueprint),
        hallucinationRate: hallucinationRate(ursaMajorBlueprint),
      },
    },
    {
      model: {
        ...bearLoreBlueprint,
        tokens: totalTokens(knowledgeDocs, 900),
      },
      milestones: loreMilestones,
      telemetry: {
        lastRun: dayjs().subtract(3, "day").toISOString(),
        validationScore: validationScore(bearLoreBlueprint),
        hallucinationRate: hallucinationRate(bearLoreBlueprint),
      },
    },
  ];
};
