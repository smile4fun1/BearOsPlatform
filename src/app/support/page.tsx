'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  Activity, 
  GraduationCap, 
  ArrowRight,
  LifeBuoy,
  Zap,
  Shield,
  FileText,
  Video,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Bot
} from 'lucide-react';
import { SystemStatus } from '@/components/SystemStatus';

export default function SupportPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSystemStatusOpen, setIsSystemStatusOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/knowledge?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickLinks = [
    {
      title: 'Knowledge Base',
      description: 'Detailed guides, documentation, and troubleshooting steps.',
      icon: BookOpen,
      href: '/knowledge',
      color: 'text-bear-blue',
      bgColor: 'bg-bear-blue/10',
      borderColor: 'border-bear-blue/20'
    },
    {
      title: 'Contact Support',
      description: 'Chat directly with our support team in real-time.',
      icon: MessageSquare,
      href: '/connect',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Video Training',
      description: 'Interactive courses to master your robot fleet.',
      icon: GraduationCap,
      href: '/knowledge/training',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'System Status',
      description: 'Check real-time status of the BearOS platform.',
      icon: Activity,
      action: () => setIsSystemStatusOpen(true),
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20'
    }
  ];

  const commonIssues = [
    { title: 'Robot Offline / Not Charging', href: '/knowledge?q=charging' },
    { title: 'LIDAR Obstruction Error', href: '/knowledge?q=lidar' },
    { title: 'WiFi Connection Setup', href: '/knowledge?q=wifi' },
    { title: 'Mapping a New Floor', href: '/knowledge?q=mapping' },
  ];

  return (
    <div className="min-h-screen bg-[#020511] pb-20 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-bear-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium mb-6">
            <LifeBuoy className="w-4 h-4 text-bear-blue" />
            <span>Help Center</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            How can we <span className="text-gradient">help you</span>?
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            Search our knowledge base, connect with support, or check system status.
            We're here to keep your fleet running smoothly.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-bear-blue/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            <div className="relative bg-[#0F1117] border border-white/10 rounded-2xl p-2 pl-6 flex items-center shadow-2xl">
              <Search className="w-6 h-6 text-gray-500 mr-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers (e.g. 'LIDAR error', 'battery replacement')..."
                className="flex-1 bg-transparent border-none text-white text-lg placeholder:text-gray-600 focus:outline-none focus:ring-0"
              />
              <button 
                type="submit"
                className="bg-bear-blue hover:bg-bear-blue/90 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
              >
                Search
              </button>
            </div>
          </form>

          {/* Common Issues Tags */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="text-sm text-gray-500 mr-2">Popular:</span>
            {['Battery Life', 'Navigation', 'Software Update', 'Maintenance'].map((tag) => (
              <button
                key={tag}
                onClick={() => router.push(`/knowledge?q=${encodeURIComponent(tag)}`)}
                className="text-sm text-gray-400 hover:text-bear-blue hover:bg-bear-blue/10 px-3 py-1 rounded-full transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                onClick={() => link.href ? router.push(link.href) : link.action?.()}
                className={`group h-full p-6 rounded-2xl border ${link.borderColor} bg-[#0F1117]/50 hover:bg-[#0F1117] backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer relative overflow-hidden`}
              >
                {/* Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${link.bgColor.replace('/10', '/0')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl ${link.bgColor} ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <link.icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    {link.description}
                  </p>
                  
                  <div className={`flex items-center text-sm font-semibold ${link.color} opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0`}>
                    Access Now <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Troubleshooting & Resources Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Troubleshooting Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#0F1117]/30 backdrop-blur-xl p-8 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Zap className="w-6 h-6 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Troubleshooting Wizards</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {commonIssues.map((issue, i) => (
                  <Link 
                    key={issue.title}
                    href={issue.href}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-gray-500 group-hover:text-amber-400 transition-colors" />
                      <span className="font-medium text-gray-200 group-hover:text-white">{issue.title}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Still stuck?</h3>
                    <p className="text-gray-400 text-sm">Our AI assistant can help diagnose 95% of common issues.</p>
                  </div>
                  <button 
                    onClick={() => router.push('/knowledge?q=help')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all active:scale-95"
                  >
                    <Bot className="w-5 h-5" />
                    Ask Bear AI
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Resources List */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-3xl border border-white/10 bg-[#0F1117]/30 backdrop-blur-xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-bear-blue" />
              Resources
            </h2>
            
            <div className="space-y-4">
              <a href="#" className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">User Manuals</h3>
                  <p className="text-xs text-gray-500 mt-1">PDF guides for all robot models.</p>
                </div>
              </a>

              <a href="#" className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">Video Library</h3>
                  <p className="text-xs text-gray-500 mt-1">Tutorials and installation guides.</p>
                </div>
              </a>

              <a href="#" className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Warranty Info</h3>
                  <p className="text-xs text-gray-500 mt-1">Check coverage and service terms.</p>
                </div>
              </a>
            </div>
          </motion.div>

        </div>

        {/* Contact CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-3xl bg-gradient-to-r from-bear-blue to-blue-600 p-1"
        >
          <div className="bg-[#0b1021] rounded-[22px] p-8 md:p-12 text-center relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />
             <div className="absolute top-0 right-0 w-64 h-64 bg-bear-blue/20 blur-[100px] rounded-full" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Our support team is available 24/7 to assist with critical issues.
                For urgent matters, please use the direct line.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => router.push('/connect')}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-bear-blue font-bold rounded-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-bear-blue/20"
                >
                  Chat with Support
                </button>
                <a 
                  href="mailto:support@bearrobotics.ai"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      <SystemStatus
        isOpen={isSystemStatusOpen}
        onClose={() => setIsSystemStatusOpen(false)}
      />
    </div>
  );
}

