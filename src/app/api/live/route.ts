import { NextResponse } from "next/server";
import { generateLiveDataPoint, generateLiveMetrics, generateTrainingUpdate, generateApiMetrics } from "@/lib/dataPipeline";
import { composeCurationResponse } from "@/lib/dataCurator";

/**
 * Live Data API Endpoint
 * Returns real-time generated data for streaming updates
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";

  // Return different data types based on query parameter
  switch (type) {
    case "operations":
      return NextResponse.json({
        type: "operations",
        data: generateLiveDataPoint(),
      });

    case "metrics":
      return NextResponse.json({
        type: "metrics",
        data: generateLiveMetrics(),
      });

    case "training":
      return NextResponse.json({
        type: "training",
        data: generateTrainingUpdate(),
      });

    case "api":
      return NextResponse.json({
        type: "api",
        data: generateApiMetrics(),
      });

    case "all":
    default:
      // Return comprehensive live snapshot
      const universe = composeCurationResponse();
      return NextResponse.json({
        type: "all",
        timestamp: new Date().toISOString(),
        operations: generateLiveDataPoint(),
        metrics: generateLiveMetrics(),
        training: generateTrainingUpdate(),
        api: generateApiMetrics(),
        curated: {
          kpiCount: universe.kpis.length,
          latestKPI: universe.kpis[0],
          alertCount: universe.alerts.length,
          criticalAlerts: universe.alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length,
        },
      });
  }
}

/**
 * Server-Sent Events endpoint for real-time streaming
 * Access via /api/live/stream
 */
export async function POST() {
  // This would be used for long-polling or push notifications
  // For now, return the same data as GET
  return NextResponse.json({
    type: "snapshot",
    data: generateLiveMetrics(),
  });
}

