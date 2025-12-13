'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Bot, 
  AlertTriangle, 
  CheckCircle, 
  Battery, 
  ArrowRight,
  Wrench,
  Activity
} from 'lucide-react';
import { Partner, PartnerSite } from '@/lib/partnerData';
import { getRobotById } from '@/lib/robotData';
import { AnimatedCounter } from '@/components/AnimatedCounter';

export function PartnerDashboard({ partner }: { partner: Partner }) {
  // Aggregate data for the partner dashboard
  const totalRobots = partner.sites.reduce((acc, s) => acc + s.deployedRobots.length, 0);
  const activeIssues = partner.sites.reduce((acc, s) => {
    return acc + s.deployedRobots.filter(rid => {
      const r = getRobotById(rid);
      return r && (r.status === 'error' || r.battery < 20);
    }).length;
  }, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Partner Header */}
      <header>
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400 uppercase tracking-wide">
            Partner Portal
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400 font-medium">{partner.name}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Fleet Command Center
        </h1>
        <p className="text-gray-400 text-lg">
          Monitor your deployed fleet, manage service, and access advanced diagnostics.
        </p>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-bear-blue/30 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-bear-blue/20 text-bear-blue">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-gray-400">Active Sites</span>
          </div>
          <div className="text-3xl font-bold text-white">
            <AnimatedCounter value={partner.sites.length} />
          </div>
        </div>
        
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-bear-blue/30 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Bot className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-gray-400">Total Robots</span>
          </div>
          <div className="text-3xl font-bold text-white">
            <AnimatedCounter value={totalRobots} />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/30 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-gray-400">Attention Needed</span>
          </div>
          <div className={`text-3xl font-bold ${activeIssues > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            <AnimatedCounter value={activeIssues} />
          </div>
        </div>
      </div>

      {/* Sites & Robots Grid */}
      <section>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-bear-blue" />
          Site Operations
        </h2>
        
        <div className="space-y-6">
          {partner.sites.map((site) => (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden"
            >
              {/* Site Header */}
              <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{site.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{site.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                    site.status === 'Healthy' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    <Activity className="h-3 w-3" />
                    {site.status}
                  </div>
                </div>
              </div>

              {/* Robot Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {site.deployedRobots.map((robotId) => {
                  const robot = getRobotById(robotId);
                  if (!robot) return null;

                  return (
                    <Link 
                      key={robotId} 
                      href={`/robots/${robotId}`}
                      className="group block p-4 rounded-xl bg-black/20 hover:bg-bear-blue/10 border border-white/5 hover:border-bear-blue/30 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-bear-blue/20 text-white group-hover:text-bear-blue transition-colors">
                          <Bot className="h-5 w-5" />
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          robot.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                          robot.status === 'error' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-white/10 text-gray-400'
                        }`}>
                          {robot.status}
                        </div>
                      </div>
                      
                      <div className="font-bold text-white mb-1 group-hover:text-bear-blue transition-colors truncate">
                        {robot.name}
                      </div>
                      <div className="text-xs text-gray-500 mb-4 font-mono">{robot.model}</div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Battery className={`h-3 w-3 ${robot.battery < 20 ? 'text-rose-400' : 'text-emerald-400'}`} />
                          <span>{robot.battery}%</span>
                        </div>
                        <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-white/40 group-hover:text-bear-blue">
                          <span>Manage</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
                
                {site.deployedRobots.length === 0 && (
                  <div className="col-span-full py-8 text-center text-gray-500 italic">
                    No robots deployed at this location.
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RFE Access Promo */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Field Engineer Tools Unlocked</h3>
            <p className="text-indigo-200/80 text-sm max-w-xl">
              As a certified partner, you have full access to RFE diagnostic panels, sensor recalibration tools, and deep system logs for every robot in your fleet.
            </p>
          </div>
        </div>
        <Link 
          href="/knowledge"
          className="whitespace-nowrap px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold transition-all hover:scale-105"
        >
          View Technical Manuals
        </Link>
      </div>
    </div>
  );
}

