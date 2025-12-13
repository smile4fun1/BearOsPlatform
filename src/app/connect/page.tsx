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
  Image as ImageIcon,
  FolderOpen,
  Settings,
  Users,
  Archive,
  Pin,
  VolumeX,
  LogOut,
  Download,
  Plus,
  Globe,
  UserPlus,
  Check,
  AlertCircle
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
  reactions?: { emoji: string; users: string[]; count: number }[];
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
          <span>Mention a robot (Tab/Enter to select)</span>
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

// Robot search modal for robot button
function RobotSearchModal({
  searchQuery,
  onSearchChange,
  onSelect,
  onClose
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelect: (robot: Robot) => void;
  onClose: () => void;
}) {
  const results = useMemo(() => {
    if (!searchQuery || searchQuery.length < 1) return robotFleet.slice(0, 20);
    return searchRobots(searchQuery).slice(0, 20);
  }, [searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-[#1a1f36] border border-white/10 rounded-2xl w-full max-w-2xl h-[550px] max-h-[75vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-bear-blue" />
              <h3 className="text-lg font-bold text-white">Select Robot</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search robots by name, serial, or location..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-bear-blue/50 transition-colors"
              autoFocus
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No robots found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((robot) => (
                <button
                  key={robot.id}
                  onClick={() => onSelect(robot)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-bear-blue/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-bear-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{robot.name}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-mono truncate">{robot.serialNumber}</span>
                      <span>•</span>
                      <span className="truncate">{robot.facility}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Battery className="w-3 h-3" />
                      {robot.battery}%
                    </div>
                    <span className={`text-xs font-medium ${
                      robot.status === 'active' ? 'text-emerald-400' :
                      robot.status === 'error' ? 'text-rose-400' :
                      robot.status === 'charging' ? 'text-blue-400' :
                      'text-gray-400'
                    }`}>
                      {robot.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
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
  const [showRobotSearch, setShowRobotSearch] = useState(false);
  const [robotSearchQuery, setRobotSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChannelMenu, setShowChannelMenu] = useState(false);
  const [showFilesPanel, setShowFilesPanel] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showChannelSettings, setShowChannelSettings] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  const [mutedChannels, setMutedChannels] = useState<string[]>([]);
  const [pinnedMessages, setPinnedMessages] = useState<Record<string, Message[]>>({});
  const [channelList, setChannelList] = useState<Channel[]>([
    { id: 'general', name: 'general', type: 'public', allowedRoles: ['internal_admin', 'internal_rfe', 'partner_qcom'] },
    { id: 'announcements', name: 'announcements', type: 'public', allowedRoles: ['internal_admin', 'internal_rfe', 'partner_qcom', 'customer_manager'], unread: 2 },
    { id: 'field-ops', name: 'field-ops', type: 'public', allowedRoles: ['internal_admin', 'internal_rfe'] },
    { id: 'qcom-support', name: 'qcom-support', type: 'private', allowedRoles: ['internal_admin', 'partner_qcom'] },
    { id: 'robot-alerts', name: 'robot-alerts', type: 'bot', allowedRoles: ['internal_admin', 'internal_rfe'], unread: 5 },
  ]);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const filesPanelRef = useRef<HTMLDivElement>(null);
  const channelMenuRef = useRef<HTMLDivElement>(null);


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

  // Initialize messages from localStorage or use initial messages
  useEffect(() => {
    const savedMessages = localStorage.getItem('bear-connect-messages');
    if (savedMessages) {
      try {
        setChannelMessages(JSON.parse(savedMessages));
      } catch (e) {
        setChannelMessages(initialMessages);
      }
    } else {
      setChannelMessages(initialMessages);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(channelMessages).length > 0) {
      localStorage.setItem('bear-connect-messages', JSON.stringify(channelMessages));
    }
  }, [channelMessages]);

  const visibleChannels = channelList.filter(c => c.allowedRoles.includes(role));
  const currentMessages = channelMessages[activeChannel] || [];

  // Click outside to close panels
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (notificationsRef.current && !notificationsRef.current.contains(target) && showNotifications) {
        const notifButton = document.querySelector('[title="Notifications"]');
        if (notifButton && !notifButton.contains(target)) {
          setShowNotifications(false);
        }
      }
      
      if (filesPanelRef.current && !filesPanelRef.current.contains(target) && showFilesPanel) {
        const filesButton = document.querySelector('[title="Channel files"]');
        if (filesButton && !filesButton.contains(target)) {
          setShowFilesPanel(false);
        }
      }
      
      if (channelMenuRef.current && !channelMenuRef.current.contains(target) && showChannelMenu) {
        const menuButton = document.querySelector('[title="Channel settings"]');
        if (menuButton && !menuButton.contains(target)) {
          setShowChannelMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications, showFilesPanel, showChannelMenu]);

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
      } else if ((e.key === 'Tab' || e.key === 'Enter') && results.length > 0) {
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
    setShowEmojiPicker(false);
    setTimeout(() => {
      inputRef.current?.focus();
      // Move cursor after emoji
      const newPos = cursorPos + emoji.length;
      inputRef.current?.setSelectionRange(newPos, newPos);
    }, 0);
  };

  // Handle robot search from robot button
  const handleRobotButtonClick = () => {
    setShowRobotSearch(true);
    setRobotSearchQuery('');
  };

  const handleRobotSearchSelect = (robot: Robot) => {
    const cursorPos = inputRef.current?.selectionStart || inputText.length;
    const before = inputText.slice(0, cursorPos);
    const after = inputText.slice(cursorPos);
    setInputText(`${before}@${robot.name} ${after}`);
    setShowRobotSearch(false);
    setRobotSearchQuery('');
    inputRef.current?.focus();
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

  // Channel management functions
  const handleMuteChannel = () => {
    if (mutedChannels.includes(activeChannel)) {
      setMutedChannels(prev => prev.filter(c => c !== activeChannel));
    } else {
      setMutedChannels(prev => [...prev, activeChannel]);
    }
    setShowChannelMenu(false);
  };

  const handlePinMessage = (message: Message) => {
    setPinnedMessages(prev => {
      const channelPins = prev[activeChannel] || [];
      const isPinned = channelPins.some(m => m.id === message.id);
      
      if (isPinned) {
        return {
          ...prev,
          [activeChannel]: channelPins.filter(m => m.id !== message.id)
        };
      } else {
        return {
          ...prev,
          [activeChannel]: [...channelPins, message]
        };
      }
    });
  };

  const handleArchiveChannel = () => {
    if (confirm(`Are you sure you want to archive #${activeChannel}? You can unarchive it later.`)) {
      setChannelList(prev => prev.filter(c => c.id !== activeChannel));
      setActiveChannel('general');
      setShowChannelMenu(false);
    }
  };

  const handleLeaveChannel = () => {
    if (confirm(`Are you sure you want to leave #${activeChannel}? You can always rejoin later.`)) {
      setChannelList(prev => prev.filter(c => c.id !== activeChannel));
      setActiveChannel('general');
      setShowChannelMenu(false);
    }
  };

  // Handle emoji reactions
  const handleReactionClick = (messageId: string, emoji: string) => {
    setChannelMessages(prev => {
      const newMessages = { ...prev };
      const channelMsgs = [...(newMessages[activeChannel] || [])];
      const messageIndex = channelMsgs.findIndex(m => m.id === messageId);
      
      if (messageIndex !== -1) {
        const message = { ...channelMsgs[messageIndex] };
        const reactions = [...(message.reactions || [])];
        const existingReactionIndex = reactions.findIndex(r => r.emoji === emoji);
        
        if (existingReactionIndex !== -1) {
          // Toggle user's reaction
          const reaction = { ...reactions[existingReactionIndex] };
          if (reaction.users.includes('You')) {
            // Remove reaction
            reaction.users = reaction.users.filter(u => u !== 'You');
            reaction.count = Math.max(0, reaction.count - 1);
            if (reaction.count === 0) {
              reactions.splice(existingReactionIndex, 1);
            } else {
              reactions[existingReactionIndex] = reaction;
            }
          } else {
            // Add reaction
            reaction.users = [...reaction.users, 'You'];
            reaction.count += 1;
            reactions[existingReactionIndex] = reaction;
          }
        } else {
          // Add new reaction
          reactions.push({ emoji, users: ['You'], count: 1 });
        }
        
        message.reactions = reactions;
        channelMsgs[messageIndex] = message;
        newMessages[activeChannel] = channelMsgs;
        
        // Save to localStorage immediately
        const storageKey = `bear-connect-messages-${activeChannel}`;
        localStorage.setItem(storageKey, JSON.stringify(channelMsgs));
      }
      
      return newMessages;
    });
    setShowReactionPicker(null);
  };

  // Remove attached file
  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Mock channel files data
  const channelFiles: Record<string, { name: string; type: string; size: string; uploadedBy: string; date: string }[]> = {
    'general': [
      { name: 'Deployment_Guide.pdf', type: 'pdf', size: '2.4 MB', uploadedBy: 'John Smith', date: 'Dec 10, 2024' },
      { name: 'Robot_Specs.xlsx', type: 'excel', size: '156 KB', uploadedBy: 'Sarah Connor', date: 'Dec 9, 2024' },
      { name: 'Floor_Map.png', type: 'image', size: '890 KB', uploadedBy: 'Field Engineer', date: 'Dec 8, 2024' },
    ],
    'qcom-support': [
      { name: 'Service_Report_Dec.pdf', type: 'pdf', size: '3.1 MB', uploadedBy: 'Qcom Tech', date: 'Dec 12, 2024' },
      { name: 'Error_Logs.txt', type: 'text', size: '45 KB', uploadedBy: 'Bear Support', date: 'Dec 11, 2024' },
    ],
    'robot-alerts': [
      { name: 'Incident_Summary.pdf', type: 'pdf', size: '1.8 MB', uploadedBy: 'Fleet Monitor', date: 'Dec 13, 2024' },
    ],
    'field-ops': [
      { name: 'Installation_Checklist.pdf', type: 'pdf', size: '890 KB', uploadedBy: 'RFE Team Lead', date: 'Dec 7, 2024' },
      { name: 'Calibration_Data.csv', type: 'csv', size: '234 KB', uploadedBy: 'Field Engineer', date: 'Dec 6, 2024' },
    ],
    'announcements': []
  };

  // Mock notifications
  const notifications = [
    { id: '1', title: 'New message in #general', message: 'John Smith mentioned you', time: '5 mins ago', unread: true },
    { id: '2', title: '@Servi-Plus-C44E79 alert', message: 'Robot back online after maintenance', time: '15 mins ago', unread: true },
    { id: '3', title: 'Channel update', message: '#field-ops settings changed', time: '1 hour ago', unread: false },
  ];
  
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
          <div className="px-3 sm:px-4 mb-2 flex items-center justify-between">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Channels</div>
            <button
              onClick={() => setShowCreateChannel(true)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title="Create channel"
            >
              <Plus className="w-4 h-4 text-gray-500 hover:text-white" />
            </button>
          </div>
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
                  {mutedChannels.includes(channel.id) && (
                    <VolumeX className="w-3 h-3 text-gray-500" />
                  )}
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
        className="flex-1 flex flex-col min-w-0 bg-[#020511] relative overflow-hidden"
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
            <button
              onClick={() => setShowFilesPanel(!showFilesPanel)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors relative"
              title="Channel files"
            >
              <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 hover:text-white transition-colors" />
              {channelFiles[activeChannel]?.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-bear-blue text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {channelFiles[activeChannel].length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 hover:text-white transition-colors" />
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notifications.filter(n => n.unread).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowChannelMenu(!showChannelMenu)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              title="Channel settings"
            >
              <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 hover:text-white transition-colors" />
            </button>
          </div>
        </header>

        {/* Notifications Panel */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              ref={notificationsRef}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-16 right-4 w-80 bg-[#1a1f36] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-40"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-white">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer ${notif.unread ? 'bg-bear-blue/5' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.unread ? 'bg-bear-blue' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white mb-1">{notif.title}</p>
                        <p className="text-xs text-gray-400 mb-1">{notif.message}</p>
                        <p className="text-xs text-gray-500">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Channel Menu */}
        <AnimatePresence>
          {showChannelMenu && (
            <motion.div
              ref={channelMenuRef}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-16 right-4 w-64 bg-[#1a1f36] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-40"
            >
              <div className="p-2">
                <button 
                  onClick={() => {
                    setShowChannelSettings(true);
                    setShowChannelMenu(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-white">Channel Settings</span>
                </button>
                <button 
                  onClick={() => {
                    setShowMembersModal(true);
                    setShowChannelMenu(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors text-left"
                >
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-white">View Members</span>
                </button>
                <button 
                  onClick={() => {
                    setShowPinnedMessages(true);
                    setShowChannelMenu(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors text-left"
                >
                  <Pin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-white">Pinned Messages</span>
                  {pinnedMessages[activeChannel]?.length > 0 && (
                    <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-full">
                      {pinnedMessages[activeChannel].length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={handleMuteChannel}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors text-left"
                >
                  <VolumeX className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-white">
                    {mutedChannels.includes(activeChannel) ? 'Unmute Channel' : 'Mute Channel'}
                  </span>
                </button>
                <div className="my-2 border-t border-white/10" />
                <button 
                  onClick={handleArchiveChannel}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors text-left"
                >
                  <Archive className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-white">Archive Channel</span>
                </button>
                <button 
                  onClick={handleLeaveChannel}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors text-left text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Leave Channel</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Files Panel */}
        <AnimatePresence>
          {showFilesPanel && (
            <motion.div
              ref={filesPanelRef}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-16 right-4 w-96 bg-[#1a1f36] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-40 max-h-[500px] flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-bear-blue" />
                  <h3 className="font-bold text-white">Channel Files</h3>
                </div>
                <button onClick={() => setShowFilesPanel(false)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {channelFiles[activeChannel]?.length === 0 || !channelFiles[activeChannel] ? (
                  <div className="text-center py-12 text-gray-500">
                    <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No files shared yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {channelFiles[activeChannel]?.map((file, index) => (
                      <div key={index} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors group">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-bear-blue/20 flex items-center justify-center flex-shrink-0">
                            {file.type.includes('pdf') ? <FileText className="w-5 h-5 text-bear-blue" /> :
                             file.type.includes('image') ? <ImageIcon className="w-5 h-5 text-bear-blue" /> :
                             <FileText className="w-5 h-5 text-bear-blue" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{file.name}</p>
                            <p className="text-xs text-gray-400">{file.size} • {file.uploadedBy}</p>
                            <p className="text-xs text-gray-500">{file.date}</p>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all">
                            <Download className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          {currentMessages.map((msg) => (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 sm:gap-4 group relative ${msg.isBot ? 'bg-bear-blue/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-bear-blue/20' : ''}`}
              onMouseEnter={() => setHoveredMessageId(msg.id)}
              onMouseLeave={() => setHoveredMessageId(null)}
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
                  {hoveredMessageId === msg.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePinMessage(msg);
                      }}
                      className={`ml-1 p-1 hover:bg-white/10 rounded transition-all ${
                        pinnedMessages[activeChannel]?.some(m => m.id === msg.id)
                          ? 'text-bear-blue'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title={pinnedMessages[activeChannel]?.some(m => m.id === msg.id) ? "Unpin message" : "Pin message"}
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed" style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
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
                {/* Reactions - Slack Style */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.reactions.map((reaction, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReactionClick(msg.id, reaction.emoji);
                        }}
                        className={`group inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-sm transition-all border ${
                          reaction.users.includes('You')
                            ? 'bg-bear-blue/15 border-bear-blue/50 text-white hover:bg-bear-blue/25 hover:border-bear-blue/60'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                        }`}
                        title={`${reaction.count} ${reaction.count === 1 ? 'person' : 'people'} reacted: ${reaction.users.join(', ')}`}
                        style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}
                      >
                        <span className="text-sm leading-none">{reaction.emoji}</span>
                        <span className={`text-xs font-semibold ${reaction.users.includes('You') ? 'text-bear-blue' : 'text-gray-400 group-hover:text-gray-300'}`}>
                          {reaction.count}
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowReactionPicker(msg.id);
                      }}
                      className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all opacity-0 group-hover:opacity-100"
                      title="Add reaction"
                    >
                      <Smile className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {/* Show add reaction button on hover if no reactions exist */}
                {hoveredMessageId === msg.id && (!msg.reactions || msg.reactions.length === 0) && !showReactionPicker && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-2"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowReactionPicker(msg.id);
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all text-xs"
                    >
                      <Smile className="w-3 h-3" />
                      <span>Add reaction</span>
                    </button>
                  </motion.div>
                )}
              </div>
              {/* Full Emoji Picker for Reactions */}
              <AnimatePresence>
                {showReactionPicker === msg.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 z-50"
                  >
                    <div className="relative">
                      <button
                        onClick={() => setShowReactionPicker(null)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-[#1a1f36] border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          handleReactionClick(msg.id, emojiData.emoji);
                        }}
                        theme="dark"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                  <EmojiPicker 
                    onEmojiClick={handleEmojiSelect} 
                    theme="dark"
                  />
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
                style={{ 
                  height: 'auto',
                  fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}
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
                    onClick={handleRobotButtonClick}
                    className="p-1.5 sm:p-2 hover:bg-bear-blue/10 rounded-lg transition-colors hover:text-bear-blue flex items-center gap-1"
                    title="Search and mention a robot"
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

      {/* Robot Search Modal - Rendered at top level for proper viewport positioning */}
      <AnimatePresence>
        {showRobotSearch && (
          <RobotSearchModal
            searchQuery={robotSearchQuery}
            onSearchChange={setRobotSearchQuery}
            onSelect={handleRobotSearchSelect}
            onClose={() => {
              setShowRobotSearch(false);
              setRobotSearchQuery('');
            }}
          />
        )}
      </AnimatePresence>

      {/* Create Channel Modal */}
      <AnimatePresence>
        {showCreateChannel && (
          <CreateChannelModal
            onClose={() => setShowCreateChannel(false)}
            onCreateChannel={(newChannel) => {
              setChannelList(prev => [...prev, newChannel]);
              setActiveChannel(newChannel.id);
              setShowCreateChannel(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Channel Settings Modal */}
      <AnimatePresence>
        {showChannelSettings && (
          <ChannelSettingsModal
            channel={channelList.find(c => c.id === activeChannel)!}
            onClose={() => setShowChannelSettings(false)}
            onUpdate={(updated) => {
              setChannelList(prev => prev.map(c => c.id === activeChannel ? { ...c, ...updated } : c));
              setShowChannelSettings(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Members Modal */}
      <AnimatePresence>
        {showMembersModal && (
          <MembersModal
            channelName={activeChannel}
            onClose={() => setShowMembersModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Pinned Messages Modal */}
      <AnimatePresence>
        {showPinnedMessages && (
          <PinnedMessagesModal
            messages={pinnedMessages[activeChannel] || []}
            onClose={() => setShowPinnedMessages(false)}
            onUnpin={(msgId) => {
              setPinnedMessages(prev => ({
                ...prev,
                [activeChannel]: (prev[activeChannel] || []).filter(m => m.id !== msgId)
              }));
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Create Channel Modal Component
function CreateChannelModal({ 
  onClose, 
  onCreateChannel 
}: { 
  onClose: () => void;
  onCreateChannel: (channel: Channel) => void;
}) {
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const mockUsers = [
    { id: '1', name: 'Sarah Connor', email: 'sarah@bearos.com', avatar: 'S' },
    { id: '2', name: 'John Smith', email: 'john@bearos.com', avatar: 'J' },
    { id: '3', name: 'Field Engineer', email: 'engineer@bearos.com', avatar: 'F' },
    { id: '4', name: 'Alex Johnson', email: 'alex@bearos.com', avatar: 'A' },
    { id: '5', name: 'Maria Garcia', email: 'maria@bearos.com', avatar: 'M' },
    { id: '6', name: 'David Lee', email: 'david@bearos.com', avatar: 'D' },
    { id: '7', name: 'Emma Wilson', email: 'emma@bearos.com', avatar: 'E' },
    { id: '8', name: 'Chris Brown', email: 'chris@bearos.com', avatar: 'C' },
  ];

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (!channelName.trim()) return;
    
    const newChannel: Channel = {
      id: channelName.toLowerCase().replace(/\s+/g, '-'),
      name: channelName.toLowerCase().replace(/\s+/g, '-'),
      type: isPrivate ? 'private' : 'public',
      allowedRoles: ['internal_admin', 'internal_rfe', 'partner_qcom']
    };
    
    onCreateChannel(newChannel);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#1a1f36] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Create a channel</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Channel Name */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Channel name</label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="e.g. project-launch"
                className="w-full bg-[#0a0f1c] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-bear-blue/50 transition-colors"
                autoFocus
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">Channels are where conversations happen around a topic. Use a name that is easy to find and understand.</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Description <span className="text-gray-500 font-normal">(optional)</span></label>
            <textarea
              value={channelDescription}
              onChange={(e) => setChannelDescription(e.target.value)}
              placeholder="What's this channel about?"
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-bear-blue/50 transition-colors resize-none"
              rows={3}
            />
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Privacy</label>
            <div className="space-y-2">
              <button
                onClick={() => setIsPrivate(false)}
                className={`w-full flex items-start gap-3 p-4 rounded-lg border transition-all ${
                  !isPrivate 
                    ? 'bg-bear-blue/10 border-bear-blue/30' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  !isPrivate ? 'border-bear-blue' : 'border-gray-500'
                }`}>
                  {!isPrivate && <div className="w-2.5 h-2.5 rounded-full bg-bear-blue" />}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-white" />
                    <span className="font-semibold text-white">Public</span>
                  </div>
                  <p className="text-xs text-gray-400">Anyone in your workspace can find and join</p>
                </div>
              </button>
              
              <button
                onClick={() => setIsPrivate(true)}
                className={`w-full flex items-start gap-3 p-4 rounded-lg border transition-all ${
                  isPrivate 
                    ? 'bg-bear-blue/10 border-bear-blue/30' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  isPrivate ? 'border-bear-blue' : 'border-gray-500'
                }`}>
                  {isPrivate && <div className="w-2.5 h-2.5 rounded-full bg-bear-blue" />}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-white" />
                    <span className="font-semibold text-white">Private</span>
                  </div>
                  <p className="text-xs text-gray-400">Only specific people can access</p>
                </div>
              </button>
            </div>
          </div>

          {/* Add People */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Add people <span className="text-gray-500 font-normal">(optional)</span></label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email"
                className="w-full bg-[#0a0f1c] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-bear-blue/50 transition-colors"
              />
            </div>
            
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedUsers.map(userId => {
                  const user = mockUsers.find(u => u.id === userId);
                  return user ? (
                    <div key={userId} className="flex items-center gap-1.5 bg-bear-blue/20 border border-bear-blue/30 text-white px-2.5 py-1 rounded-full text-xs">
                      <span>{user.name}</span>
                      <button onClick={() => setSelectedUsers(prev => prev.filter(id => id !== userId))}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    if (selectedUsers.includes(user.id)) {
                      setSelectedUsers(prev => prev.filter(id => id !== user.id));
                    } else {
                      setSelectedUsers(prev => [...prev, user.id]);
                    }
                  }}
                  className="w-full flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${
                    selectedUsers.includes(user.id) ? 'bg-bear-blue text-white' : 'bg-gradient-to-br from-gray-700 to-gray-600 text-white'
                  } text-xs flex-shrink-0`}>
                    {selectedUsers.includes(user.id) ? <Check className="w-3 h-3" /> : user.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!channelName.trim()}
            className="px-6 py-2 bg-bear-blue text-white rounded-lg hover:bg-bear-blue/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Channel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Channel Settings Modal
function ChannelSettingsModal({ 
  channel, 
  onClose, 
  onUpdate 
}: { 
  channel: Channel;
  onClose: () => void;
  onUpdate: (updates: Partial<Channel>) => void;
}) {
  const [name, setName] = useState(channel.name);
  const [description, setDescription] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#1a1f36] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Channel Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Channel name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-bear-blue/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-bear-blue/50 resize-none"
              rows={3}
              placeholder="What's this channel about?"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
            {channel.type === 'private' ? <Lock className="w-5 h-5 text-gray-400" /> : <Globe className="w-5 h-5 text-gray-400" />}
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{channel.type === 'private' ? 'Private' : 'Public'} channel</p>
              <p className="text-xs text-gray-400">{channel.type === 'private' ? 'Only invited members can see this channel' : 'Anyone in your workspace can find and join'}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onUpdate({ name })}
            disabled={!name.trim()}
            className="px-6 py-2 bg-bear-blue text-white rounded-lg hover:bg-bear-blue/90 transition-colors disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Members Modal
function MembersModal({ 
  channelName, 
  onClose 
}: { 
  channelName: string;
  onClose: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const mockMembers = [
    { id: '1', name: 'Sarah Connor', role: 'Admin', status: 'active', avatar: 'S' },
    { id: '2', name: 'John Smith', role: 'Member', status: 'active', avatar: 'J' },
    { id: '3', name: 'Field Engineer', role: 'Member', status: 'active', avatar: 'F' },
    { id: '4', name: 'Alex Johnson', role: 'Member', status: 'away', avatar: 'A' },
    { id: '5', name: 'Maria Garcia', role: 'Member', status: 'active', avatar: 'M' },
  ];

  const filteredMembers = mockMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#1a1f36] border border-white/10 rounded-2xl w-full max-w-lg max-h-[600px] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">#{channelName} members</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members"
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-bear-blue/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-sm text-gray-400">{filteredMembers.length} members</span>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-bear-blue/10 border border-bear-blue/30 text-bear-blue rounded-lg hover:bg-bear-blue/20 transition-colors text-sm font-medium">
              <UserPlus className="w-4 h-4" />
              Add people
            </button>
          </div>

          <div className="space-y-1">
            {filteredMembers.map(member => (
              <div key={member.id} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-600 text-white flex items-center justify-center font-semibold">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{member.name}</p>
                    <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                  </div>
                  <p className="text-xs text-gray-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Pinned Messages Modal
function PinnedMessagesModal({ 
  messages, 
  onClose, 
  onUnpin 
}: { 
  messages: Message[];
  onClose: () => void;
  onUnpin: (msgId: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#1a1f36] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[600px] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pin className="w-5 h-5 text-bear-blue" />
            <h2 className="text-xl font-bold text-white">Pinned Messages</h2>
            <span className="text-sm text-gray-400">({messages.length})</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Pin className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 mb-2">No pinned messages yet</p>
              <p className="text-sm text-gray-500">Pin important messages to find them easily later</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-600 text-white flex items-center justify-center font-semibold flex-shrink-0">
                      {msg.sender[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-white text-sm">{msg.sender}</span>
                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-300" style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}>
                        {msg.content}
                      </p>
                    </div>
                    <button
                      onClick={() => onUnpin(msg.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                      title="Unpin"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
