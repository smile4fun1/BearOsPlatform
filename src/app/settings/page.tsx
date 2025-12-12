'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRole } from '@/lib/roleContext';
import { 
  User, Building2, Bell, Shield, Key, Palette, 
  Globe, ChevronRight, Check, Plus, Edit2, Trash2,
  MapPin, Bot, Mail, Phone, Save, X
} from 'lucide-react';
import { userLocations, Location, locationTypeLabels, getRobotsForLocation } from '@/lib/locationData';
import { Footer } from '@/components/Footer';

export default function SettingsPage() {
  const { role, getRoleLabel } = useRole();
  const [activeSection, setActiveSection] = useState<'profile' | 'locations' | 'notifications' | 'security'>('profile');
  const [editingLocation, setEditingLocation] = useState<string | null>(null);
  
  const isPartnerOrCustomer = role === 'partner_qcom' || role === 'customer_manager';

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
    { id: 'profile', label: 'Profile', icon: User, description: 'Manage your account details' },
    { id: 'locations', label: 'My Locations', icon: Building2, description: 'Manage your sites', showFor: ['partner_qcom', 'customer_manager'] },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alert preferences' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Password & access' },
  ].filter(s => !s.showFor || s.showFor.includes(role));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] text-white">
      {/* Decorative Background */}
      <div className="fixed top-20 right-0 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] bg-bear-blue/5 rounded-full blur-3xl pointer-events-none" />
      
      <main className="relative mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 lg:mb-10"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-1 sm:mb-2">Settings</h1>
          <p className="text-sm sm:text-base lg:text-lg text-white/60">Manage your account and preferences</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar Navigation - Horizontal scroll on mobile */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bear-glass-card p-1.5 sm:p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-left transition-all whitespace-nowrap lg:whitespace-normal flex-shrink-0 lg:w-full ${
                    activeSection === section.id
                      ? 'bg-bear-blue/20 text-bear-blue border border-bear-blue/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <section.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-sm sm:text-base">{section.label}</div>
                    <div className="text-[10px] sm:text-xs text-gray-500 hidden lg:block">{section.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div className="bear-glass-card p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-bear-blue" />
                    Profile Information
                  </h2>
                  
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar */}
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-bear-blue to-purple-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-bear-blue/30 mb-4">
                        {userData.avatar}
                      </div>
                      <button className="btn-tertiary text-sm">
                        <Edit2 className="w-4 h-4" />
                        Change Photo
                      </button>
                    </div>
                    
                    {/* Form Fields */}
                    <div className="flex-1 grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                        <input
                          type="text"
                          defaultValue={userData.name}
                          className="bear-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={userData.email}
                          className="bear-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                        <input
                          type="tel"
                          defaultValue={userData.phone}
                          className="bear-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
                        <input
                          type="text"
                          defaultValue={userData.company}
                          className="bear-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Timezone</label>
                        <select className="w-full rounded-lg sm:rounded-xl bg-white/10 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white outline-none transition-colors focus:bg-white/15 focus:ring-2 focus:ring-bear-blue/50 [&>option]:bg-gray-800 [&>option]:text-white">
                          <option>Europe/London</option>
                          <option>Europe/Paris</option>
                          <option>America/New_York</option>
                          <option>Asia/Tokyo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
                        <select className="w-full rounded-lg sm:rounded-xl bg-white/10 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white outline-none transition-colors focus:bg-white/15 focus:ring-2 focus:ring-bear-blue/50 [&>option]:bg-gray-800 [&>option]:text-white">
                          <option>English (UK)</option>
                          <option>English (US)</option>
                          <option>Français</option>
                          <option>Deutsch</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-end gap-4">
                    <button className="btn-tertiary">Cancel</button>
                    <button className="btn-primary">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="bear-glass-card p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-purple-500/20">
                      <Key className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Account Role</div>
                      <div className="text-sm text-gray-400">{userData.role}</div>
                    </div>
                  </div>
                  <span className="px-4 py-2 rounded-full bg-bear-blue/20 text-bear-blue text-sm font-medium border border-bear-blue/30">
                    {userData.role}
                  </span>
                </div>
              </div>
            )}

            {/* Locations Section */}
            {activeSection === 'locations' && isPartnerOrCustomer && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-bear-blue" />
                    My Locations
                  </h2>
                  <button className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Add Location
                  </button>
                </div>

                <div className="grid gap-4">
                  {userLocations.map((location, index) => {
                    const locationRobots = getRobotsForLocation(location.id);
                    const onlineRobots = locationRobots.filter(r => r.status === 'active' || r.status === 'idle');
                    
                    return (
                      <motion.div
                        key={location.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bear-glass-card p-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-bear-blue/20">
                              <Building2 className="w-6 h-6 text-bear-blue" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-white mb-1">{location.name}</h3>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {location.city}, {location.country}
                                </span>
                                <span className="text-gray-600">•</span>
                                <span className="px-2 py-0.5 rounded-md bg-white/5 text-xs">
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
                                <span className="text-gray-500">robots</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className="text-emerald-400">{onlineRobots.length} online</span>
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                <Edit2 className="w-4 h-4 text-gray-400" />
                              </button>
                              <button className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/10 transition-colors group">
                                <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-rose-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Contact Info */}
                        {location.primaryContact && (
                          <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              {location.primaryContact}
                            </span>
                            {location.primaryEmail && (
                              <span className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" />
                                {location.primaryEmail}
                              </span>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="bear-glass-card p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-bear-blue" />
                  Notification Preferences
                </h2>
                
                <div className="space-y-6">
                  {[
                    { label: 'Robot Status Alerts', description: 'Get notified when robots go offline or have errors', enabled: true },
                    { label: 'Battery Warnings', description: 'Alert when battery drops below 20%', enabled: true },
                    { label: 'Daily Summary', description: 'Receive a daily digest of robot activity', enabled: false },
                    { label: 'Maintenance Reminders', description: 'Get notified about scheduled maintenance', enabled: true },
                    { label: 'New Features', description: 'Updates about new platform features', enabled: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                      <div>
                        <div className="font-medium text-white">{item.label}</div>
                        <div className="text-sm text-gray-400">{item.description}</div>
                      </div>
                      <button 
                        className={`w-12 h-7 rounded-full transition-colors relative ${
                          item.enabled ? 'bg-bear-blue' : 'bg-white/10'
                        }`}
                      >
                        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all ${
                          item.enabled ? 'left-6' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="bear-glass-card p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Key className="w-5 h-5 text-bear-blue" />
                    Change Password
                  </h2>
                  
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                      <input type="password" className="bear-input" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                      <input type="password" className="bear-input" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                      <input type="password" className="bear-input" placeholder="••••••••" />
                    </div>
                    <button className="btn-primary mt-4">
                      <Save className="w-4 h-4" />
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="bear-glass-card p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-bear-blue" />
                    Two-Factor Authentication
                  </h2>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white mb-1">Authenticator App</div>
                      <div className="text-sm text-gray-400">Use an authenticator app to generate one-time codes</div>
                    </div>
                    <button className="btn-secondary">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
