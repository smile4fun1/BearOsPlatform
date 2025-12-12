'use client';

import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function LoadingState({ 
  message = 'Loading...', 
  size = 'md',
  fullScreen = false 
}: LoadingStateProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-sm', container: 'py-8' },
    md: { icon: 'w-12 h-12', text: 'text-base', container: 'py-16' },
    lg: { icon: 'w-16 h-16', text: 'text-lg', container: 'py-24' },
  };

  const content = (
    <motion.div 
      className={`flex flex-col items-center justify-center ${sizes[size].container}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Robot Icon */}
      <div className="relative mb-6">
        <motion.div
          className={`${sizes[size].icon} text-bear-blue`}
          animate={{ 
            y: [0, -8, 0],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        >
          <Bot className="w-full h-full" />
        </motion.div>
        
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-bear-blue/20 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
      </div>
      
      {/* Loading Dots */}
      <div className="flex items-center gap-1 mb-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-bear-blue"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              delay: i * 0.2,
              ease: 'easeInOut' 
            }}
          />
        ))}
      </div>
      
      <p className={`text-gray-400 ${sizes[size].text} font-medium`}>
        {message}
      </p>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#020511] flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}

// Skeleton loader for cards
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bear-glass-card p-6 animate-pulse ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/10" />
        <div className="flex-1">
          <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
          <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-white/5 rounded" />
        <div className="h-3 bg-white/5 rounded w-5/6" />
        <div className="h-3 bg-white/5 rounded w-4/6" />
      </div>
    </div>
  );
}

// Skeleton loader for robot cards
export function RobotCardSkeleton() {
  return (
    <div className="bear-glass-card p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-white/10" />
        <div className="flex-1">
          <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
          <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
      </div>
      <div className="h-6 bg-white/5 rounded-lg w-1/3 mb-4" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 bg-white/5 rounded w-1/4" />
          <div className="h-3 bg-white/10 rounded w-1/3" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-white/5 rounded w-1/4" />
          <div className="h-3 bg-white/10 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

// Page transition wrapper
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
