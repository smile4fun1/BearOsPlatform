'use client';

import { ChevronRight, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingsSection {
  id: string;
  title: string;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  icon: LucideIcon;
  label: string;
  description?: string;
  badge?: string;
  onClick: () => void;
}

interface SettingsListProps {
  sections: SettingsSection[];
}

export function SettingsList({ sections }: SettingsListProps) {
  return (
    <div className="lg:hidden w-full">
      {sections.map((section, sectionIndex) => (
        <div key={section.id} className="mb-4">
          {section.title && (
            <h3 className="px-6 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {section.title}
            </h3>
          )}
          
          <div className="bg-white/5 border-y border-white/10 w-full">
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              const isLast = itemIndex === section.items.length - 1;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={item.onClick}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-4 px-6 py-4 active:bg-white/10 transition-colors ${
                    !isLast ? 'border-b border-white/5' : ''
                  }`}
                  style={{ minHeight: '64px' }} // Larger touch target for better UX
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-bear-blue/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-bear-blue" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-bear-blue/20 text-bear-blue rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-400 mt-0.5">{item.description}</p>
                    )}
                  </div>
                  
                  {/* Chevron */}
                  <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

interface SettingsDetailProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

export function SettingsDetail({ title, onBack, children }: SettingsDetailProps) {
  return (
    <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-[#020511]">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-4 border-b border-white/10 bg-[#0F1117]/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <ChevronRight className="w-5 h-5 text-gray-400 rotate-180" />
          </button>
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto mobile-scroll pb-20">
        {children}
      </div>
    </div>
  );
}
