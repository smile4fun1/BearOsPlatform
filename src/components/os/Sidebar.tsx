'use client';

import { useRole } from '@/lib/roleContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  Bot, 
  Settings, 
  Box,
  LifeBuoy,
  Zap,
  Menu,
  X,
  Building2,
  QrCode,
  Activity
} from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userLocations } from '@/lib/locationData';

export function Sidebar() {
  const { role } = useRole();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');
  const isInternalUser = role === 'internal_admin' || role === 'internal_rfe';
  const isPartnerOrCustomer = role === 'partner_qcom' || role === 'customer_manager';

  const navItems = [
    { 
      label: 'Dashboard', 
      href: '/', 
      icon: LayoutDashboard,
      allowed: ['internal_admin', 'internal_rfe', 'partner_qcom', 'customer_manager']
    },
    { 
      label: isPartnerOrCustomer ? 'My Robots' : 'Fleet', 
      href: '/robots', 
      icon: Bot,
      allowed: ['internal_admin', 'internal_rfe', 'partner_qcom', 'customer_manager'],
      highlight: true
    },
    { 
      label: 'Connect', 
      href: '/connect', 
      icon: MessageSquare,
      allowed: ['internal_admin', 'internal_rfe', 'partner_qcom'] 
    },
    { 
      label: 'Knowledge', 
      href: '/knowledge', 
      icon: BookOpen,
      allowed: ['internal_admin', 'internal_rfe', 'partner_qcom', 'customer_manager'] 
    },
    { 
      label: 'Operations', 
      href: '/fleet', 
      icon: Activity,
      allowed: ['internal_admin', 'internal_rfe'] 
    },
    {
      label: 'Partner Portal',
      href: '/partner',
      icon: Box,
      allowed: ['internal_admin', 'partner_qcom']
    },
    { 
      label: 'AI Models', 
      href: '/ai-models', 
      icon: Zap,
      allowed: ['internal_admin'] 
    }
  ];

  const filteredNav = navItems.filter(item => item.allowed.includes(role));

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-bear-blue/30">
            <img 
              src="/download.png" 
              alt="Bear Robotics" 
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <span className="block font-bold text-xl tracking-tight text-white leading-none">BearOS</span>
            <span className="text-xs text-bear-blue font-semibold tracking-wide">PLATFORM</span>
          </div>
        </Link>
        
        <RoleSwitcher />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {filteredNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
              isActive(item.href)
                ? 'bg-bear-blue text-white shadow-lg shadow-bear-blue/30'
                : item.highlight 
                  ? 'text-gray-300 hover:text-white hover:bg-bear-blue/10 border border-transparent hover:border-bear-blue/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className={`w-5 h-5 transition-colors ${
              isActive(item.href) ? 'text-white' : item.highlight ? 'text-bear-blue' : 'text-gray-500 group-hover:text-white'
            }`} />
            {item.label}
          </Link>
        ))}

        {/* Quick Locations Section - For Partners & Customers */}
        {isPartnerOrCustomer && userLocations.length > 0 && (
          <>
            <div className="mt-8 mb-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Building2 className="w-3 h-3" />
              My Locations
            </div>
            
            {userLocations.slice(0, 3).map((location) => (
              <Link
                key={location.id}
                href={`/robots?location=${location.id}`}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="truncate">{location.city}</span>
                </div>
                <span className="text-xs text-gray-600 group-hover:text-gray-400">{location.robotCount}</span>
              </Link>
            ))}
          </>
        )}

        {/* Section Label */}
        <div className="mt-8 mb-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
          System
        </div>

        <Link
          href="/settings"
          onClick={() => setIsMobileOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            isActive('/settings')
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-5 h-5 text-gray-500" />
          Settings
        </Link>
        <Link
          href="/support"
          onClick={() => setIsMobileOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            isActive('/support')
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <LifeBuoy className={`w-5 h-5 ${isActive('/support') ? 'text-white' : 'text-gray-500'}`} />
          Help & Support
        </Link>
      </div>

      {/* Footer Status */}
      <div className="border-t border-white/5 bg-black/30 px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="text-sm text-gray-400 font-medium">All Systems Operational</span>
        </div>
        
        {/* Quick Scan Button */}
        {isPartnerOrCustomer && (
          <Link
            href="/robots"
            className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-bear-blue/10 border border-bear-blue/30 text-bear-blue text-sm font-medium hover:bg-bear-blue/20 transition-all"
          >
            <QrCode className="w-4 h-4" />
            Scan Robot QR
          </Link>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2.5 rounded-xl bg-[#0F1117] border border-white/10 text-white shadow-lg hover:bg-white/5 transition-colors"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-72 h-screen bg-[#0a0f1c]/90 border-r border-white/5 flex-col backdrop-blur-2xl">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0a0f1c] border-r border-white/10 z-50 lg:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
