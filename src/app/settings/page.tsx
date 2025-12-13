'use client';

import { useState, useEffect } from 'react';
import { useRole } from '@/lib/roleContext';
import { 
  User, Building2, Bell, Shield, Key,
  Globe, Plus, Edit2, Trash2,
  MapPin, Bot, Mail, Save
} from 'lucide-react';
import { userLocations, locationTypeLabels, getRobotsForLocation } from '@/lib/locationData';
import { Footer } from '@/components/Footer';

export default function SettingsPage() {
  const { role, getRoleLabel } = useRole();
  const [activeSection, setActiveSection] = useState<'profile' | 'locations' | 'notifications' | 'security'>('profile');
  const [isLoaded, setIsLoaded] = useState(false);
  
  const isPartnerOrCustomer = role === 'partner_qcom' || role === 'customer_manager';

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Mock user data
  const userData = {
    name: 'George',
    email: 'george@company.com',
    phone: '+44 20 7123 4567',
    company: 'Sample Restaurant Group',
    role: getRoleLabel(role),
    avatar: 'G',
    timezone: 'Europe/London',
    language: 'English (UK)',
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'locations', label: 'Locations', icon: Building2, showFor: ['partner_qcom', 'customer_manager'] },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ].filter(s => !s.showFor || s.showFor.includes(role));

  return (
    <div className="h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] text-white flex flex-col overflow-hidden">
      {/* Decorative Background */}
      <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-bear-blue/5 rounded-full blur-3xl pointer-events-none" />
      
      <main className="relative mx-auto max-w-7xl w-full px-6 py-6 flex-1 flex flex-col overflow-hidden">
        {/* Compact Header */}
        <div className={`mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Settings</h1>
          <p className="text-sm text-white/60">Manage your account and preferences</p>
        </div>

        {/* Main Content Grid - No Scrolling */}
        <div className="flex-1 grid grid-cols-5 gap-6 min-h-0">
          {/* Left Sidebar - Compact */}
          <div className={`col-span-1 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            <div className="bear-glass-card p-2 h-fit">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all mb-1 last:mb-0 ${
                    activeSection === section.id
                      ? 'bg-bear-blue/20 text-bear-blue border border-bear-blue/30 shadow-lg shadow-bear-blue/10'
                      : 'text-gray-400 border border-transparent'
                  }`}
                >
                  <section.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area - Scrollable Content Only */}
          <div className="col-span-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2">
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className={`space-y-4 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="bear-glass-card p-6">
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                    <User className="w-5 h-5 text-bear-blue" />
                    Profile Information
                  </h2>
                  
                  <div className="flex gap-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-bear-blue to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-bear-blue/30 mb-3">
                        {userData.avatar}
                      </div>
                      <button className="text-xs text-bear-blue hover:text-bear-blue/80 transition-colors">
                        Change Photo
                      </button>
                    </div>
                    
                    {/* Form Fields - Compact Grid */}
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
                        <input type="text" defaultValue={userData.name} className="bear-input text-sm py-2" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                        <input type="email" defaultValue={userData.email} className="bear-input text-sm py-2" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone</label>
                        <input type="tel" defaultValue={userData.phone} className="bear-input text-sm py-2" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Company</label>
                        <input type="text" defaultValue={userData.company} className="bear-input text-sm py-2" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Timezone</label>
                        <select className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-white outline-none focus:bg-white/15 focus:ring-2 focus:ring-bear-blue/50 [&>option]:bg-gray-800">
                          <option>Europe/London</option>
                          <option>Europe/Paris</option>
                          <option>America/New_York</option>
                          <option>Asia/Tokyo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Language</label>
                        <select className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-white outline-none focus:bg-white/15 focus:ring-2 focus:ring-bear-blue/50 [&>option]:bg-gray-800">
                          <option>English (UK)</option>
                          <option>English (US)</option>
                          <option>Français</option>
                          <option>Deutsch</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-5 border-t border-white/5 flex justify-end gap-3">
                    <button className="px-4 py-2 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors text-sm">
                      Cancel
                    </button>
                    <button className="btn-primary text-sm">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Role Badge - Compact */}
                <div className="bear-glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/20">
                      <Key className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Account Role</div>
                      <div className="text-xs text-gray-400">{userData.role}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-bear-blue/20 text-bear-blue text-xs font-medium border border-bear-blue/30">
                    {userData.role}
                  </span>
                </div>
              </div>
            )}

            {/* Locations Section */}
            {activeSection === 'locations' && isPartnerOrCustomer && (
              <div className={`space-y-4 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-bear-blue" />
                    My Locations
                  </h2>
                  <button className="btn-primary text-sm">
                    <Plus className="w-4 h-4" />
                    Add Location
                  </button>
                </div>

                <div className="space-y-3">
                  {userLocations.slice(0, 3).map((location) => {
                    const locationRobots = getRobotsForLocation(location.id);
                    const onlineRobots = locationRobots.filter(r => r.status === 'active' || r.status === 'idle');
                    
                    return (
                      <div key={location.id} className="bear-glass-card p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-bear-blue/20">
                              <Building2 className="w-5 h-5 text-bear-blue" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white">{location.name}</h3>
                              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {location.city}, {location.country}
                                </span>
                                <span>•</span>
                                <span className="px-2 py-0.5 rounded-md bg-white/5">
                                  {locationTypeLabels[location.type]}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            {/* Robot Stats */}
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Bot className="w-4 h-4 text-gray-500" />
                                <span className="text-white font-medium">{location.robotCount}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className="text-emerald-400 text-xs">{onlineRobots.length} online</span>
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button className="p-2 rounded-lg bg-white/5 transition-colors">
                                <Edit2 className="w-4 h-4 text-gray-400" />
                              </button>
                              <button className="p-2 rounded-lg bg-white/5 transition-colors">
                                <Trash2 className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Contact Info */}
                        {location.primaryContact && (
                          <div className="mt-3 pt-3 border-t border-white/5 flex gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1.5">
                              <User className="w-3 h-3" />
                              {location.primaryContact}
                            </span>
                            {location.primaryEmail && (
                              <span className="flex items-center gap-1.5">
                                <Mail className="w-3 h-3" />
                                {location.primaryEmail}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className={`bear-glass-card p-6 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-bear-blue" />
                  Notification Preferences
                </h2>
                
                <div className="space-y-4">
                  {[
                    { label: 'Robot Status Alerts', description: 'Get notified when robots go offline or have errors', enabled: true },
                    { label: 'Battery Warnings', description: 'Alert when battery drops below 20%', enabled: true },
                    { label: 'Daily Summary', description: 'Receive a daily digest of robot activity', enabled: false },
                    { label: 'Maintenance Reminders', description: 'Get notified about scheduled maintenance', enabled: true },
                    { label: 'New Features', description: 'Updates about new platform features', enabled: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <div>
                        <div className="font-medium text-white text-sm">{item.label}</div>
                        <div className="text-xs text-gray-400">{item.description}</div>
                      </div>
                      <button 
                        className={`w-11 h-6 rounded-full transition-colors relative ${
                          item.enabled ? 'bg-bear-blue' : 'bg-white/10'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-lg transition-all ${
                          item.enabled ? 'left-5' : 'left-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className={`space-y-4 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="bear-glass-card p-6">
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                    <Key className="w-5 h-5 text-bear-blue" />
                    Change Password
                  </h2>
                  
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Current Password</label>
                      <input type="password" className="bear-input text-sm py-2" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">New Password</label>
                      <input type="password" className="bear-input text-sm py-2" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirm New Password</label>
                      <input type="password" className="bear-input text-sm py-2" placeholder="••••••••" />
                    </div>
                    <button className="btn-primary text-sm mt-2">
                      <Save className="w-4 h-4" />
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="bear-glass-card p-6">
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-bear-blue" />
                    Two-Factor Authentication
                  </h2>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white text-sm mb-1">Authenticator App</div>
                      <div className="text-xs text-gray-400">Use an authenticator app to generate one-time codes</div>
                    </div>
                    <button className="btn-secondary text-sm">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
