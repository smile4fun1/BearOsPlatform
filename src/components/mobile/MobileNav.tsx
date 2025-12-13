'use client';

import { Home, Bot, Plus, MessageSquare, MoreHorizontal } from 'lucide-react';
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
    { id: 'more', label: 'More', icon: MoreHorizontal, href: '/settings' },
  ];
  
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };
  
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0F1117]/95 backdrop-blur-sm border-t border-white/10 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className="relative flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-xl transition-colors"
            >
              {active && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute inset-0 bg-bear-blue/10 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 mb-1 transition-colors ${
                    active ? 'text-bear-blue' : 'text-gray-400'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              
              <span className={`text-xs font-medium transition-colors ${
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
