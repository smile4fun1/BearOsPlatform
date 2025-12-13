'use client';

import Link from 'next/link';
import { Menu, Bell, Search } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface MobileHeaderProps {
  onMenuClick?: () => void;
  showMenu?: boolean;
}

export function MobileHeader({ onMenuClick, showMenu = true }: MobileHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();
  
  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname === '/robots') return 'My Robots';
    if (pathname === '/connect') return 'Connect';
    if (pathname === '/settings') return 'Settings';
    if (pathname === '/knowledge') return 'Knowledge';
    if (pathname === '/support') return 'Support';
    if (pathname === '/fleet') return 'Fleet';
    if (pathname === '/operations') return 'Operations';
    if (pathname === '/ai-models') return 'AI Models';
    if (pathname === '/data-lake') return 'Data Lake';
    return 'Bear OS';
  };
  
  return (
    <header className="lg:hidden flex-shrink-0 bg-[#0F1117]/95 backdrop-blur-sm border-b border-white/10 safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Menu or Logo */}
        <div className="flex items-center gap-3">
          {showMenu && onMenuClick ? (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <Menu className="w-6 h-6 text-gray-400" />
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg overflow-hidden">
                <img 
                  src="/download.png" 
                  alt="Bear Robotics" 
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
          )}
          <h1 className="text-lg font-bold text-white">{getPageTitle()}</h1>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <Search className="w-5 h-5 text-gray-400" />
          </button>
          <button
            className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10"
          >
            <div className="px-4 py-3">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:border-bear-blue/50"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
