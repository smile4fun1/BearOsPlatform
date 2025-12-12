'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRole } from '@/lib/roleContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Hash, 
  Search, 
  Bell, 
  MoreHorizontal, 
  Paperclip, 
  Smile, 
  Send,
  Lock,
  Bot,
  ExternalLink,
  QrCode,
  Battery,
  MapPin
} from 'lucide-react';
import { robotFleet, searchRobots, Robot } from '@/lib/robotData';

interface Message {
  id: string;
  sender: string;
  avatar?: string;
  content: string;
  timestamp: string;
  isBot?: boolean;
  robotId?: string;
  attachments?: string[];
}

interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'bot';
  allowedRoles: string[];
  unread?: number;
}

// Parse message content for @mentions and render them as links
function MessageContent({ content }: { content: string }) {
  // Match @ROBOT-ID patterns (e.g., @Servi-Plus-C44E79 or @c44e79)
  const mentionPattern = /@([A-Za-z0-9\-]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionPattern.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }

    // Extract potential robot ID
    const mention = match[1];
    const robotId = mention.toLowerCase().split('-').pop() || mention.toLowerCase().slice(0, 6);
    const robot = robotFleet.find(r => 
      r.id.toLowerCase() === robotId ||
      r.name.toLowerCase().includes(mention.toLowerCase()) ||
      r.serialNumber.toLowerCase().includes(mention.toLowerCase())
    );

    if (robot) {
      parts.push({ type: 'robot', value: match[0], robot });
    } else {
      parts.push({ type: 'mention', value: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIndex) });
  }

  if (parts.length === 0) {
    return <span>{content}</span>;
  }

  return (
    <span>
      {parts.map((part, i) => {
        if (part.type === 'robot' && part.robot) {
          return (
            <Link
              key={i}
              href={`/robots/${part.robot.id}`}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded bg-bear-blue/20 text-bear-blue hover:bg-bear-blue/30 transition-colors text-sm font-medium"
            >
              <Bot className="w-3 h-3" />
              {part.robot.name}
              <ExternalLink className="w-2.5 h-2.5 opacity-50" />
            </Link>
          );
        } else if (part.type === 'mention') {
          return (
            <span key={i} className="text-purple-400 font-medium">
              {part.value}
            </span>
          );
        }
        return <span key={i}>{part.value}</span>;
      })}
    </span>
  );
}

