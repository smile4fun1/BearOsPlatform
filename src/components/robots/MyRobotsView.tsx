'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, MapPin, Battery, Clock, AlertTriangle, ChevronRight,
  Building2, Plus, Search, QrCode, ScanLine, Activity,
  CheckCircle, WifiOff, BatteryCharging, Wrench, Filter, X, Loader2
} from 'lucide-react';
import { useRole } from '@/lib/roleContext';
import { 
  userLocations, 
  Location, 
  getRobotsForLocation, 
  getUserStats,
  locationTypeLabels,
  getLocationForRobot 
} from '@/lib/locationData';
import { Robot, getRobotImage } from '@/lib/robotData';
import Image from 'next/image';
import { RobotQRBadge } from './RobotQRCode';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Footer } from '@/components/Footer';

dayjs.extend(relativeTime);

// Lazy-loaded robot grid component
function LazyRobotGrid({ robots, getStatusColor, getStatusIcon }: { 
  robots: Robot[], 
  getStatusColor: (status: Robot["status"]) => string,
  getStatusIcon: (status: Robot["status"]) => JSX.Element 
}) {
  const ROBOTS_PER_LOAD = 20; // 5 rows * 4 columns
  const [displayedCount, setDisplayedCount] = useState(ROBOTS_PER_LOAD);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Reset displayed count when robots change
  useEffect(() => {
    setDisplayedCount(ROBOTS_PER_LOAD);
  }, [robots]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && displayedCount < robots.length && !isLoading) {
          setIsLoading(true);
          setTimeout(() => {
            setDisplayedCount(prev => Math.min(prev + ROBOTS_PER_LOAD, robots.length));
            setIsLoading(false);
          }, 200);
        }
      },
      { threshold: 0.1, rootMargin: '150px' }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [displayedCount, robots.length, isLoading]);

  const displayedRobots = robots.slice(0, displayedCount);
  const hasMore = displayedCount < robots.length;

  return (
    <>
      <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedRobots.map((robot, index) => {
          const location = getLocationForRobot(robot.id);
          return (
            <motion.div
              key={robot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min((index % ROBOTS_PER_LOAD) * 0.02, 0.4) }}
            >
              <Link
                href={`/robots/${robot.id}`}
                className="group block bear-glass-card p-5 relative overflow-hidden h-full flex flex-col"
              >
                {/* Robot Image Background */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                  <Image
                    src={getRobotImage(robot.model)}
                    alt={robot.model}
                    width={128}
                    height={128}
                    className="object-contain"
                  />
                </div>
                
                {/* Robot Header */}
                <div className="relative flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bear-blue/20 to-purple-500/10 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-bear-blue/30 transition-colors">
                      <Image
                        src={getRobotImage(robot.model)}
                        alt={robot.model}
                        width={40}
                        height={40}
                        className="object-contain group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-bear-blue transition-colors">
                        {robot.name}
                      </div>
                      <div className="text-xs text-white/50 font-mono">{robot.serialNumber}</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-bear-blue/20 transition-colors">
                    <QrCode className="h-4 w-4 text-white/40 group-hover:text-bear-blue transition-colors" />
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`mb-4 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold ${getStatusColor(robot.status)}`}>
                  {getStatusIcon(robot.status)}
                  <span className="capitalize">{robot.status}</span>
                </div>

                {/* Quick Stats */}
                <div className="space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Model</span>
                    <span className="font-medium text-bear-blue">{robot.model}</span>
                  </div>

                  {location && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-white/60">
                        <MapPin className="h-3 w-3" />
                        Location
                      </span>
                      <span className="truncate font-medium text-right max-w-[140px]" title={location.name}>
                        {location.city}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-white/60">
                      <Battery className="h-3 w-3" />
                      Battery
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            robot.battery > 60 ? "bg-emerald-400" : 
                            robot.battery > 30 ? "bg-amber-400" : "bg-rose-400"
                          }`}
                          style={{ width: `${robot.battery}%` }}
                        />
                      </div>
                      <span className={`font-semibold text-xs ${
                        robot.battery > 60 ? "text-emerald-400" : 
                        robot.battery > 30 ? "text-amber-400" : "text-rose-400"
                      }`}>
                        {robot.battery}%
                      </span>
                    </div>
                  </div>

                  <div className="h-12 flex items-center">
                    {robot.errors.length > 0 && (
                      <div className="flex items-start gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 p-2 text-xs text-rose-400 w-full">
                        <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2 flex-1">{robot.errors[0].message}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 mt-auto border-t border-white/5 text-xs text-white/40 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    Last seen: {dayjs(robot.lastSeen).fromNow()}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Loading indicator and intersection observer target */}
      {hasMore && (
        <div ref={observerRef} className="py-8 flex justify-center">
          {isLoading && (
            <div className="flex items-center gap-2 text-bear-blue">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Loading more robots...</span>
            </div>
          )}
        </div>
      )}

      {/* Count indicator */}
      {robots.length > ROBOTS_PER_LOAD && (
        <div className="py-4 text-center text-xs text-gray-500">
          Showing {displayedCount} of {robots.length} robots
        </div>
      )}
    </>
  );
}

export function MyRobotsView() {
  const { role, getRoleLabel } = useRole();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanModal, setShowScanModal] = useState(false);
  
  const stats = getUserStats();
  
  // Get robots for selected location or all
  const displayRobots = useMemo(() => {
    let robots = selectedLocation 
      ? getRobotsForLocation(selectedLocation)
      : userLocations.flatMap(l => getRobotsForLocation(l.id));
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      robots = robots.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.serialNumber.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query)
      );
    }
    
    return robots;
  }, [selectedLocation, searchQuery]);

  const getStatusColor = (status: Robot["status"]) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "idle": return "bg-sky-500/20 text-sky-400 border-sky-500/30";
      case "charging": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "maintenance": return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
      case "offline": return "bg-white/10 text-white/50 border-white/20";
      case "error": return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default: return "bg-white/10 text-white/50";
    }
  };

  const getStatusIcon = (status: Robot["status"]) => {
    switch (status) {
      case "active": return <Activity className="h-3.5 w-3.5" />;
      case "idle": return <Clock className="h-3.5 w-3.5" />;
      case "charging": return <BatteryCharging className="h-3.5 w-3.5" />;
      case "maintenance": return <Wrench className="h-3.5 w-3.5" />;
      case "offline": return <WifiOff className="h-3.5 w-3.5" />;
      case "error": return <AlertTriangle className="h-3.5 w-3.5" />;
      default: return <Bot className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] text-white flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto overflow-x-hidden mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-12 w-full">
        {/* Header with decorative elements */}
        <div className="relative mb-6 sm:mb-8 lg:mb-12">
          {/* Decorative blur circles - BearEmeaSupport style */}
          <div className="absolute -top-20 -right-20 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-bear-blue/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-20 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-col gap-4 sm:gap-6">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-bear-blue mb-2 sm:mb-4">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-semibold uppercase tracking-wider">{getRoleLabel(role)}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mb-2 sm:mb-4">
                My Robots
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-white/60 max-w-2xl">
                Monitor robots across your locations. 
                <span className="text-white font-medium"> {stats.totalRobots}</span> robots at 
                <span className="text-white font-medium"> {stats.totalLocations}</span> sites.
              </p>
            </div>
            
            {/* Quick Actions - Stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setShowScanModal(true)}
                className="btn-secondary justify-center text-sm sm:text-base"
              >
                <ScanLine className="h-4 w-4 sm:h-5 sm:w-5" />
                Scan QR
              </button>
              <Link href="/knowledge" className="btn-primary justify-center text-sm sm:text-base">
                Get Help
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview - BearEmeaSupport Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bear-stat-card p-3 sm:p-4 lg:p-5"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="p-1.5 sm:p-2 rounded-full bg-emerald-500/20">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
              </div>
              <span className="text-xs sm:text-sm text-white/60">Online</span>
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-400">{stats.activeRobots}</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bear-stat-card p-3 sm:p-4 lg:p-5"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="p-1.5 sm:p-2 rounded-full bg-amber-500/20">
                <BatteryCharging className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" />
              </div>
              <span className="text-xs sm:text-sm text-white/60">Charging</span>
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-400">{stats.chargingRobots}</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bear-stat-card p-3 sm:p-4 lg:p-5"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="p-1.5 sm:p-2 rounded-full bg-rose-500/20">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-rose-400" />
              </div>
              <span className="text-xs sm:text-sm text-white/60">Issues</span>
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-rose-400">{stats.issueRobots}</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bear-stat-card p-3 sm:p-4 lg:p-5"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="p-1.5 sm:p-2 rounded-full bg-bear-blue/20">
                <Battery className="h-3 w-3 sm:h-4 sm:w-4 text-bear-blue" />
              </div>
              <span className="text-xs sm:text-sm text-white/60">Avg Battery</span>
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-bear-blue">{stats.averageBattery}%</div>
          </motion.div>
        </div>

        {/* Location Filter & Search */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 overflow-x-hidden">
          {/* Location Pills - Wrapped */}
          <div className="flex gap-2 flex-wrap pb-2 overflow-x-hidden">
            <button
              onClick={() => setSelectedLocation(null)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                selectedLocation === null 
                  ? 'bg-bear-blue text-white shadow-lg shadow-bear-blue/30' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              All Locations
            </button>
            {userLocations.map(location => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location.id)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${
                  selectedLocation === location.id 
                    ? 'bg-bear-blue text-white shadow-lg shadow-bear-blue/30' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{location.name.split(' ').slice(0, 2).join(' ')}</span>
                <span className="sm:hidden">{location.city}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] sm:text-xs">{location.robotCount}</span>
              </button>
            ))}
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search robots..."
              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-white/40 outline-none transition-all focus:bg-white/10 focus:border-bear-blue/50"
            />
          </div>
        </div>

        {/* Robots Grid - Lazy Loaded */}
        <div className="overflow-x-hidden">
          <LazyRobotGrid 
            robots={displayRobots}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />

          {displayRobots.length === 0 && (
            <div className="py-20 text-center">
              <Bot className="mx-auto h-16 w-16 text-white/20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No robots found</h3>
              <p className="text-white/50">Try adjusting your search or location filter</p>
            </div>
          )}
        </div>

        {/* Locations Grid - Below robots */}
        <section className="mt-16 overflow-x-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Locations</h2>
            <button className="btn-tertiary">
              <Plus className="h-4 w-4" />
              Add Location
            </button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userLocations.map((location, index) => {
              const locationRobots = getRobotsForLocation(location.id);
              const onlineCount = locationRobots.filter(r => r.status === 'active' || r.status === 'idle').length;
              const issueCount = locationRobots.filter(r => r.status === 'error' || r.status === 'offline').length;
              
              return (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedLocation(location.id)}
                  className="bear-glass-card p-6 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-bear-blue/20">
                      <Building2 className="h-6 w-6 text-bear-blue" />
                    </div>
                    <span className="px-2 py-1 rounded-full bg-white/5 text-xs text-white/60 border border-white/10">
                      {locationTypeLabels[location.type]}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-white mb-1">{location.name}</h3>
                  <p className="text-sm text-white/50 mb-4">{location.city}, {location.country}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Bot className="h-4 w-4 text-white/40" />
                      <span className="text-white/60">{location.robotCount} robots</span>
                    </div>
                    {onlineCount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-emerald-400">{onlineCount} online</span>
                      </div>
                    )}
                    {issueCount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                        <span className="text-rose-400">{issueCount} issues</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
      
      <Footer />

      {/* Scan QR Modal */}
      <AnimatePresence>
        {showScanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowScanModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1f36] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-bear-blue/20">
                    <ScanLine className="w-5 h-5 text-bear-blue" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Scan Robot QR Code</h3>
                    <p className="text-xs text-gray-400">Quick access to robot details</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowScanModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="bg-black/40 rounded-2xl p-8 mb-6 border border-white/10 text-center">
                <QrCode className="w-16 h-16 mx-auto text-white/20 mb-4" />
                <p className="text-sm text-gray-400">Camera scanning coming soon</p>
                <p className="text-xs text-gray-500 mt-2">Use your phone camera to scan robot QR codes</p>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Or select a robot from your locations above
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
