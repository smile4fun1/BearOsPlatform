'use client';

import { Home, Bot, MessageSquare, Settings, BookOpen, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
}

export function MobileNav() {
  const pathname = usePathname();
  
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'robots', label: 'Robots', icon: Bot, href: '/robots' },
    { id: 'connect', label: 'Connect', icon: MessageSquare, href: '/connect' },
    { id: 'knowledge', label: 'Knowledge', icon: BookOpen, href: '/knowledge' },
    { id: 'support', label: 'Support', icon: LifeBuoy, href: '/support' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ];
  
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };
  
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#020511] border-t border-white/10" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around px-1 py-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className="relative flex flex-col items-center justify-center min-w-[50px] py-1 px-1 rounded-lg active:bg-white/10 transition-colors"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {active && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute inset-0 bg-bear-blue/10 rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 mb-0.5 transition-colors ${
                    active ? 'text-bear-blue' : 'text-gray-400'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              
              <span className={`text-[10px] font-medium transition-colors leading-none ${
                active ? 'text-bear-blue' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
