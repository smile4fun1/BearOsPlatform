'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRole } from '@/lib/roleContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
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
  MapPin,
  X,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { robotFleet, searchRobots, Robot } from '@/lib/robotData';

// Dynamic import for emoji picker to avoid SSR issues
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface Message {
  id: string;
  sender: string;
  avatar?: string;
  content: string;
  timestamp: string;
  isBot?: boolean;
  robotId?: string;
  attachments?: { name: string; type: string; url: string }[];
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
  const mentionPattern = /@([A-Za-z0-9\-]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionPattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }

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
  onClose,
  selectedIndex
}: { 
  query: string; 
  onSelect: (robot: Robot) => void; 
  onClose: () => void;
  selectedIndex: number;
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
          <span>Mention a robot (Tab to autocomplete)</span>
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {results.map((robot, index) => (
          <button
            key={robot.id}
            onClick={() => onSelect(robot)}
            className={`w-full flex items-center gap-3 p-3 transition-colors text-left ${
              index === selectedIndex ? 'bg-bear-blue/20' : 'hover:bg-white/5'
            }`}
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
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [channelMessages, setChannelMessages] = useState<Record<string, Message[]>>({});
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const channels: Channel[] = [
    { id: 'general', name: 'general', type: 'public', allowedRoles: ['internal_admin', 'internal_rfe', 'partner_qcom'] },
    { id: 'announcements', name: 'announcements', type: 'public', allowedRoles: ['internal_admin', 'internal_rfe', 'partner_qcom', 'customer_manager'], unread: 2 },
    { id: 'field-ops', name: 'field-ops', type: 'public', allowedRoles: ['internal_admin', 'internal_rfe'] },
    { id: 'qcom-support', name: 'qcom-support', type: 'private', allowedRoles: ['internal_admin', 'partner_qcom'] },
    { id: 'robot-alerts', name: 'robot-alerts', type: 'bot', allowedRoles: ['internal_admin', 'internal_rfe'], unread: 5 },
  ];

  const initialMessages: Record<string, Message[]> = {
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
    ],
    'announcements': []
  };

  // Initialize messages
  useEffect(() => {
    setChannelMessages(initialMessages);
  }, []);

  const visibleChannels = channels.filter(c => c.allowedRoles.includes(role));
  const currentMessages = channelMessages[activeChannel] || [];

  // Handle input change and detect @ mentions
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputText(value);

    const cursorPos = e.target.selectionStart || 0;
    const textBeforeCursor = value.slice(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@([A-Za-z0-9\-]*)$/);

    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setMentionStartIndex(mentionMatch.index || 0);
      setSelectedMentionIndex(0);
    } else {
      setMentionQuery(null);
    }
  };

  // Handle robot selection from dropdown
  const handleRobotSelect = (robot: Robot) => {
    const before = inputText.slice(0, mentionStartIndex);
    const after = inputText.slice(inputRef.current?.selectionStart || inputText.length);
    setInputText(`${before}@${robot.name} ${after}`);
    setMentionQuery(null);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation in mention dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle mention dropdown navigation
    if (mentionQuery !== null) {
      const results = searchRobots(mentionQuery).slice(0, 5);
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Tab' && results.length > 0) {
        e.preventDefault();
        handleRobotSelect(results[selectedMentionIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setMentionQuery(null);
      }
      return;
    }

    // Handle Enter to send (Shift+Enter for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Send message
  const handleSendMessage = () => {
    if (!inputText.trim() && attachedFiles.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: inputText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      attachments: attachedFiles.length > 0 ? attachedFiles.map(file => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      })) : undefined
    };

    setChannelMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMessage]
    }));

    setInputText('');
    setAttachedFiles([]);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  // Handle emoji selection
  const handleEmojiSelect = (emojiData: any) => {
    const emoji = emojiData.emoji;
    const cursorPos = inputRef.current?.selectionStart || inputText.length;
    const before = inputText.slice(0, cursorPos);
    const after = inputText.slice(cursorPos);
    setInputText(before + emoji + after);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setAttachedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  // Remove attached file
  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const [showSidebar, setShowSidebar] = useState(false);
  
  return (
    <div className="flex h-screen bg-[#020511] overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      
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
      
      {/* Channel Sidebar */}
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
          
          <div className="hidden sm:block mx-4 mt-6 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Bot className="w-3 h-3 text-bear-blue" />
              <span className="font-medium text-bear-blue">Pro Tip</span>
            </div>
            <p className="text-xs text-gray-500 mb-1">
              Type <code className="px-1 py-0.5 bg-white/10 rounded text-bear-blue">@</code> to mention a robot.
            </p>
            <p className="text-xs text-gray-500">
              Press <code className="px-1 py-0.5 bg-white/10 rounded text-bear-blue">Tab</code> to autocomplete.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div 
        className="flex-1 flex flex-col min-w-0 bg-[#020511]"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-bear-blue/20 backdrop-blur-sm z-40 flex items-center justify-center border-4 border-dashed border-bear-blue">
            <div className="text-center">
              <Paperclip className="w-16 h-16 text-bear-blue mx-auto mb-4" />
              <p className="text-white text-xl font-bold">Drop files here</p>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="h-14 sm:h-16 px-3 sm:px-6 border-b border-white/5 flex items-center justify-between bg-[#0F1117]/50 backdrop-blur-sm">
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
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.attachments.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                        {file.type.startsWith('image/') ? <ImageIcon className="w-4 h-4 text-bear-blue" /> : <FileText className="w-4 h-4 text-bear-blue" />}
                        <span className="text-xs text-gray-300">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
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
                  selectedIndex={selectedMentionIndex}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 mb-2 z-50"
                >
                  <EmojiPicker onEmojiClick={handleEmojiSelect} theme="dark" />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="bg-[#0F1117] border border-white/10 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 focus-within:border-bear-blue/50 transition-all duration-300 focus-within:shadow-lg focus-within:shadow-bear-blue/5">
              {attachedFiles.length > 0 && (
                <div className="px-2 py-2 flex flex-wrap gap-2 border-b border-white/5 mb-2">
                  {attachedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                      {file.type.startsWith('image/') ? <ImageIcon className="w-3 h-3 text-bear-blue" /> : <FileText className="w-3 h-3 text-bear-blue" />}
                      <span className="text-xs text-gray-300 truncate max-w-[150px]">{file.name}</span>
                      <button onClick={() => handleRemoveFile(i)} className="text-gray-500 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={`Message #${activeChannel} — Type @ to mention a robot`}
                className="w-full bg-transparent text-sm sm:text-base text-white px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none resize-none min-h-[36px] sm:min-h-[40px] max-h-32 placeholder-gray-500"
                rows={1}
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                }}
              />
              <div className="flex items-center justify-between px-1.5 sm:px-2 pt-1.5 sm:pt-2 border-t border-white/5 mt-1.5 sm:mt-2">
                <div className="flex items-center gap-0.5 sm:gap-1 text-gray-500">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg transition-colors hover:text-white"
                    title="Attach file"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg transition-colors hover:text-white"
                    title="Add emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      setMentionQuery('');
                      inputRef.current?.focus();
                    }}
                    className="p-1.5 sm:p-2 hover:bg-bear-blue/10 rounded-lg transition-colors hover:text-bear-blue flex items-center gap-1"
                    title="Mention a robot"
                  >
                    <Bot className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() && attachedFiles.length === 0}
                  className="p-2 sm:p-2.5 bg-bear-blue text-white rounded-lg sm:rounded-xl hover:bg-bear-blue/90 transition-all active:scale-95 sm:hover:scale-105 shadow-lg shadow-bear-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
