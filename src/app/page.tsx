'use client';

import { useRole } from '@/lib/roleContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bot, 
  MessageSquare, 
  BookOpen, 
  Activity, 
  Zap, 
  ArrowRight,
  ShieldAlert,
  FileText,
  Search,
  CheckCircle,
  HelpCircle,
  Building2,
  Battery,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { getUserRobots, getUserStats } from '@/lib/locationData';
import { Footer } from '@/components/Footer';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function Dashboard() {
  const { role, getRoleLabel } = useRole();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/knowledge?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/knowledge');
    }
  };

  const isInternalUser = role === 'internal_admin' || role === 'internal_rfe';
  const isPartnerOrCustomer = role === 'partner_qcom' || role === 'customer_manager';
  
  // Get user's robots for the quick access section
  const myRobots = getUserRobots().slice(0, 4);
  const userStats = getUserStats();

  // Metrics for different roles
  const metrics = {
    internal_admin: [
      { label: 'Active Fleet', value: 1247, suffix: '', icon: Bot, color: 'text-bear-blue', bgColor: 'bg-bear-blue/20' },
      { label: 'System Uptime', value: 99.9, suffix: '%', icon: Activity, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
      { label: 'Active Alerts', value: 3, suffix: '', icon: ShieldAlert, color: 'text-rose-400', bgColor: 'bg-rose-500/20', hasAlert: true },
      { label: 'AI Requests', value: 45.2, suffix: 'k', icon: Zap, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    ],
    internal_rfe: [
      { label: 'Assigned Robots', value: 12, suffix: '', icon: Bot, color: 'text-bear-blue', bgColor: 'bg-bear-blue/20' },
      { label: 'Open Tickets', value: 4, suffix: '', icon: FileText, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
      { label: 'Avg Response', value: 14, suffix: 'm', icon: Activity, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
      { label: 'Today\'s Tasks', value: 8, suffix: '', icon: CheckCircle, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    ],
    partner_qcom: [
      { label: 'Locations', value: userStats.totalLocations, suffix: '', icon: Building2, color: 'text-bear-blue', bgColor: 'bg-bear-blue/20' },
      { label: 'Robots Online', value: userStats.activeRobots, suffix: `/${userStats.totalRobots}`, icon: Bot, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
      { label: 'Issues', value: userStats.issueRobots, suffix: '', icon: AlertTriangle, color: 'text-rose-400', bgColor: 'bg-rose-500/20', hasAlert: userStats.issueRobots > 0 },
      { label: 'Avg Battery', value: userStats.averageBattery, suffix: '%', icon: Battery, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
    ],
    customer_manager: [
      { label: 'Locations', value: userStats.totalLocations, suffix: '', icon: Building2, color: 'text-bear-blue', bgColor: 'bg-bear-blue/20' },
      { label: 'Robots Online', value: userStats.activeRobots, suffix: `/${userStats.totalRobots}`, icon: Bot, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
      { label: 'Issues', value: userStats.issueRobots, suffix: '', icon: AlertTriangle, color: 'text-rose-400', bgColor: 'bg-rose-500/20', hasAlert: userStats.issueRobots > 0 },
      { label: 'Avg Battery', value: userStats.averageBattery, suffix: '%', icon: Battery, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
    ]
  };

  const currentMetrics = metrics[role] || metrics.internal_admin;

  return (
    <div className="h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto relative">
        <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-[1600px] mx-auto w-full pb-24 lg:pb-10">
      {/* BearEmeaSupport Style Decorative Elements */}
      <div className="fixed top-20 right-0 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-bear-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-0 w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] bg-purple-500/3 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative">
        {/* Hero Header - BearEmeaSupport Inspired */}
        <header className="mb-6 sm:mb-8 lg:mb-10 relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0a0f1c] via-[#111827] to-[#0a0f1c] p-5 sm:p-8 lg:p-12 border border-white/10 shadow-2xl">
          <div className="relative z-10 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-bear-blue/20 border border-bear-blue/30 text-[10px] sm:text-xs font-bold text-bear-blue uppercase tracking-wider">
                  {getRoleLabel(role)}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-2 sm:mb-4 tracking-tight">
                {getGreeting()}, <span className="text-gradient">George</span>.
              </h1>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl font-medium leading-relaxed">
                {isPartnerOrCustomer 
                  ? 'Monitor your robots and get instant support.'
                  : 'Your operational command center is ready.'}
              </p>
            </div>
            
            {/* Quick Action Buttons - BearEmeaSupport Style */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/robots" className="btn-primary text-center justify-center" style={{ minHeight: '48px' }}>
                <Bot className="w-5 h-5" />
                {isPartnerOrCustomer ? 'My Robots' : 'Fleet Overview'}
              </Link>
              <Link href="/knowledge" className="btn-secondary text-center justify-center">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                Get Help
              </Link>
            </div>
          </div>
          
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-bear-blue/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
        </header>

        {/* Metrics Grid - BearEmeaSupport Card Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
          {currentMetrics.map((metric, index) => (
            <div
              key={metric.label}
              className="bear-glass-card p-4 sm:p-5 lg:p-6 group cursor-pointer min-h-[120px] sm:min-h-[140px] flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-2 sm:mb-3">
                <div className={`p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl ${metric.bgColor} ${metric.color} group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                {metric.hasAlert && (
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.6)]" />
                )}
              </div>
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-0.5 sm:mb-1 tracking-tight">
                  <AnimatedCounter value={metric.value} />
                  <span className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-500 font-medium ml-0.5 sm:ml-1">{metric.suffix}</span>
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-400 truncate">{metric.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* My Robots Quick Access - For Partners & Customers */}
        {isPartnerOrCustomer && myRobots.length > 0 && (
          <section className="mb-6 sm:mb-8 lg:mb-10">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-bear-blue" />
                Quick Access
              </h2>
              <Link href="/robots" className="text-bear-blue text-xs sm:text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View All <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {myRobots.map((robot, index) => (
                <div
                  key={robot.id}
                >
                  <Link
                    href={`/robots/${robot.id}`}
                    className="block bear-glass-card p-4 sm:p-5 group h-full"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="p-2 rounded-lg bg-bear-blue/20 group-hover:bg-bear-blue/30 transition-colors flex-shrink-0">
                          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-bear-blue" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-white group-hover:text-bear-blue transition-colors text-sm sm:text-base truncate">
                            {robot.name}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-500 truncate">{robot.model}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-bear-blue group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] sm:text-xs font-medium ${
                        robot.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                        robot.status === 'error' ? 'bg-rose-500/20 text-rose-400' :
                        robot.status === 'charging' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-white/10 text-gray-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          robot.status === 'active' ? 'bg-emerald-400' :
                          robot.status === 'error' ? 'bg-rose-400 animate-pulse' :
                          robot.status === 'charging' ? 'bg-amber-400' :
                          'bg-gray-400'
                        }`} />
                        <span className="capitalize">{robot.status}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                        <Battery className="w-3 h-3" />
                        <span className={robot.battery < 30 ? 'text-rose-400' : 'text-gray-400'}>{robot.battery}%</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
          {/* Main Action Card - Knowledge Base */}
          <div className="lg:col-span-2 bear-feature-card p-6 sm:p-7 lg:p-9 relative overflow-hidden group min-h-[300px] sm:min-h-[340px] flex flex-col">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="p-3 sm:p-3.5 lg:p-4 bg-bear-blue/20 rounded-xl shadow-lg shadow-bear-blue/10">
                    <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-bear-blue" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Knowledge Base</h2>
                </div>
                <p className="text-gray-400 mb-5 sm:mb-6 lg:mb-8 max-w-md text-sm sm:text-base lg:text-lg leading-relaxed">
                  {isPartnerOrCustomer 
                    ? 'Find answers and troubleshooting guides for your robots.'
                    : 'Instant answers for Servi Plus, Carti 100, and fleet management.'}
                </p>
                
                {/* Functional Search Bar */}
                <form onSubmit={handleSearch} className="max-w-xl mb-5 sm:mb-6 lg:mb-8">
                  <div className="relative group/search">
                    <div className="absolute inset-0 bg-gradient-to-r from-bear-blue/20 to-purple-500/20 rounded-xl sm:rounded-2xl opacity-0 group-hover/search:opacity-100 blur transition-opacity duration-300" />
                    <div className="relative bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-3 text-gray-400 text-sm sm:text-base focus-within:border-bear-blue/50 focus-within:bg-white/10 transition-all">
                      <Search className="w-5 h-5 sm:w-6 sm:h-6 text-bear-blue flex-shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for &quot;LIDAR error&quot; or &quot;robot won't start&quot;..."
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-500 text-sm sm:text-base"
                      />
                      {searchQuery && (
                        <button
                          type="submit"
                          className="flex-shrink-0 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-bear-blue hover:bg-bear-blue/80 text-white transition-all hover:scale-105 active:scale-95"
                        >
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/knowledge" className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-bear-blue to-bear-blue/80 hover:from-bear-blue/90 hover:to-bear-blue/70 text-white font-semibold text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl shadow-bear-blue/30">
                  Open Knowledge Base <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link href="/connect" className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Background Robot Image */}
            <div className="absolute right-0 bottom-0 w-48 sm:w-60 lg:w-72 h-48 sm:h-60 lg:h-72 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
               <Image 
                 src="/assets/Servi.png" 
                 alt="Servi Robot" 
                 width={288} 
                 height={288} 
                 className="object-contain translate-y-10 translate-x-10 transform group-hover:scale-105 transition-transform duration-500 w-full h-full"
               />
            </div>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
            <div 
              className="bear-glass-card p-5 sm:p-6 lg:p-7 group cursor-pointer min-h-[130px] sm:min-h-[140px] flex flex-col justify-between"
            >
              <Link href="/connect" className="block h-full flex flex-col justify-between">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 sm:p-3.5 lg:p-4 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors text-base sm:text-lg truncate">Team Connect</h3>
                    <p className="text-sm text-gray-400 truncate">3 Unread Messages</p>
                  </div>
                </div>
                <div className="text-emerald-400 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Open Channel <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>

            <div className="bear-glass-card p-5 sm:p-6 lg:p-7 group cursor-pointer min-h-[130px] sm:min-h-[140px] flex flex-col justify-between">
              <Link href="/robots" className="block h-full flex flex-col justify-between">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 sm:p-3.5 lg:p-4 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                    <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors text-base sm:text-lg truncate">
                      {isPartnerOrCustomer ? 'My Robots' : 'Fleet Status'}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {isPartnerOrCustomer ? `${userStats.activeRobots} Online` : '99.9% Uptime'}
                    </p>
                  </div>
                </div>
                <div className="text-purple-400 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  {isPartnerOrCustomer ? 'View Robots' : 'View Telemetry'} <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>

            {isPartnerOrCustomer && (
              <div className="bear-glass-card p-5 sm:p-6 lg:p-7 group cursor-pointer sm:col-span-2 lg:col-span-1 min-h-[130px] sm:min-h-[140px] flex flex-col justify-between">
                <Link href="/robots" className="block h-full flex flex-col justify-between">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 sm:p-3.5 lg:p-4 rounded-xl bg-bear-blue/20 text-bear-blue group-hover:scale-110 transition-transform">
                      <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-white group-hover:text-bear-blue transition-colors text-base sm:text-lg truncate">My Locations</h3>
                      <p className="text-sm text-gray-400 truncate">{userStats.totalLocations} Sites</p>
                    </div>
                  </div>
                  <div className="text-bear-blue text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Manage Locations <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Help Topics - BearEmeaSupport Style */}
        <section className="mb-6 sm:mb-8 lg:mb-10">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-bear-blue" />
            Common Questions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {['Robot Won\'t Start', 'Connection Issues', 'Maintenance Guide'].map((topic, i) => (
              <Link href="/knowledge" key={topic}>
                <div 
                  className="bear-glass-card p-5 sm:p-6 flex items-center justify-between group cursor-pointer h-full min-h-[70px] sm:min-h-[80px]"}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-bear-blue/10 group-hover:bg-bear-blue/20 transition-colors flex-shrink-0">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-bear-blue transition-colors" />
                    </div>
                    <span className="font-semibold text-gray-200 group-hover:text-white transition-colors text-sm sm:text-base lg:text-lg truncate">{topic}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-bear-blue opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 flex-shrink-0 hidden sm:block" />
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}


