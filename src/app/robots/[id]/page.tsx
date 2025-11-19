import { notFound } from "next/navigation";
import { getRobotById } from "@/lib/robotData";
import { RobotDetailView } from "@/components/robots/RobotDetailView";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15+ requires awaiting params
  const { id } = await params;
  const robot = getRobotById(id);

  if (!robot) {
    notFound();
  }

  return <RobotDetailView robot={robot} />;
}

