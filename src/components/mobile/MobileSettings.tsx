'use client';

import { useState } from 'react';
import { 
  User, Building2, Bell, Shield, Key, 
  MapPin, Bot, Mail, Save, ChevronRight, Edit2, Trash2
} from 'lucide-react';
import { SettingsList, SettingsDetail } from './SettingsList';

interface MobileSettingsProps {
  userData: {
    name: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    avatar: string;
    timezone: string;
    language: string;
  };
  userLocations: any[];
  isPartnerOrCustomer: boolean;
  getRobotsForLocation: (locationId: string) => any[];
  locationTypeLabels: any;
}

type SettingsView = 'main' | 'profile' | 'locations' | 'notifications' | 'security';

export function MobileSettings({ 
  userData, 
  userLocations, 
  isPartnerOrCustomer,
  getRobotsForLocation,
  locationTypeLabels
}: MobileSettingsProps) {
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  
  const sections = [
    {
      id: 'account',
      title: '',
      items: [
        {
          id: 'profile',
          icon: User,
          label: 'Profile',
          description: userData.name,
          onClick: () => setCurrentView('profile')
        },
        ...(isPartnerOrCustomer ? [{
          id: 'locations',
          icon: Building2,
          label: 'Locations',
          description: `${userLocations.length} locations`,
          onClick: () => setCurrentView('locations')
        }] : []),
        {
          id: 'notifications',
          icon: Bell,
          label: 'Notifications',
          onClick: () => setCurrentView('notifications')
        },
        {
          id: 'security',
          icon: Shield,
          label: 'Security',
          onClick: () => setCurrentView('security')
        },
      ]
    }
  ];
  
  return (
    <div className="lg:hidden h-full flex flex-col overflow-hidden">
      <>
        {currentView === 'main' && (
          <div
            key="main"
            className="h-full overflow-hidden"
          >
            {/* Settings List */}
            <div className="h-full flex flex-col">
              <SettingsList sections={sections} />
            </div>
          </div>
        )}
        
        {currentView === 'profile' && (
          <div
            key="profile"
          >
            <SettingsDetail title="Profile" onBack={() => setCurrentView('main')}>
              <div className="p-6 space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-bear-blue to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-bear-blue/30 mb-4">
                    {userData.avatar}
                  </div>
                  <button className="text-sm text-bear-blue font-medium">
                    Change Photo
                  </button>
                </div>
                
                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={userData.name} 
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input 
                      type="email" 
                      defaultValue={userData.email} 
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      defaultValue={userData.phone} 
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
                    <input 
                      type="text" 
                      defaultValue={userData.company} 
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Timezone</label>
                    <select className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-base [&>option]:bg-gray-800">
                      <option>Europe/London</option>
                      <option>Europe/Paris</option>
                      <option>America/New_York</option>
                      <option>Asia/Tokyo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
                    <select className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-base [&>option]:bg-gray-800">
                      <option>English (UK)</option>
                      <option>English (US)</option>
                      <option>Français</option>
                      <option>Deutsch</option>
                    </select>
                  </div>
                  
                  <button className="w-full btn-primary mt-6">
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>
              </div>
            </SettingsDetail>
          </div>
        )}
        
        {currentView === 'locations' && isPartnerOrCustomer && (
          <div
            key="locations"
          >
            <SettingsDetail title="Locations" onBack={() => setCurrentView('main')}>
              <div className="p-6 space-y-4">
                {userLocations.slice(0, 3).map((location) => {
                  const locationRobots = getRobotsForLocation(location.id);
                  const onlineRobots = locationRobots.filter((r: any) => r.status === 'active' || r.status === 'idle');
                  
                  return (
                    <div key={location.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-bear-blue/20">
                            <Building2 className="w-5 h-5 text-bear-blue" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white">{location.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                              <MapPin className="w-3 h-3" />
                              {location.city}, {location.country}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-gray-500" />
                          <span className="text-white font-medium">{location.robotCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-emerald-400 text-xs">{onlineRobots.length} online</span>
                        </div>
                      </div>
                      
                      {location.primaryContact && (
                        <div className="pt-3 border-t border-white/10 space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <User className="w-3 h-3" />
                            {location.primaryContact}
                          </div>
                          {location.primaryEmail && (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Mail className="w-3 h-3" />
                              {location.primaryEmail}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 py-2 px-3 bg-white/10 rounded-lg text-sm text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button className="flex-1 py-2 px-3 bg-white/10 rounded-lg text-sm text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SettingsDetail>
          </div>
        )}
        
        {currentView === 'notifications' && (
          <div
            key="notifications"
          >
            <SettingsDetail title="Notifications" onBack={() => setCurrentView('main')}>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { label: 'Robot Status Alerts', description: 'Get notified when robots go offline or have errors', enabled: true },
                    { label: 'Battery Warnings', description: 'Alert when battery drops below 20%', enabled: true },
                    { label: 'Daily Summary', description: 'Receive a daily digest of robot activity', enabled: false },
                    { label: 'Maintenance Reminders', description: 'Get notified about scheduled maintenance', enabled: true },
                    { label: 'New Features', description: 'Updates about new platform features', enabled: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start justify-between py-4 border-b border-white/10 last:border-0">
                      <div className="flex-1">
                        <div className="font-medium text-white mb-1">{item.label}</div>
                        <div className="text-sm text-gray-400">{item.description}</div>
                      </div>
                      <button 
                        className={`relative flex-shrink-0 w-12 h-7 rounded-full transition-colors ml-4 ${
                          item.enabled ? 'bg-bear-blue' : 'bg-white/20'
                        }`}
                        style={{ minWidth: '48px', minHeight: '28px' }}
                      >
                        <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg transition-all ${
                          item.enabled ? 'left-[22px]' : 'left-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </SettingsDetail>
          </div>
        )}
        
        {currentView === 'security' && (
          <div
            key="security"
          >
            <SettingsDetail title="Security" onBack={() => setCurrentView('main')}>
              <div className="p-6 space-y-6">
                {/* Change Password */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-bear-blue" />
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                      <input 
                        type="password" 
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-base" 
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                      <input 
                        type="password" 
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-base" 
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-base" 
                        placeholder="••••••••"
                      />
                    </div>
                    <button className="w-full btn-primary">
                      <Save className="w-5 h-5" />
                      Update Password
                    </button>
                  </div>
                </div>
                
                {/* 2FA */}
                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-bear-blue" />
                    Two-Factor Authentication
                  </h3>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="mb-3">
                      <div className="font-semibold text-white mb-1">Authenticator App</div>
                      <div className="text-sm text-gray-400">Use an authenticator app to generate one-time codes</div>
                    </div>
                    <button className="w-full py-3 px-4 bg-bear-blue/10 border border-bear-blue/30 text-bear-blue rounded-xl font-medium hover:bg-bear-blue/20 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            </SettingsDetail>
          </div>
        )}
      </>
    </div>
  );
}
