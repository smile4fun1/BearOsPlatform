'use client';

import { LoadingState, RobotCardSkeleton } from '@/components/LoadingState';

export default function RobotsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] text-white">
      <main className="mx-auto max-w-[1600px] px-6 py-12 lg:px-10">
        {/* Header Skeleton */}
        <div className="mb-12 animate-pulse">
          <div className="h-6 bg-white/10 rounded w-32 mb-4" />
          <div className="h-12 bg-white/10 rounded w-64 mb-4" />
          <div className="h-5 bg-white/5 rounded w-96" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bear-glass-card p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <div className="h-4 bg-white/5 rounded w-16" />
              </div>
              <div className="h-8 bg-white/10 rounded w-12" />
            </div>
          ))}
        </div>

        {/* Robots Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <RobotCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
