import { NextResponse } from "next/server";
import { composeCurationResponse } from "@/lib/dataCurator";

export async function GET() {
  const payload = composeCurationResponse();
  return NextResponse.json(payload);
}
