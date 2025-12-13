'use client';

import { Search, Bell, Menu, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface MobileHeaderProps {
  onMenuClick?: () => void;
  showMenu?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
  title?: string;
  showBack?: boolean;
  onBackClick?: () => void;
}

export function MobileHeader({
  onMenuClick,
  showMenu = true,
  showSearch = false,
  showNotifications = false,
  onSearchClick,
  onNotificationsClick,
  title = 'BearOS',
  showBack = false,
  onBackClick,
}: MobileHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="lg:hidden flex-shrink-0 bg-[#0F1117]/95 backdrop-blur-sm border-b border-white/10 safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Menu or Logo */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={onBackClick}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <ChevronLeft className="w-6 h-6 text-gray-400" />
            </button>
          ) : showMenu && onMenuClick ? (
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
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          )}
          <h1 className="text-lg font-bold text-white truncate">{title}</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                onSearchClick?.();
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <Search className="w-6 h-6 text-gray-400" />
            </button>
          )}
          {showNotifications && (
            <button
              onClick={onNotificationsClick}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <Bell className="w-6 h-6 text-gray-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
          )}
        </div>
      </div>
      
      {/* Search Bar */}
      <>
        {searchOpen && (
          <div
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
          </div>
        )}
      </>
    </header>
  );
}
