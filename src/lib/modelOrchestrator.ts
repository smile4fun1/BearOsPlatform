import dayjs from "dayjs";
import { knowledgeBase, operationsDataset } from "./mockData";
import { ModelBlueprint, TrainingMilestone, TrainingPlan } from "./types";

const totalTokens = (approxDocs: number, avgTokensPerDoc = 1200) =>
  `${Math.round((approxDocs * avgTokensPerDoc) / 1_000_000)}M tokens`;

const dataAtlasBlueprint: ModelBlueprint = {
  id: "ursa-major-70b",
  name: "Ursa Major Data Atlas",
  size: "70B",
  baseModel: "Llama 3.1 70B",
  objective:
    "Summarize Bear fleet telemetry, surface KPIs, and auto-draft diagnostic briefs.",
  datasets: [
    "Fleet telemetry lake (anonymized)",
    "Mission sensor bundles",
    "Ops postmortems 2023-2025",
  ],
  tokens: totalTokens(680_000),
  alignment: ["Goal-conditioned RLHF", "Toolformer call graph", "Guardrails"],
  evaluation: [
    "Telemetry summarization",
    "Fleet incident triage",
    "Regression harness",
  ],
  deploymentTarget: "Universe KPI panels + automation planners",
  currentPhase: "alignment",
};

const bearLoreBlueprint: ModelBlueprint = {
  id: "aurora-lore-110b",
  name: "Aurora Bear Lore",
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
  currentPhase: "dataset-curation",
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

  const atlasMilestones = milestonesFor(
    [
      "Dataset Curation",
      "Pretraining & Adaptation",
      "Alignment",
      "Offline Evaluation",
    ],
    "Alignment",
  );

  const loreMilestones = milestonesFor(
    [
      "Dataset Curation",
      "Pretraining & Adaptation",
      "Alignment",
      "Offline Evaluation",
    ],
    "Dataset Curation",
  );

  return [
    {
      model: {
        ...dataAtlasBlueprint,
        tokens: totalTokens(telemetryDocs, 1800),
      },
      milestones: atlasMilestones,
      telemetry: {
        lastRun: dayjs().subtract(1, "day").toISOString(),
        validationScore: validationScore(dataAtlasBlueprint),
        hallucinationRate: hallucinationRate(dataAtlasBlueprint),
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
