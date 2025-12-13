'use client';

import { ChevronRight, LucideIcon } from 'lucide-react';

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
    <div className="lg:hidden w-full min-h-full flex flex-col justify-center overflow-hidden py-6">
      {sections.map((section, sectionIndex) => (
        <div key={section.id} className={`flex-shrink-0 ${sectionIndex > 0 ? 'mt-8' : ''}`}>
          {section.title && (
            <h3 className="px-6 mb-3 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">
              {section.title}
            </h3>
          )}
          
          <div className="bg-[#0F1117]/60 backdrop-blur-sm mx-4 rounded-2xl overflow-hidden border border-white/5">
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              const isLast = itemIndex === section.items.length - 1;
              
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-4 px-5 py-4 active:bg-white/5 transition-colors ${
                    !isLast ? 'border-b border-white/5' : ''
                  }`}
                  style={{ minHeight: '68px', WebkitTapHighlightColor: 'transparent' }}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-bear-blue/20 to-bear-blue/10 flex items-center justify-center">
                    <Icon className="w-[18px] h-[18px] text-bear-blue" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[16px] text-white">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-[11px] font-semibold bg-bear-blue/20 text-bear-blue rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-[14px] text-gray-400 mt-1 leading-tight">{item.description}</p>
                    )}
                  </div>
                  
                  {/* Chevron */}
                  <ChevronRight className="w-5 h-5 text-gray-600 flex-shrink-0" />
                </button>
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
      <div className="flex-shrink-0 px-4 py-4 border-b border-white/5 bg-[#020511]/95 backdrop-blur-md" style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 0px))' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 active:bg-white/10 rounded-xl transition-colors"
            style={{ minWidth: '44px', minHeight: '44px', WebkitTapHighlightColor: 'transparent' }}
          >
            <ChevronRight className="w-5 h-5 text-bear-blue rotate-180" />
          </button>
          <h1 className="text-[20px] font-bold text-white tracking-tight">{title}</h1>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto mobile-scroll" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        {children}
      </div>
    </div>
  );
}
