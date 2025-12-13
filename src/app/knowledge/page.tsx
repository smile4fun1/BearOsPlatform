'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, Sparkles, Book, ChevronRight, ArrowRight, Bot, 
  ChevronDown, Zap, Wrench, Wifi, Battery, MapPin, Settings,
  HelpCircle, GraduationCap, Send, User, MessageSquare
} from 'lucide-react';
import { faqData, categories } from '@/lib/bearKnowledge';
import { aiClient, Message } from '@/lib/aiClient';
import { Footer } from '@/components/Footer';

// Category icons
const categoryIcons: Record<string, React.ReactNode> = {
  'general': <Zap className="w-6 h-6" />,
  'power': <Battery className="w-6 h-6" />,
  'operation': <MapPin className="w-6 h-6" />,
  'cleaning': <Wrench className="w-6 h-6" />,
  'connectivity': <Wifi className="w-6 h-6" />,
  'troubleshooting': <Settings className="w-6 h-6" />,
};

interface ChatMessage extends Message {
  id: string;
  sources?: string[];
  suggestedQuestions?: string[];
}

function KnowledgeContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  
  // Standard Search State
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Handle URL search parameter
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isSearching]);

  const filteredFaqs = faqData.filter(faq => {
    if (activeCategory && faq.category !== activeCategory) return false;
    if (!query) return true;
    const lowerQuery = query.toLowerCase();
    return (
      faq.question.toLowerCase().includes(lowerQuery) ||
      faq.answer.toLowerCase().includes(lowerQuery) ||
      faq.keywords.some(k => k.toLowerCase().includes(lowerQuery))
    );
  });

  const handleAiSearch = async (overrideQuery?: string) => {
    const searchQuery = overrideQuery || query;
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // If it's a new top-level search (using main input), reset chat
    const isNewConversation = !!overrideQuery || query === searchQuery;
    
    let newHistory: ChatMessage[] = isNewConversation 
      ? [{ role: 'user', content: searchQuery, id: Date.now().toString() }]
      : [...chatMessages, { role: 'user', content: searchQuery, id: Date.now().toString() }];
    
    if (isNewConversation) {
        setChatMessages(newHistory);
        setCurrentSuggestions([]);
    } else {
        setChatMessages(prev => [...prev, { role: 'user', content: searchQuery, id: Date.now().toString() }]);
        setChatInput(''); // Clear chat input
    }

    try {
      // Prepare history for API (exclude IDs and extra fields)
      const apiHistory = newHistory.map(({ role, content }) => ({ role, content }));
      
      // We pass empty query because we're passing the full history which includes the latest query
      const response = await aiClient.ask('', apiHistory);
      
      const botMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        suggestedQuestions: response.suggestedQuestions,
        id: (Date.now() + 1).toString()
      };

      setChatMessages(prev => [...prev, botMessage]);
      setCurrentSuggestions(response.suggestedQuestions || []);
    } finally {
      setIsSearching(false);
    }
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    handleAiSearch(chatInput);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // If interacting via chat input (bottom), treat as chat
    // If interacting via top search, treat as chat
    // Just call handleAiSearch with the suggestion
    
    // We want to append this to the current chat
    setChatInput('');
    
    // Manually update state to show user selection immediately
    const userMsg: ChatMessage = { role: 'user', content: suggestion, id: Date.now().toString() };
    setChatMessages(prev => [...prev, userMsg]);
    
    setIsSearching(true);
    
    // Call API
    (async () => {
        try {
            const apiHistory = [...chatMessages, userMsg].map(({ role, content }) => ({ role, content }));
            const response = await aiClient.ask('', apiHistory);
            
            const botMessage: ChatMessage = {
                role: 'assistant',
                content: response.answer,
                sources: response.sources,
                suggestedQuestions: response.suggestedQuestions,
                id: (Date.now() + 1).toString()
            };

            setChatMessages(prev => [...prev, botMessage]);
            setCurrentSuggestions(response.suggestedQuestions || []);
        } finally {
            setIsSearching(false);
        }
    })();
  };

  return (
    <div className="h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto relative w-full">
      {/* Decorative Background */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-bear-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/3 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-6xl mx-auto">
        {/* Hero Header - BearEmeaSupport Style */}
        <header 
          className="mb-6 sm:mb-8 lg:mb-10 text-center"
        >
          <div 
            className="inline-block px-4 py-2 rounded-full bg-bear-blue/20 text-bear-blue text-sm font-semibold mb-6"
          >
            SUPPORT & DOCUMENTATION
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-2 sm:mb-4 tracking-tight">
            Knowledge Base
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Find answers and documentation for your Bear robots
          </p>
        </header>

        {/* Search Bar - Premium Design */}
        <div 
          className="relative mb-10 max-w-4xl mx-auto"
        >
          {/* Search Container */}
          <div className={`group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border transition-all duration-500 shadow-2xl ${
            isAiMode 
              ? 'border-purple-500/30 shadow-purple-500/20' 
              : 'border-white/10 shadow-black/20'
          }`}>
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none ${
              isAiMode 
                ? 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 opacity-100' 
                : 'bg-gradient-to-r from-bear-blue/5 via-transparent to-bear-blue/5 opacity-0 group-focus-within:opacity-100'
            }`} />
            
            {/* Main Input Container */}
            <div className="relative flex items-center p-2">
              {/* Icon */}
              <div className={`flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                isAiMode 
                  ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20' 
                  : 'bg-white/5'
              }`}>
                {isAiMode ? (
                  <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                ) : (
                  <Search className="w-6 h-6 text-white/60" />
                )}
              </div>
              
              {/* Input */}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && isAiMode && handleAiSearch()}
                placeholder={isAiMode ? "Ask AI anything about your robots..." : "Search for \"LIDAR error\" or \"robot won't start\"..."}
                className="flex-1 bg-transparent border-none text-white px-5 py-4 focus:outline-none focus:ring-0 focus:border-none placeholder:text-white/30 text-base sm:text-lg font-medium [&:focus]:outline-none [&:focus]:ring-0 [&:focus-visible]:outline-none"
                style={{ outline: 'none', boxShadow: 'none' }}
              />
              
              {/* AI Toggle & Search Button */}
              <div className="flex items-center gap-3 pr-2">
                {/* AI Toggle Switch */}
                <button
                  onClick={() => setIsAiMode(!isAiMode)}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`relative inline-flex items-center gap-3 px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 group outline-none border-none ${
                    isAiMode 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50' 
                      : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white border border-white/10'
                  }`}
                  style={{ outline: 'none !important', boxShadow: isAiMode ? '0 0 0 0 transparent' : 'none', WebkitTapHighlightColor: 'transparent' }}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className={`w-4 h-4 transition-transform ${isAiMode ? 'rotate-0' : 'rotate-12'}`} />
                    <span className="hidden sm:inline">{isAiMode ? 'AI' : 'AI'}</span>
                  </div>
                  
                  {/* Toggle Indicator */}
                  <div className={`flex items-center justify-between w-11 h-6 rounded-full transition-all duration-300 ${
                    isAiMode ? 'bg-white/30' : 'bg-white/20'
                  }`}>
                    <div className={`w-5 h-5 rounded-full shadow-lg transition-all duration-300 ${
                      isAiMode 
                        ? 'bg-white translate-x-5' 
                        : 'bg-white/60 translate-x-0.5'
                    }`} />
                  </div>
                </button>
                
                {/* Search/Ask Button */}
                {isAiMode && query && (
                  <button
                    onClick={() => handleAiSearch()}
                    disabled={isSearching}
                    className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-110 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg shadow-purple-500/50 focus:outline-none focus:ring-0 focus-visible:outline-none"
                    style={{ outline: 'none' }}
                  >
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Popular Searches */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-medium text-white/40">Popular:</span>
            {['charging', 'navigation', 'wifi', 'sensors', 'maintenance'].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-bear-blue/20 hover:text-bear-blue border border-white/10 hover:border-bear-blue/30 transition-all focus:outline-none focus:ring-0 focus-visible:outline-none"
                style={{ outline: 'none' }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* AI Chat Interface */}
        <>
          {isAiMode && chatMessages.length > 0 && (
            <div
              className="mb-10 max-w-4xl mx-auto"
            >
              {/* Chat Container */}
              <div className="bg-[#0A0F1C] border border-purple-500/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[500px] max-h-[700px]">
                
                {/* Header */}
                <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/20">
                    <Bot className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-sm">Bear AI Assistant</h3>
                        <p className="text-xs text-gray-400">Powered by Bear Knowledge Base</p>
                    </div>
                </div>

                {/* Messages Area */}
                <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                >
                    {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                msg.role === 'user' ? 'bg-bear-blue' : 'bg-purple-500/20'
                            }`}>
                                {msg.role === 'user' ? (
                                    <User className="w-4 h-4 text-white" />
                                ) : (
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                )}
                            </div>

                            {/* Message Bubble */}
                            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-5 py-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                                    msg.role === 'user' 
                                        ? 'bg-bear-blue text-white rounded-tr-sm' 
                                        : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-sm'
                                }`}>
                                    {msg.content.split(/(\*\*.*?\*\*)/g).map((part, i) => 
                                        part.startsWith('**') && part.endsWith('**') 
                                        ? <strong key={i} className={`font-semibold ${msg.role === 'user' ? 'text-white' : 'text-purple-300'}`}>{part.slice(2, -2)}</strong> 
                                        : part
                                    )}
                                </div>
                                
                                {/* Sources (Assistant Only) */}
                                {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {msg.sources.map((source, i) => (
                                            <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-gray-500">
                                                <Book className="w-3 h-3" />
                                                {source}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Loading Indicator */}
                    {isSearching && (
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/10 rounded-tl-sm">
                                <div 
                                    className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                                />
                                <div 
                                    className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                                />
                                <div 
                                    className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Suggestions & Input Area */}
                <div className="p-4 border-t border-white/5 bg-[#0A0F1C]">
                    
                    {/* Suggested Questions Chips */}
                    {!isSearching && currentSuggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {currentSuggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium hover:bg-purple-500/20 hover:border-purple-500/30 transition-all text-left"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Chat Input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                            placeholder="Ask a follow-up question..."
                            disabled={isSearching}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all disabled:opacity-50"
                        />
                        <button
                            onClick={handleChatSubmit}
                            disabled={!chatInput.trim() || isSearching}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-purple-500 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>

              </div>
            </div>
          )}
        </>

        {/* Training Banner - BearEmeaSupport Featured Course Style */}
        {(!isAiMode || (isAiMode && chatMessages.length === 0)) && !query && (
          <div className="mb-10 grid gap-6 md:grid-cols-2">
            <div
            >
              <Link href="/knowledge/training" className="block group h-full">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-bear-blue/20 via-purple-500/10 to-bear-blue/20 border border-white/10 p-8 hover:border-bear-blue/50 transition-all duration-500 hover:shadow-2xl hover:shadow-bear-blue/10 h-full">
                  {/* Background Image */}
                  <div className="absolute right-0 bottom-0 w-48 h-48 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    <Image
                      src="/assets/Servi.png"
                      alt=""
                      width={192}
                      height={192}
                      className="object-contain translate-x-8 translate-y-8 w-full h-full"
                      loading="eager"
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-bear-blue text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-bear-blue/30">
                          Featured
                        </span>
                        <span className="text-bear-blue font-medium flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4" />
                          Course
                        </span>
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-bear-blue transition-colors">
                        Servi Plus Training
                      </h2>
                      <p className="text-gray-400 leading-relaxed text-sm">
                        Master your robot in 20 minutes. Learn the basics of operation, safety, and best practices.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-bear-blue font-semibold group-hover:gap-4 transition-all">
                        Start Training <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div
            >
              <Link href="/knowledge/training/carti" className="block group h-full">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-bear-blue/20 via-purple-500/10 to-bear-blue/20 border border-white/10 p-8 hover:border-bear-blue/50 transition-all duration-500 hover:shadow-2xl hover:shadow-bear-blue/10 h-full">
                  {/* Background Image */}
                  <div className="absolute right-0 bottom-0 w-48 h-48 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    <Image
                      src="/whybear_amr.webp"
                      alt=""
                      width={192}
                      height={192}
                      className="object-contain translate-x-8 translate-y-8 w-full h-full"
                      loading="eager"
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-bear-blue text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-bear-blue/30">
                          Featured
                        </span>
                        <span className="text-bear-blue font-medium flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4" />
                          Course
                        </span>
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-bear-blue transition-colors">
                        Carti 100 Training
                      </h2>
                      <p className="text-gray-400 leading-relaxed text-sm">
                        Comprehensive guide for the Carti 100 autonomous logistics robot. Safety, mapping, and heavy payload ops.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-bear-blue font-semibold group-hover:gap-4 transition-all">
                        Start Training <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Categories - Modern Horizontal Scroll Design */}
        {(!isAiMode || (isAiMode && chatMessages.length === 0)) && !query && (
          <div 
            className="mb-10"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 px-1">
              <HelpCircle className="w-5 h-5 text-bear-blue" />
              Browse by Category
            </h2>
            
            {/* Mobile & Tablet: Horizontal Scroll */}
            <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-3 min-w-max">
                {categories.map((cat, index) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                    className={`group relative flex-shrink-0 w-[140px] h-[140px] rounded-2xl border transition-all duration-300 focus:outline-none focus:ring-0 overflow-hidden ${
                      activeCategory === cat.id
                        ? 'bg-bear-blue/20 border-bear-blue shadow-lg shadow-bear-blue/20'
                        : 'bg-white/5 border-white/10 active:bg-white/10'
                    }`}
                    style={{ outline: 'none' }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-3 py-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 flex-shrink-0 transition-all duration-300 ${
                        activeCategory === cat.id 
                          ? 'bg-bear-blue text-white' 
                          : 'bg-white/10 text-gray-400'
                      }`}>
                        {categoryIcons[cat.id] || <Book className="w-6 h-6" />}
                      </div>
                      <div className={`font-bold text-sm leading-[1.2] text-center w-full px-1 transition-colors overflow-hidden ${
                        activeCategory === cat.id ? 'text-white' : 'text-white/90'
                      }`} style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word'
                      }}>
                        {cat.label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop: 3x2 Grid */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-4">
              {categories.map((cat, index) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={`group relative h-[100px] rounded-2xl border transition-all duration-300 focus:outline-none focus:ring-0 overflow-hidden ${
                    activeCategory === cat.id
                      ? 'bg-bear-blue/20 border-bear-blue shadow-xl shadow-bear-blue/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
                  }`}
                  style={{ outline: 'none' }}
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300 pointer-events-none ${
                    activeCategory === cat.id
                      ? 'from-bear-blue/20 to-bear-blue/5 opacity-100'
                      : 'from-white/5 to-transparent opacity-0 group-hover:opacity-100'
                  }`} />
                  
                  {/* Content */}
                  <div className="relative h-full flex items-center gap-4 px-5 py-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      activeCategory === cat.id 
                        ? 'bg-bear-blue text-white shadow-lg' 
                        : 'bg-white/10 text-gray-400 group-hover:bg-white/15'
                    }`}>
                      {categoryIcons[cat.id] || <Book className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0 text-left pr-1">
                      <h3 className={`font-bold text-base leading-snug mb-0.5 transition-colors truncate ${
                        activeCategory === cat.id ? 'text-white' : 'text-white/90 group-hover:text-white'
                      }`}>
                        {cat.label}
                      </h3>
                      <p className={`text-[11px] leading-tight transition-colors line-clamp-2 ${
                        activeCategory === cat.id ? 'text-white/70' : 'text-gray-500 group-hover:text-gray-400'
                      }`}>
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                    activeCategory === cat.id 
                      ? 'text-bear-blue translate-x-1' 
                      : 'text-gray-600 group-hover:text-gray-400 group-hover:translate-x-1'
                  }`} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Results - Modern Clean Accordion */}
        {(!isAiMode || (isAiMode && chatMessages.length === 0)) && (
            <div 
            className="space-y-3"
            >
            {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                <div
                    key={faq.id
                    className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
                    expandedFaq === faq.id 
                        ? 'bg-white/10 border-bear-blue/50 shadow-xl shadow-bear-blue/10' 
                        : 'bg-white/5 border-white/10 hover:bg-white/[0.07] hover:border-white/20'
                    }`}
                >
                    {/* Question Button */}
                    <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full p-5 sm:p-6 flex items-start justify-between gap-4 text-left focus:outline-none focus:ring-0 focus-visible:outline-none"
                    style={{ outline: 'none' }}
                    >
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                            expandedFaq === faq.id 
                            ? 'bg-bear-blue text-white shadow-sm' 
                            : 'bg-white/10 text-gray-400 group-hover:bg-white/15'
                        }`}>
                            {faq.category.replace('-', ' ')}
                        </span>
                        </div>
                        <h3 className={`text-base sm:text-lg font-bold leading-snug transition-colors ${
                        expandedFaq === faq.id ? 'text-white' : 'text-white/90 group-hover:text-white'
                        }`}>
                        {faq.question}
                        </h3>
                    </div>
                    <div
                        className={`flex-shrink-0 p-2.5 rounded-xl transition-all duration-300 ${
                        expandedFaq === faq.id 
                            ? 'bg-bear-blue text-white shadow-lg shadow-bear-blue/30' 
                            : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-gray-400'
                        }`}
                    >
                        <ChevronDown className="w-5 h-5" />
                    </div>
                    </button>
                    
                    {/* Answer Content */}
                    <>
                    {expandedFaq === faq.id && (
                        <div
                        className="overflow-hidden"
                        >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-transparent via-bear-blue/30 to-transparent mb-5" />
                            
                            {/* Answer Text */}
                            <div className="relative">
                            {/* Subtle background accent */}
                            <div className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-bear-blue via-bear-blue/50 to-transparent rounded-full" />
                            
                            <div className="pl-4">
                                <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                {faq.answer}
                                </p>
                            </div>
                            </div>
                        </div>
                        </div>
                    )}
                    </>
                </div>
                ))
            ) : (
            <div 
                className="text-center py-20"
            >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 mb-6">
                    <Search className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or enable AI mode for smarter answers.</p>
                <button
                    onClick={() => setIsAiMode(true)}
                    className="btn-primary"
                >
                    <Sparkles className="w-4 h-4" />
                    Try AI Search
                </button>
                </div>
            )}
            </div>
        )}
      </div>
      </main>
      <Footer />
    </div>
  );
}

export default function KnowledgePage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-bear-blue border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <KnowledgeContent />
    </Suspense>
  );
}





