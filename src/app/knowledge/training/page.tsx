'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  GraduationCap as AcademicCapIcon,
  CheckCircle as CheckCircleIcon,
  PlayCircle as PlayCircleIcon,
  ShieldCheck as ShieldCheckIcon,
  Clock as ClockIcon,
  Zap as BoltIcon,
  Map as MapIcon,
  Wrench as WrenchScrewdriverIcon,
  ChevronRight as ChevronRightIcon,
  X as XMarkIcon,
  Box as CubeIcon,
  Users as UserGroupIcon,
  Sparkles as SparklesIcon,
  ClipboardCheck as ClipboardDocumentCheckIcon,
  Lightbulb as LightBulbIcon,
  ArrowRight as ArrowRightIcon,
  AlertTriangle as ExclamationTriangleIcon,
  ChevronLeft as ChevronLeftIcon
} from 'lucide-react';

export default function TrainingPage() {
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [trainingStarted, setTrainingStarted] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bear-training-progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCompletedModules(parsed);
          setTrainingStarted(true);
          // Resume at next incomplete module or the last one
          const nextModule = parsed.length < modules.length ? parsed.length : parsed.length - 1;
          // Don't auto-set to 0 if we have progress, start at the dashboard or next step
          if (nextModule > 0) {
             setCurrentModule(nextModule);
          }
        }
      } catch (e) {
        console.error("Failed to load training progress", e);
      }
    }
  }, []);

  // Save progress
  useEffect(() => {
    if (completedModules.length > 0) {
      localStorage.setItem('bear-training-progress', JSON.stringify(completedModules));
    }
  }, [completedModules]);

  const modules = [
    {
      id: 0,
      title: 'Welcome',
      subtitle: 'Introduction',
      icon: <AcademicCapIcon className="w-5 h-5" />,
      duration: '2 min',
    },
    {
      id: 1,
      title: 'Meet Servi',
      subtitle: 'Hardware Overview',
      icon: <CubeIcon className="w-5 h-5" />,
      duration: '3 min',
    },
    {
      id: 2,
      title: 'Getting Started',
      subtitle: 'Start of Shift',
      icon: <BoltIcon className="w-5 h-5" />,
      duration: '5 min',
    },
    {
      id: 3,
      title: 'Using Servi',
      subtitle: 'Core Operations',
      icon: <PlayCircleIcon className="w-5 h-5" />,
      duration: '5 min',
    },
    {
      id: 4,
      title: 'Best Practices',
      subtitle: 'Pro Tips',
      icon: <SparklesIcon className="w-5 h-5" />,
      duration: '3 min',
    },
    {
      id: 5,
      title: 'Quick Tips',
      subtitle: 'Troubleshooting',
      icon: <LightBulbIcon className="w-5 h-5" />,
      duration: '2 min',
    },
  ];

  const startTraining = () => {
    setTrainingStarted(true);
    if (!completedModules.includes(0)) {
        setCompletedModules(prev => [...prev, 0]);
    }
    setCurrentModule(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    const moduleId = currentModule;
    if (!completedModules.includes(moduleId)) {
      setCompletedModules(prev => [...prev, moduleId]);
    }
    
    if (moduleId === modules.length - 1) {
      setShowCongrats(true);
    } else {
      const nextId = moduleId + 1;
      setCurrentModule(nextId);
      // Optional: scroll top if content is very long, but with fixed footer it might not be needed
      // window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentModule > 1) {
        setCurrentModule(currentModule - 1);
    }
  };

  const jumpToModule = (id: number) => {
    if (id === 0 || completedModules.includes(id - 1) || completedModules.includes(id)) {
        setCurrentModule(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const progress = Math.round((completedModules.length / modules.length) * 100);

  return (
    <div className="min-h-screen bg-[#020511] text-white" ref={topRef}>
      {/* Compact Header */}
      <header className="sticky top-0 z-40 bg-[#020511]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/knowledge" className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            Servi Training
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-bear-blue/20 text-bear-blue border border-bear-blue/20">
                                NEW STAFF
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                        <div className="text-xs text-gray-400 mb-1">Progress</div>
                        <div className="text-sm font-bold text-white">{progress}%</div>
                    </div>
                    <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-bear-blue to-cyan-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-full">
            
            {/* Sidebar Navigation */}
            <aside className="hidden lg:block col-span-3 h-full overflow-y-auto pr-2 custom-scrollbar">
                <nav className="space-y-2">
                    {modules.map((module, idx) => {
                        const isActive = currentModule === module.id;
                        const isCompleted = completedModules.includes(module.id);
                        const isLocked = !isCompleted && !isActive && (idx > 0 && !completedModules.includes(idx - 1));

                        return (
                            <button
                                key={module.id}
                                onClick={() => !isLocked && jumpToModule(module.id)}
                                disabled={isLocked}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 group ${
                                    isActive 
                                        ? 'bg-bear-blue text-white shadow-lg shadow-bear-blue/20' 
                                        : isCompleted
                                        ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                                        : 'text-gray-500 opacity-60 cursor-not-allowed'
                                }`}
                            >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                    isActive ? 'bg-white/20' : isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-white/5'
                                }`}>
                                    {isCompleted && !isActive ? <CheckCircleIcon className="w-5 h-5" /> : module.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold truncate">{module.title}</div>
                                    <div className={`text-xs truncate ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                                        {module.subtitle}
                                    </div>
                                </div>
                                {isActive && (
                                    <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="col-span-12 lg:col-span-9 h-full flex flex-col">
                <AnimatePresence mode="wait">
                    {!trainingStarted ? (
                        <div className="h-full">
                             <ModuleWelcome onComplete={startTraining} />
                        </div>
                    ) : (
                        <motion.div
                            key="content-card"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-[#0f1423] border border-white/10 rounded-3xl shadow-2xl flex flex-col h-full overflow-hidden relative"
                        >
                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentModule}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {currentModule === 1 && <ModuleMeetServi />}
                                        {currentModule === 2 && <ModuleGettingStarted />}
                                        {currentModule === 3 && <ModuleUsingServi />}
                                        {currentModule === 4 && <ModuleBestPractices />}
                                        {currentModule === 5 && <ModuleQuickTips />}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Fixed Footer Action Bar */}
                            <div className="p-6 border-t border-white/5 bg-[#0a0f1c]/50 backdrop-blur-md flex items-center justify-between">
                                <button 
                                    onClick={handleBack}
                                    disabled={currentModule <= 1}
                                    className={`text-sm font-medium px-6 py-3 rounded-xl transition-colors ${
                                        currentModule <= 1 
                                            ? 'text-gray-600 cursor-not-allowed' 
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Back
                                </button>

                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider hidden sm:block">
                                        Step {currentModule} of {modules.length - 1}
                                    </span>
                                    <button 
                                        onClick={handleNext} 
                                        className="btn-primary"
                                    >
                                        {currentModule === modules.length - 1 ? 'Complete Training' : 'Continue'} 
                                        {currentModule === modules.length - 1 ? <CheckCircleIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </main>

      {/* Congrats Modal */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCongrats(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-8 lg:p-12 max-w-lg w-full relative shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
                {/* Confetti-like decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(81,166,214,0.1)_0%,transparent_50%)] animate-spin-slow" />
                </div>

              <button
                onClick={() => setShowCongrats(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>

              <div className="text-center relative z-10">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                    className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30"
                >
                  <CheckCircleIcon className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Training Complete!
                </h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  You've successfully completed the Servi training modules. You're now certified to work with Servi Plus!
                </p>
                
                <div className="flex flex-col gap-3">
                    <Link
                    href="/knowledge"
                    className="w-full py-3.5 bg-bear-blue text-white font-semibold rounded-xl hover:bg-bear-blue-light transition-all shadow-lg shadow-bear-blue/20 flex items-center justify-center gap-2"
                    >
                    Back to Knowledge Base
                    </Link>
                    <button
                        onClick={() => setShowCongrats(false)}
                        className="w-full py-3.5 bg-white/5 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-all"
                    >
                        Review Training
                    </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Module Components with Rich Data ---

function ModuleWelcome({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="bg-[#0f1423] border border-white/10 rounded-3xl p-8 lg:p-12 text-center h-full flex flex-col justify-center items-center relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-bear-blue/5 to-transparent pointer-events-none" />
        
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-bear-blue rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-bear-blue/20 rotate-3"
        >
            <AcademicCapIcon className="w-10 h-10 text-white" />
        </motion.div>

        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Welcome to the Team</h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            This interactive training will guide you through everything you need to know about working with your new robot colleague, Servi Plus.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
            {[
                { icon: ClockIcon, label: "20 Minutes", desc: "Short & sweet" },
                { icon: PlayCircleIcon, label: "Interactive", desc: "Learn by doing" },
                { icon: ShieldCheckIcon, label: "Certified", desc: "Get ready" },
            ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                    <item.icon className="w-6 h-6 text-bear-blue mx-auto mb-2" />
                    <div className="font-semibold text-white">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
            ))}
        </div>

        <button
            onClick={onComplete}
            className="group px-8 py-4 bg-white text-bear-dark font-bold rounded-full hover:scale-105 transition-all shadow-xl hover:shadow-white/20 flex items-center gap-2"
        >
            Start Training
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
    </div>
  );
}

function ModuleMeetServi() {
    return (
        <div className="space-y-6">
            <div className="bear-glass-card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-bear-blue/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 text-bear-blue mb-2">
                            <CubeIcon className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase tracking-wider">Overview</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Meet Servi Plus</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-6">
                            Servi Plus is an autonomous service robot that helps deliver food and clear tables. It works alongside you to make service faster and more efficient.
                        </p>
                    </div>
                    {/* Placeholder for Robot Image/Graphic */}
                    <div className="w-32 h-32 bg-gradient-to-br from-bear-blue to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-bear-blue/20">
                        <CubeIcon className="w-16 h-16 text-white" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { icon: WrenchScrewdriverIcon, title: "Three Trays", desc: "Can carry multiple dishes at once. Maximum 40kg total capacity.", color: "text-blue-400", bg: "bg-blue-500/10" },
                    { icon: ShieldCheckIcon, title: "Smart & Safe", desc: "Automatically stops if someone is in the way. Built-in safety features.", color: "text-green-400", bg: "bg-green-500/10" },
                    { icon: MapIcon, title: "Easy Control", desc: "Simple touchscreen interface - tap where you want it to go.", color: "text-purple-400", bg: "bg-purple-500/10" },
                    { icon: BoltIcon, title: "All-Day Battery", desc: "Runs for 8-12 hours on a full charge. Perfect for busy shifts.", color: "text-orange-400", bg: "bg-orange-500/10" },
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#0f1423] border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-colors"
                    >
                        <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center mb-4`}>
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <h3 className="font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function ModuleGettingStarted() {
    return (
        <div className="space-y-6">
            <div className="bear-glass-card p-8">
                <h2 className="text-3xl font-bold text-white mb-2">Getting Started</h2>
                <p className="text-gray-400 text-lg mb-8">Follow this morning checklist to start your shift right.</p>

                <div className="space-y-4">
                    {[
                        { 
                            title: "Check the Battery", 
                            desc: "Look at the screen - you should see a green battery icon showing 80-100%. This means Servi is ready to work.",
                            icon: "1"
                        },
                        { 
                            title: "Visual Inspection", 
                            desc: "Check if the trays look good and the wheels are clean. Takes just a few seconds.",
                            icon: "2"
                        },
                        { 
                            title: "Clean the Trays", 
                            desc: "Give the trays a quick wipe with a clean cloth to ensure everything is sanitary.",
                            icon: "3"
                        },
                    ].map((step, i) => (
                        <motion.div 
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.15 }}
                            className="flex gap-5 bg-white/5 p-5 rounded-2xl border border-white/5"
                        >
                            <div className="flex-shrink-0 w-10 h-10 bg-bear-blue rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-bear-blue/20">
                                {step.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}

                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex gap-5 bg-green-500/10 p-5 rounded-2xl border border-green-500/20"
                    >
                        <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                            <CheckCircleIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-green-400 mb-1">You're Ready</h3>
                            <p className="text-green-200/70 leading-relaxed">That's it! Servi is ready to help you have a productive shift.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function ModuleUsingServi() {
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bear-glass-card p-6 h-full">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        Correct Loading
                    </h3>
                    <div className="space-y-3">
                        {[
                            "Place items in the center of trays",
                            "Distribute weight evenly",
                            "Use all three trays when possible",
                            "Make sure items are stable"
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bear-glass-card p-6 h-full border-red-500/20">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <XMarkIcon className="w-5 h-5 text-red-500" />
                        Avoid This
                    </h3>
                    <div className="space-y-3">
                        {[
                            "Overload (max 40kg total)",
                            "Stack items too high",
                            "Rush - take your time",
                            "Let items hang off edges"
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bear-glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Sending Servi</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { title: "Tap Screen", desc: "Select where you want Servi to go from the map." },
                        { title: "Confirm", desc: "Tap 'Yes' and Servi will start moving to destination." },
                        { title: "Walk Ahead", desc: "Clear the path and inform customers if needed." },
                    ].map((step, i) => (
                        <div key={i} className="text-center relative">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4 border border-white/10">
                                {i + 1}
                            </div>
                            <h4 className="font-bold text-white mb-2">{step.title}</h4>
                            <p className="text-sm text-gray-400">{step.desc}</p>
                            {i < 2 && (
                                <div className="hidden md:block absolute top-6 left-1/2 w-full h-[1px] bg-gradient-to-r from-white/20 to-transparent -z-10" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ModuleBestPractices() {
    return (
        <div className="space-y-6">
            <div className="bear-glass-card p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Best Practices</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { icon: UserGroupIcon, title: "Communicate", desc: "Always announce when Servi is approaching. A simple heads-up keeps everyone aware and comfortable.", color: "text-blue-400" },
                        { icon: WrenchScrewdriverIcon, title: "Efficient Loading", desc: "Use all three trays to maximize each trip. Heavy items on bottom, lighter items on top.", color: "text-green-400" },
                        { icon: MapIcon, title: "Clear Paths", desc: "Watch for obstacles like chairs and bags. A clear path means faster and smoother service.", color: "text-purple-400" },
                        { icon: ClipboardDocumentCheckIcon, title: "End of Shift", desc: "Quick wipe down, check for debris, and park on charger. Takes 2 minutes and keeps Servi ready.", color: "text-orange-400" },
                    ].map((item, i) => (
                        <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-start gap-4">
                                <item.icon className={`w-6 h-6 ${item.color} mt-1`} />
                                <div>
                                    <h3 className="font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6 rounded-2xl border border-yellow-500/20 flex items-start gap-4">
                <div className="bg-yellow-500/20 p-3 rounded-lg">
                    <LightBulbIcon className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                    <h3 className="font-bold text-white mb-1">Key Reminder</h3>
                    <p className="text-gray-300">If something doesn't feel right, tell your manager. It's always better to ask than to guess.</p>
                </div>
            </div>
        </div>
    );
}

function ModuleQuickTips() {
    return (
        <div className="space-y-6">
            <div className="bear-glass-card p-8">
                <h2 className="text-3xl font-bold text-white mb-2">Quick Tips</h2>
                <p className="text-gray-400 mb-8">Common situations and simple solutions</p>

                <div className="space-y-4">
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex gap-4">
                        <BoltIcon className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-white mb-1">Low Battery</h3>
                            <p className="text-sm text-gray-400">Servi will automatically return to the charger. If it seems lost, send it to "Home" on the screen.</p>
                        </div>
                    </div>

                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex gap-4">
                        <ExclamationTriangleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-white mb-1">Servi Won't Move</h3>
                            <p className="text-sm text-gray-400">Check if the red emergency button on the base is pressed. Twist it clockwise to release.</p>
                        </div>
                    </div>

                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex gap-4">
                        <ClockIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-white mb-1">Screen Not Working</h3>
                            <p className="text-sm text-gray-400">Wipe it with a clean cloth first. Still not working? Restart Servi by holding the power button for 10 seconds.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
