'use client';

import { useState, useEffect } from 'react';

/**
 * Checks if viewport is mobile/tablet (< 1024px)
 * Used for conditional logic when Tailwind classes aren't enough
 */
export const isMobileViewport = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 1024; // lg breakpoint
};

/**
 * Checks if viewport is desktop (≥ 1024px)
 */
export const isDesktopViewport = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
};

/**
 * Checks if device has touch capability
 */
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * React hook for responsive state management
 * Returns true when viewport is < 1024px (mobile/tablet)
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 1024);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);
  
  return isMobile;
};
