"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Rocket,
  LayoutDashboard,
  Cpu,
  TrendingUp,
  Database,
  Bot,
  Menu,
  X 
} from "lucide-react";
import { useState, useRef } from "react";
import { LiveStatusPopup } from "./LiveStatusPopup";

const navigation = [
  { name: "Home", href: "/", icon: Rocket },
  { name: "Operations", href: "/operations", icon: TrendingUp },
  { name: "Robots", href: "/robots", icon: Bot },
  { name: "AI Models", href: "/ai-models", icon: Cpu },
  { name: "Data Lake", href: "/data-lake", icon: Database },
  { name: "Features", href: "/features", icon: LayoutDashboard },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statusPopupOpen, setStatusPopupOpen] = useState(false);
  const liveButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020511]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-indigo-500 to-rose-500 shadow-lg shadow-sky-500/30 transition-all group-hover:shadow-sky-500/50 group-hover:scale-105">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-white">Bear Universe</div>
            <div className="text-xs text-white/50">Bearrobotics.ai</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 lg:flex">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-white/10 text-white shadow-inner"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
                {isActive && (
                  <div className="absolute inset-x-0 -bottom-[17px] h-0.5 bg-gradient-to-r from-sky-400 via-indigo-400 to-rose-400" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Status Indicator */}
        <button
          ref={liveButtonRef}
          onClick={() => setStatusPopupOpen(!statusPopupOpen)}
          className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 hover:border-emerald-500/30 lg:flex"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live</span>
        </button>

        {/* Mobile menu button */}
        <button
          className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#020511]/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-6 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      )}
    </header>
    
    {/* Live Status Popup */}
    <LiveStatusPopup
      isOpen={statusPopupOpen}
      onClose={() => setStatusPopupOpen(false)}
      anchorRef={liveButtonRef as React.RefObject<HTMLElement>}
    />
    </>
  );
}

