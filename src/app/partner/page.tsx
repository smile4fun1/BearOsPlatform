'use client';

import { useRole } from "@/lib/roleContext";
import { motion } from "framer-motion";
import { MapPin, Battery, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export default function PartnerPage() {
  const { role } = useRole();

  if (!['internal_admin', 'partner_qcom'].includes(role)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-400">Access Restricted</h2>
          <p className="text-gray-600">This portal is for authorized partners only.</p>
        </div>
      </div>
    );
  }

  const assignedSites = [
    { id: 1, name: 'Manchester Grand Hotel', status: 'Healthy', robots: 4, issues: 0 },
    { id: 2, name: 'London Tech Hub', status: 'Attention', robots: 12, issues: 2 },
    { id: 3, name: 'Birmingham Plaza', status: 'Healthy', robots: 6, issues: 0 },
  ];

  const tickets = [
    { id: 'T-1023', site: 'London Tech Hub', robot: 'Servi #442', issue: 'LIDAR Obstruction', priority: 'High', status: 'In Progress' },
    { id: 'T-1024', site: 'London Tech Hub', robot: 'Carti #881', issue: 'Wheel Noise', priority: 'Medium', status: 'Open' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400 uppercase tracking-wide">
            Qcom Partner Portal
          </span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Service Overview
        </h1>
        <p className="text-gray-400 text-lg">
          Manage your assigned sites and service requests.
        </p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-sm text-gray-400 mb-2">Assigned Sites</div>
          <div className="text-3xl font-bold text-white">3</div>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-sm text-gray-400 mb-2">Active Robots</div>
          <div className="text-3xl font-bold text-white">22</div>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-sm text-gray-400 mb-2">Open Tickets</div>
          <div className="text-3xl font-bold text-emerald-400">2</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sites List */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Assigned Sites</h2>
          <div className="space-y-4">
            {assignedSites.map((site) => (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{site.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{site.robots} Robots Deployed</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    site.status === 'Healthy' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    {site.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Active Tickets */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Active Service Tickets</h2>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-gray-500">{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ticket.priority === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 2h ago
                  </span>
                </div>
                
                <h3 className="text-white font-medium mb-1">{ticket.issue}</h3>
                <div className="text-sm text-gray-400 mb-4">{ticket.site} · {ticket.robot}</div>
                
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors">
                    Update Status
                  </button>
                  <button className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
            
            {tickets.length === 0 && (
              <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 border-dashed">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                <p className="text-gray-400">No active tickets</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

