'use client';

import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: ('half' | 'full')[];
  showDragHandle?: boolean;
  className?: string;
}

export function MobileSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = ['full'],
  showDragHandle = true,
  className = ''
}: MobileSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  
  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Close if dragged down more than 150px
    if (info.offset.y > 150) {
      onClose();
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div}}}}
            className="fixed inset-0 bg-black/80 z-[100] lg:hidden"
            onClick={onClose}
          />
          
          {/* Sheet */}
          <div
            ref={sheetRef}}}}}
            drag="y"}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDrag}
            className={`fixed inset-x-0 bottom-0 z-[101] bg-[#0F1117] border-t border-white/10 rounded-t-2xl shadow-2xl lg:hidden flex flex-col ${className}`}
            style={{ maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            {showDragHandle && (
              <div className="flex-shrink-0 py-3 flex justify-center">
                <div className="w-12 h-1 bg-white/20 rounded-full" />
              </div>
            )}
            
            {/* Header */}
            {title && (
              <div className="flex-shrink-0 px-6 pb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            )}
            
            {/* Content - scrollable */}
            <div className="flex-1 overflow-y-auto mobile-scroll">
              {children}
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

