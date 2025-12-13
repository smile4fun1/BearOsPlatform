'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Users, 
  ChevronDown, 
  Search, 
  Globe, 
  ShieldCheck, 
  Briefcase,
  ExternalLink,
  Bot
} from 'lucide-react';
import { partners, getPartnerStats } from '@/lib/partnerData';
import { AnimatedCounter } from '@/components/AnimatedCounter';

export function AdminPartnerView() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Partner Network</h1>
          <p className="text-gray-400">Manage partnerships, contracts, and fleet allocations.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search partners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-bear-blue/50 transition-colors"
          />
        </div>
      </header>

      {/* Network Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-gray-400">Total Partners</span>
          </div>
          <div className="text-3xl font-bold text-white">
            <AnimatedCounter value={partners.length} />
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-gray-400">Active Contracts</span>
          </div>
          <div className="text-3xl font-bold text-white">
            <AnimatedCounter value={partners.filter(p => p.status === 'Active').length} />
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-bear-blue/20 text-bear-blue">
              <Globe className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-gray-400">Global Reach</span>
          </div>
          <div className="text-3xl font-bold text-white">
            <AnimatedCounter value={new Set(partners.map(p => p.region)).size} /> Regions
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Bot className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-gray-400">Partner Fleet</span>
          </div>
          <div className="text-3xl font-bold text-white">
            <AnimatedCounter value={partners.reduce((acc, p) => acc + (getPartnerStats(p.id)?.totalRobots || 0), 0)} />
          </div>
        </div>
      </div>

      {/* Partners List */}
      <div className="space-y-4">
        {filteredPartners.map((partner) => {
          const stats = getPartnerStats(partner.id);
          const isExpanded = expandedId === partner.id;

          return (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isExpanded 
                  ? 'bg-white/10 border-bear-blue/50 shadow-lg shadow-bear-blue/10' 
                  : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
              }`}
            >
              {/* Header Row */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : partner.id)}
                className="p-5 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                    isExpanded ? 'bg-bear-blue text-white' : 'bg-white/10 text-gray-400'
                  }`}>
                    {partner.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{partner.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {partner.region}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> {partner.contractType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 md:w-auto w-full border-t md:border-none border-white/10 pt-4 md:pt-0">
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-gray-500 text-xs uppercase tracking-wider">Sites</div>
                      <div className="font-bold text-white">{stats?.totalSites || 0}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xs uppercase tracking-wider">Robots</div>
                      <div className="font-bold text-white">{stats?.totalRobots || 0}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xs uppercase tracking-wider">Issues</div>
                      <div className={`font-bold ${stats?.issues ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {stats?.issues || 0}
                      </div>
                    </div>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    partner.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    partner.status === 'Pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                    'bg-white/5 border-white/10 text-gray-400'
                  }`}>
                    {partner.status}
                  </div>

                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180 text-bear-blue' : ''
                  }`} />
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10 bg-black/20"
                  >
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Contact Info */}
                      <div>
                        <h4 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">Contact Details</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-gray-400">Primary Contact</span>
                            <span className="text-white font-medium">{partner.contactPerson}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-gray-400">Email</span>
                            <span className="text-white font-medium">{partner.email}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-gray-400">Joined Date</span>
                            <span className="text-white font-medium">{partner.joinedDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Sites List */}
                      <div className="lg:col-span-2">
                        <h4 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">Managed Sites</h4>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {partner.sites.length > 0 ? partner.sites.map((site) => (
                            <div key={site.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-white">{site.name}</div>
                                <span className={`w-2 h-2 rounded-full ${
                                  site.status === 'Healthy' ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'
                                }`} />
                              </div>
                              <div className="text-xs text-gray-400 mb-3">{site.address}</div>
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 text-bear-blue">
                                  <Bot className="h-3 w-3" />
                                  <span className="font-medium">{site.deployedRobots.length} Robots</span>
                                </div>
                                <button className="flex items-center gap-1 text-white/40 hover:text-white transition-colors">
                                  View <ExternalLink className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          )) : (
                            <div className="col-span-2 text-center py-8 text-gray-500 italic bg-white/5 rounded-xl border border-white/5 border-dashed">
                              No sites assigned yet.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="mb-10" />
    </div>
  );
}

