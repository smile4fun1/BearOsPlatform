import OpenAI from "openai";
import { NextResponse } from "next/server";
import { composeCurationResponse } from "@/lib/dataCurator";

const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiClient = openaiApiKey
  ? new OpenAI({
      apiKey: openaiApiKey,
    })
  : null;

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const snapshot = composeCurationResponse();
  const baseInsight = [
    `Orders automated: ${snapshot.kpis[0]?.value ?? "NA"}`,
    `Uptime: ${snapshot.kpis.find((kpi) => kpi.id === "kpi-uptime")?.value ?? "NA"}`,
    `Active APIs: ${snapshot.apiSurfaces.length}`,
    `Training phases: ${snapshot.trainingPlans.map((plan) => `${plan.model.name} → ${plan.model.currentPhase}`).join(" | ")}`,
  ].join("\n");

  if (!openaiClient) {
    return NextResponse.json({
      content: `Mock universe insight based on latest data:\n\n${baseInsight}\n\nPrompt: ${prompt}`,
    });
  }

  try {
    const response = await openaiClient.responses.create({
      model: "gpt-4.1-mini",
      reasoning: { effort: "medium" },
      input: [
        {
          role: "system",
          content:
            "You are the Bear Universe orchestrator. Blend Korean hospitality context, KPI storytelling, and precise action items. Always cite at least one metric or training milestone.",
        },
        {
          role: "user",
          content: `Prompt: ${prompt}\n\nData Snapshot:\n${JSON.stringify(snapshot, null, 2)}`,
        },
      ],
    });

    const text = response.output_text?.join("\n").trim() ?? "No response.";
    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("OpenAI error", error);
    return NextResponse.json(
      {
        content:
          "The ChatGPT API call failed. Please ensure OPENAI_API_KEY is configured in your environment.",
      },
      { status: 500 },
    );
  }
}
