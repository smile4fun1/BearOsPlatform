'use client';

import { motion } from 'framer-motion';

interface TouchTargetProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  minSize?: number; // Minimum size in pixels (default 44)
  disabled?: boolean;
}

/**
 * Wrapper component that ensures minimum touch target size (44x44px)
 * while maintaining visual appearance
 */
export function TouchTarget({ 
  children, 
  onClick, 
  className = '', 
  minSize = 44,
  disabled = false 
}: TouchTargetProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled} : { scale: 0.95 }}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{
        minWidth: `${minSize}px`,
        minHeight: `${minSize}px`,
      }}
    >
      {children}
    </button>
  );
}

