// src/components/LazyComponents.tsx
import dynamic from 'next/dynamic';

// Reusable skeleton component
const Skeleton = ({ height = "h-64", className = "" }: { height?: string; className?: string }) => (
  <div className={`${height} w-full animate-pulse rounded-2xl bg-white/5 border border-white/5 ${className}`}>
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-bear-blue/30 border-t-bear-blue rounded-full animate-spin" />
    </div>
  </div>
);

export const LazyKPICardGrid = dynamic(
  () => import('@/components/universe/KPICardGrid').then(mod => mod.KPICardGrid),
  { 
    loading: () => <Skeleton height="h-40" />,
    ssr: true 
  }
);

export const LazyTrendPanel = dynamic(
  () => import('@/components/universe/TrendPanel').then(mod => mod.TrendPanel),
  { 
    loading: () => <Skeleton height="h-80" />,
    ssr: false 
  }
);

export const LazyInteractiveIncidentRadar = dynamic(
  () => import('@/components/incidents/InteractiveIncidentRadar').then(mod => mod.InteractiveIncidentRadar),
  { 
    loading: () => <Skeleton height="h-[500px]" />,
    ssr: true 
  }
);

export const LazyFleetPerformanceDashboard = dynamic(
  () => import('@/components/operations/FleetPerformanceDashboard').then(mod => mod.FleetPerformanceDashboard),
  { 
    loading: () => <Skeleton height="h-80" />,
    ssr: true 
  }
);

export const LazyRobotFleetStatus = dynamic(
  () => import('@/components/operations/RobotFleetStatus').then(mod => mod.RobotFleetStatus),
  { 
    loading: () => <Skeleton height="h-96" />,
    ssr: true 
  }
);

export const LazyInteractiveOpsTable = dynamic(
  () => import('@/components/operations/InteractiveOpsTable').then(mod => mod.InteractiveOpsTable),
  { 
    loading: () => <Skeleton height="h-96" />,
    ssr: true 
  }
);

