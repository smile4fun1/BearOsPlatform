'use client';

import { useRole } from '@/lib/roleContext';
import { RobotsManagement } from "@/components/robots/RobotsManagement";
import { MyRobotsView } from "@/components/robots/MyRobotsView";

export const dynamic = 'force-dynamic';

export default function RobotsPage() {
  const { role } = useRole();
  
  // Internal users (Admin, RFE) see the full fleet management view
  // Partners and Customers see their own robots organized by location
  const isInternalUser = role === 'internal_admin' || role === 'internal_rfe';
  
  if (isInternalUser) {
    return <RobotsManagement />;
  }
  
  return <MyRobotsView />;
}