// Autocomplete dropdown for robot mentions
function RobotMentionDropdown({ 
  query, 
  onSelect, 
  onClose 
}: { 
  query: string; 
  onSelect: (robot: Robot) => void; 
  onClose: () => void;
}) {
  const results = useMemo(() => {
    if (!query || query.length < 1) return [];
    return searchRobots(query).slice(0, 5);
  }, [query]);

  if (results.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-full left-0 mb-2 w-80 bg-[#1a1f36] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
    >
      <div className="p-2 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Bot className="w-3 h-3" />
          <span>Mention a robot</span>
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {results.map((robot) => (
          <button
            key={robot.id}
            onClick={() => onSelect(robot)}
            className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-bear-blue/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-bear-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white text-sm truncate">{robot.name}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-mono">{robot.serialNumber}</span>
                <span>•</span>
                <span className={`${
                  robot.status === 'active' ? 'text-emerald-400' :
                  robot.status === 'error' ? 'text-rose-400' :
                  'text-gray-400'
                }`}>
                  {robot.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Battery className="w-3 h-3" />
              {robot.battery}%
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default function ConnectPage() {
  const { role } = useRole();
  const [activeChannel, setActiveChannel] = useState('general');
  const [inputText, setInputText] = useState('');
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionStartIndex, setMentionStartIndex] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const channels: Channel[] = [
    { id: 'general', name: 'general', type: 'public', allowedRoles: ['internal_admin', 'internal_rfe', 'partner_qcom'] },
    { id: 'announcements', name: 'announcements', type: 'public', allowedRoles: ['internal_admin', 'internal_rfe', 'partner_qcom', 'customer_manager'], unread: 2 },
    { id: 'field-ops', name: 'field-ops', type: 'public', allowedRoles: ['internal_admin', 'internal_rfe'] },
    { id: 'qcom-support', name: 'qcom-support', type: 'private', allowedRoles: ['internal_admin', 'partner_qcom'] },
    { id: 'robot-alerts', name: 'robot-alerts', type: 'bot', allowedRoles: ['internal_admin', 'internal_rfe'], unread: 5 },
  ];

  const messages: Record<string, Message[]> = {
    'general': [
      { id: '1', sender: 'Sarah Connor', content: 'Has anyone seen the new Servi Plus deployment docs?', timestamp: '10:30 AM' },
      { id: '2', sender: 'John Smith', content: 'Yes, check the Knowledge Base, I just updated them.', timestamp: '10:32 AM' },
      { id: '3', sender: 'Field Engineer', content: 'Quick update - @Servi-Plus-C44E79 is back online after calibration. All good now!', timestamp: '10:45 AM' },
    ],
    'qcom-support': [
      { id: '1', sender: 'Qcom Tech', content: 'We are on site at Manchester. @a1b2c3 is showing a LIDAR obstruction error.', timestamp: '09:15 AM' },
      { id: '2', sender: 'Bear Support', content: 'Checking telemetry now. Please verify the lens is clean.', timestamp: '09:16 AM' },
      { id: '3', sender: 'Bear Bot', content: 'Telemetry confirms error code L-204 on @Carti-100-A1B2C3. Last clean: 4 days ago.', timestamp: '09:16 AM', isBot: true, robotId: 'a1b2c3' },
    ],
    'robot-alerts': [
      { id: '1', sender: 'Fleet Monitor', content: '@d5e6f7 low battery warning (15%) at Downtown location.', timestamp: '11:00 AM', isBot: true, robotId: 'd5e6f7' },
      { id: '2', sender: 'Fleet Monitor', content: '@d5e6f7 returned to charger successfully.', timestamp: '11:05 AM', isBot: true, robotId: 'd5e6f7' },
      { id: '3', sender: 'Fleet Monitor', content: '@g8h9i0 offline - check WiFi connectivity at Seoul Operations Center.', timestamp: '11:15 AM', isBot: true, robotId: 'g8h9i0' },
    ],
    'field-ops': [
      { id: '1', sender: 'RFE Team Lead', content: 'Deploying 3 new robots at London Service Hub today. @j1k2l3, @m4n5o6, @p7q8r9', timestamp: '08:00 AM' },
      { id: '2', sender: 'Field Engineer', content: 'Confirmed. Maps already uploaded. Starting calibration in 30 mins.', timestamp: '08:05 AM' },
    ]
  };

  const visibleChannels = channels.filter(c => c.allowedRoles.includes(role));
  const currentMessages = messages[activeChannel] || [];

  // Handle input change and detect @ mentions
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputText(value);

    // Check if user is typing a mention
    const cursorPos = e.target.selectionStart || 0;
    const textBeforeCursor = value.slice(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@([A-Za-z0-9\-]*)$/);

    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setMentionStartIndex(mentionMatch.index || 0);
    } else {
      setMentionQuery(null);
    }
  };

  // Handle robot selection from dropdown
  const handleRobotSelect = (robot: Robot) => {
    const before = inputText.slice(0, mentionStartIndex);
    const after = inputText.slice(mentionStartIndex + (mentionQuery?.length || 0) + 1);
    setInputText(`${before}@${robot.name} ${after}`);
    setMentionQuery(null);
    inputRef.current?.focus();
  };

  const [showSidebar, setShowSidebar] = useState(false);
  
  return (
    <div className="flex h-screen bg-[#020511] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Channel Sidebar - Hidden on mobile by default */}
      <div className={`fixed lg:relative inset-y-0 left-0 w-64 sm:w-72 bg-[#0F1117] border-r border-white/5 flex flex-col z-50 transform transition-transform duration-300 lg:translate-x-0 ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-3 sm:p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Find channels..." 
              className="w-full bg-[#020511] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-bear-blue/50 transition-colors"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-3 sm:py-4">
          <div className="px-3 sm:px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Channels</div>
          <div className="space-y-0.5 px-2">
            {visibleChannels.map(channel => (
              <button
                key={channel.id}
                onClick={() => {
                  setActiveChannel(channel.id);
                  setShowSidebar(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  activeChannel === channel.id 
                    ? 'bg-bear-blue/10 text-bear-blue border border-bear-blue/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  {channel.type === 'bot' ? <Bot className="w-4 h-4" /> : 
                   channel.type === 'private' ? <Lock className="w-3 h-3" /> : 
                   <Hash className="w-4 h-4" />}
                  <span className="truncate">{channel.name}</span>
                </div>
                {channel.unread && (
                  <span className="bg-bear-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {channel.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Tip for @mentions - Hidden on mobile */}
          <div className="hidden sm:block mx-4 mt-6 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Bot className="w-3 h-3 text-bear-blue" />
              <span className="font-medium text-bear-blue">Pro Tip</span>
            </div>
            <p className="text-xs text-gray-500">
              Type <code className="px-1 py-0.5 bg-white/10 rounded text-bear-blue">@</code> to mention a robot.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#020511]">
        {/* Header */}
        <header className="h-14 sm:h-16 px-3 sm:px-6 border-b border-white/5 flex items-center justify-between bg-[#0F1117]/50 backdrop-blur-sm">
          {/* Mobile menu toggle */}
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 -ml-2 rounded-lg hover:bg-white/5 lg:hidden"
          >
            <Hash className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hidden lg:block" />
            <h2 className="font-semibold text-white text-sm sm:text-base truncate">{activeChannel}</h2>
            {activeChannel === 'qcom-support' && (
              <span className="hidden sm:inline ml-2 px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs font-medium whitespace-nowrap">
                Partner
              </span>
            )}
            {activeChannel === 'robot-alerts' && (
              <span className="hidden sm:inline ml-2 px-2 py-0.5 rounded-full border border-bear-blue/20 bg-bear-blue/10 text-bear-blue text-[10px] sm:text-xs font-medium whitespace-nowrap">
                Alerts
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-4 text-gray-400">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 hover:text-white cursor-pointer transition-colors" />
            <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 hover:text-white cursor-pointer transition-colors" />
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          {currentMessages.map((msg) => (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 sm:gap-4 ${msg.isBot ? 'bg-bear-blue/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-bear-blue/20' : ''}`}
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 text-sm sm:text-base ${
                msg.isBot ? 'bg-bear-blue text-white' : 'bg-gradient-to-br from-gray-700 to-gray-600 text-white'
              }`}>
                {msg.isBot ? <Bot className="w-4 h-4 sm:w-5 sm:h-5" /> : msg.sender[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <span className={`font-semibold text-sm sm:text-base ${msg.isBot ? 'text-bear-blue' : 'text-white'}`}>
                    {msg.sender}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500">{msg.timestamp}</span>
                </div>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  <MessageContent content={msg.content} />
                </p>
                {msg.robotId && (
                  <div className="mt-3 flex items-center gap-3">
                    <Link 
                      href={`/robots/${msg.robotId}`}
                      className="text-xs font-medium text-bear-blue hover:text-bear-blue/80 bg-bear-blue/10 px-3 py-1.5 rounded-lg transition-colors border border-bear-blue/20 inline-flex items-center gap-1.5"
                    >
                      <Bot className="w-3 h-3" />
                      View Robot
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <button className="text-xs font-medium text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors border border-white/10 hover:bg-white/5">
                      View Logs
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {currentMessages.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <Hash className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Welcome to #{activeChannel}!</p>
              <p className="text-sm">This is the start of the conversation.</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-[#0F1117]/50 backdrop-blur-sm">
          <div className="relative">
            <AnimatePresence>
              {mentionQuery !== null && (
                <RobotMentionDropdown
                  query={mentionQuery}
                  onSelect={handleRobotSelect}
                  onClose={() => setMentionQuery(null)}
                />
              )}
            </AnimatePresence>
            
            <div className="bg-[#0F1117] border border-white/10 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 focus-within:border-bear-blue/50 transition-all duration-300 focus-within:shadow-lg focus-within:shadow-bear-blue/5">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={handleInputChange}
                placeholder={`Message #${activeChannel} — Type @ to mention a robot`}
                className="w-full bg-transparent text-sm sm:text-base text-white px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none resize-none h-9 sm:h-10 min-h-[36px] sm:min-h-[40px] placeholder-gray-500"
              />
              <div className="flex items-center justify-between px-1.5 sm:px-2 pt-1.5 sm:pt-2 border-t border-white/5 mt-1.5 sm:mt-2">
                <div className="flex items-center gap-0.5 sm:gap-1 text-gray-500">
                  <button className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg transition-colors hover:text-white"><Paperclip className="w-4 h-4" /></button>
                  <button className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg transition-colors hover:text-white"><Smile className="w-4 h-4" /></button>
                  <button 
                    onClick={() => setMentionQuery('')}
                    className="p-1.5 sm:p-2 hover:bg-bear-blue/10 rounded-lg transition-colors hover:text-bear-blue flex items-center gap-1"
                    title="Mention a robot"
                  >
                    <Bot className="w-4 h-4" />
                  </button>
                </div>
                <button className="p-2 sm:p-2.5 bg-bear-blue text-white rounded-lg sm:rounded-xl hover:bg-bear-blue/90 transition-all active:scale-95 sm:hover:scale-105 shadow-lg shadow-bear-blue/20">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
