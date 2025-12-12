'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, Sparkles, Book, ChevronRight, ArrowRight, Bot, 
  ChevronDown, Zap, Wrench, Wifi, Battery, MapPin, Settings,
  HelpCircle, GraduationCap
} from 'lucide-react';
import { faqData, categories } from '@/lib/bearKnowledge';
import { aiClient } from '@/lib/aiClient';

// Category icons
const categoryIcons: Record<string, React.ReactNode> = {
  'general': <Zap className="w-6 h-6" />,
  'power': <Battery className="w-6 h-6" />,
  'operation': <MapPin className="w-6 h-6" />,
  'cleaning': <Wrench className="w-6 h-6" />,
  'connectivity': <Wifi className="w-6 h-6" />,
  'troubleshooting': <Settings className="w-6 h-6" />,
};

function KnowledgeContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState<{ answer: string; sources: string[] } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Handle URL search parameter
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

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

  const handleAiSearch = async () => {
    if (!query) return;
    setIsSearching(true);
    setAiResponse(null);
    try {
      const response = await aiClient.ask(query);
      setAiResponse(response);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen pb-32 relative">
      {/* Decorative Background */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-bear-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/3 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-6xl mx-auto">
        {/* Hero Header - BearEmeaSupport Style */}
        <motion.header 
          className="mb-6 sm:mb-8 lg:mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div 
            className="inline-block px-4 py-2 rounded-full bg-bear-blue/20 text-bear-blue text-sm font-semibold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            SUPPORT & DOCUMENTATION
          </motion.div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-2 sm:mb-4 tracking-tight">
            Knowledge Base
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Find answers and documentation for your Bear robots
          </p>
        </motion.header>

        {/* Search Bar - Premium Design */}
        <motion.div 
          className="relative mb-10 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={handleAiSearch}
                    disabled={isSearching}
                    className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-110 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg shadow-purple-500/50 focus:outline-none focus:ring-0 focus-visible:outline-none"
                    style={{ outline: 'none' }}
                  >
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </motion.button>
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
        </motion.div>

        {/* AI Response Area */}
        <AnimatePresence>
          {isAiMode && (isSearching || aiResponse) && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-10 max-w-3xl mx-auto"
            >
              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-purple-500/20">
                    <Bot className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="font-semibold text-purple-300 text-sm uppercase tracking-wider">Bear AI Response</span>
                </div>
                
                {isSearching ? (
                  <div className="flex items-center gap-3 text-gray-400">
                    {[0, 1, 2].map((i) => (
                      <motion.span 
                        key={i}
                        className="w-2 h-2 bg-purple-400 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                    <span className="ml-2">Analyzing documentation...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap mb-6 text-lg">
                      {aiResponse?.answer}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {aiResponse?.sources.map((source, i) => (
                        <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                          <Book className="w-3 h-3" />
                          {source}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Training Banner - BearEmeaSupport Featured Course Style */}
        {!query && !isAiMode && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <Link href="/knowledge/training" className="block group">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-bear-blue/20 via-purple-500/10 to-bear-blue/20 border border-white/10 p-8 hover:border-bear-blue/50 transition-all duration-500 hover:shadow-2xl hover:shadow-bear-blue/10">
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
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-full bg-bear-blue text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-bear-blue/30">
                        Featured
                      </span>
                      <span className="text-bear-blue font-medium flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4" />
                        Interactive Course
                      </span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-bear-blue transition-colors">
                      Servi Plus Training
                    </h2>
                    <p className="text-gray-400 max-w-xl leading-relaxed">
                      Master your robot in 20 minutes. Learn the basics of operation, safety, and best practices.
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-bear-blue text-white shadow-lg shadow-bear-blue/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <ChevronRight className="w-7 h-7" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Categories - Modern Horizontal Scroll Design */}
        {!query && !isAiMode && (
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 px-1">
              <HelpCircle className="w-5 h-5 text-bear-blue" />
              Browse by Category
            </h2>
            
            {/* Mobile & Tablet: Horizontal Scroll */}
            <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-3 min-w-max">
                {categories.map((cat, index) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileTap={{ scale: 0.95 }}
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
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Desktop: 3x2 Grid */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-4">
              {categories.map((cat, index) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
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
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* FAQ Results - Modern Clean Accordion */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
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
                  <motion.div
                    animate={{ rotate: expandedFaq === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className={`flex-shrink-0 p-2.5 rounded-xl transition-all duration-300 ${
                      expandedFaq === faq.id 
                        ? 'bg-bear-blue text-white shadow-lg shadow-bear-blue/30' 
                        : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-gray-400'
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>
                
                {/* Answer Content */}
                <AnimatePresence>
                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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
            </motion.div>
          )}
        </motion.div>
      </div>
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