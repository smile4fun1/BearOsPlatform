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
  ChevronLeft as ChevronLeftIcon,
  RotateCcw as RestartIcon
} from 'lucide-react';

export default function TrainingPage() {
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [trainingStarted, setTrainingStarted] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
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
      duration: '4 min',
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
      title: 'Safety & Communication',
      subtitle: 'Customer Interaction',
      icon: <UserGroupIcon className="w-5 h-5" />,
      duration: '4 min',
    },
    {
      id: 5,
      title: 'Best Practices',
      subtitle: 'Pro Tips',
      icon: <SparklesIcon className="w-5 h-5" />,
      duration: '3 min',
    },
    {
      id: 6,
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

  const handleRestartClick = () => {
    setShowRestartConfirm(true);
  };

  const confirmRestart = () => {
        setCompletedModules([]);
        setTrainingStarted(false);
        setCurrentModule(0);
    setShowCongrats(false);
    setShowRestartConfirm(false);
        localStorage.removeItem('bear-training-progress');
  };

  const cancelRestart = () => {
    setShowRestartConfirm(false);
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
    // If going to Welcome, allow it even if not "complete" (since it's the start)
    // But logic below handles it: id === 0 is always allowed.
    if (id === 0 || completedModules.includes(id - 1) || completedModules.includes(id)) {
        setCurrentModule(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const progress = Math.round((completedModules.length / modules.length) * 100);

  return (
    <div className="min-h-screen bg-[#020511] text-white" ref={topRef}>
      {/* Compact Header */}
      <header className="sticky top-0 z-40 bg-[#020511]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <Link href="/knowledge" className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors flex-shrink-0">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-base sm:text-xl font-bold text-white flex items-center gap-2 truncate">
                            <span className="truncate">Servi Training</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-bear-blue/20 text-bear-blue border border-bear-blue/20 flex-shrink-0">
                                NEW STAFF
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    {/* Restart Button */}
                    <button 
                        onClick={handleRestartClick}
                        className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                        title="Restart Training"
                    >
                        <RestartIcon className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                        <span className="hidden lg:inline text-xs font-medium">Restart</span>
                    </button>

                    <div className="hidden sm:block text-right">
                        <div className="text-xs text-gray-400 mb-1">Progress</div>
                        <div className="text-sm font-bold text-white">{progress}%</div>
                    </div>
                    <div className="w-20 sm:w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-bear-blue to-cyan-400"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[600px]">
            
            {/* Sidebar Navigation */}
            <aside className="hidden lg:block col-span-3 sticky top-24">
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
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="col-span-12 lg:col-span-9 flex flex-col">
                <AnimatePresence mode="wait">
                    {!trainingStarted ? (
                             <ModuleWelcome onComplete={startTraining} />
                    ) : (
                        <div
                            key="content-card"
                            className="bg-[#0f1423] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative h-[calc(100vh-140px)] sm:h-[calc(100vh-200px)] max-h-[700px]"
                        >
                            {/* Content - FIXED ON MOBILE, SCROLLABLE ON DESKTOP */}
                            <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden lg:overflow-y-auto overflow-x-hidden">
                                <AnimatePresence mode="wait">
                                    <div
                                        key={currentModule}
                                    >
                                        {currentModule === 0 && <WelcomeContent onComplete={handleNext} />}
                                        {currentModule === 1 && <ModuleMeetServi />}
                                        {currentModule === 2 && <ModuleGettingStarted />}
                                        {currentModule === 3 && <ModuleUsingServi />}
                                        {currentModule === 4 && <ModuleSafetyCommunication />}
                                        {currentModule === 5 && <ModuleBestPractices />}
                                        {currentModule === 6 && <ModuleQuickTips />}
                                    </div>
                                </AnimatePresence>
                            </div>

                            {/* Fixed Footer Action Bar - MOBILE OPTIMIZED */}
                            {currentModule > 0 && (
                            <div className="p-3 sm:p-6 border-t border-white/5 bg-[#0a0f1c]/50 backdrop-blur-md flex items-center justify-between flex-shrink-0">
                                <button 
                                    onClick={handleBack}
                                    disabled={currentModule <= 0}
                                    className={`text-sm font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-colors ${
                                        currentModule <= 0
                                            ? 'text-gray-600 cursor-not-allowed' 
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Back
                                </button>

                                <div className="flex items-center gap-2 sm:gap-4">
                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider hidden sm:block">
                                        Step {currentModule} of {modules.length - 1}
                                    </span>
                                    <button 
                                        onClick={handleNext} 
                                        className="btn-primary text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3"
                                    >
                                        <span className="hidden sm:inline">{currentModule === modules.length - 1 ? 'Complete Training' : 'Continue'}</span>
                                        <span className="sm:hidden">{currentModule === modules.length - 1 ? 'Complete' : 'Next'}</span>
                                        {currentModule === modules.length - 1 ? <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                                    </button>
                                </div>
                            </div>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </main>

      {/* Restart Confirmation Modal */}
      <AnimatePresence>
        {showRestartConfirm && (
            <div
              className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
              onClick={cancelRestart}
            >
            <div
              className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-8 lg:p-12 max-w-lg w-full relative shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={cancelRestart}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>

              <div className="text-center relative z-10">
                <div
                    className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/30"
                >
                  <ExclamationTriangleIcon className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Restart Training?
                </h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  This will reset all your progress. You'll need to complete the training from the beginning.
                </p>
                
                <div className="flex flex-col gap-3">
                    <button
                        onClick={confirmRestart}
                        className="w-full py-3.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                    >
                        <RestartIcon className="w-5 h-5" />
                        Yes, Restart Training
                    </button>
                    <button
                        onClick={cancelRestart}
                        className="w-full py-3.5 bg-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/20 transition-all"
                    >
                        Cancel
                    </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Congrats Modal */}
      <AnimatePresence>
        {showCongrats && (
          <div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
            onClick={() => setShowCongrats(false)}
          >
            <div
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
                <div
                    className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30"
                >
                  <CheckCircleIcon className="w-12 h-12 text-white" />
                </div>
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
                    onClick={() => {
                        localStorage.removeItem('bear-training-progress');
                    }}
                    >
                    Back to Knowledge Base
                    </Link>
                    <button
                        onClick={confirmRestart}
                        className="w-full py-3.5 bg-white/5 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        <RestartIcon className="w-5 h-5" />
                        Restart Training
                    </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Module Components with Rich Data ---

function WelcomeContent({ onComplete }: { onComplete: () => void }) {
    return (
        <div className="flex flex-col justify-center items-center text-center py-6 sm:py-12 relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-bear-blue/5 to-transparent pointer-events-none" />
            
            <div
                className="w-16 h-16 sm:w-20 sm:h-20 bg-bear-blue rounded-2xl flex items-center justify-center mb-4 sm:mb-8 shadow-xl shadow-bear-blue/20 rotate-3"
            >
                <AcademicCapIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
    
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-6">Welcome to the Team</h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-6 sm:mb-12 leading-relaxed px-4">
                This interactive training will guide you through everything you need to know about working with your new robot colleague, Servi Plus.
            </p>
    
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-3xl mb-6 sm:mb-12 px-4">
                {[
                    { icon: ClockIcon, label: "25 Minutes", desc: "Comprehensive" },
                    { icon: PlayCircleIcon, label: "Interactive", desc: "Learn by doing" },
                    { icon: ShieldCheckIcon, label: "Certified", desc: "Get ready" },
                ].map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center text-center">
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-bear-blue mx-auto mb-2 sm:mb-3" />
                        <div className="font-semibold text-white mb-1 text-sm sm:text-base">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                ))}
            </div>
    
            <button
                onClick={onComplete}
                className="group px-6 py-3 sm:px-8 sm:py-4 bg-white text-bear-dark font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-white/20 flex items-center gap-2 text-sm sm:text-base"
            >
                Start Training
                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}

function ModuleWelcome({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="bg-[#0f1423] border border-white/10 rounded-3xl p-6 lg:p-12 text-center flex flex-col justify-center items-center relative overflow-hidden shadow-2xl h-[calc(100vh-200px)] max-h-[700px]">
        <WelcomeContent onComplete={onComplete} />
    </div>
  );
}

function ModuleMeetServi() {
    return (
        <div className="space-y-3 sm:space-y-6 h-full flex flex-col">
            <div className="bear-glass-card p-3 sm:p-6 relative overflow-hidden flex items-center flex-shrink-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-bear-blue/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 sm:gap-6 w-full">
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center gap-2 text-bear-blue mb-2 justify-center md:justify-start">
                            <CubeIcon className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase tracking-wider">Overview</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Meet Servi Plus</h2>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Autonomous service robot for food delivery and table clearing. Works alongside you for faster service.
                        </p>
                    </div>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-bear-blue to-cyan-400 rounded-full flex items-center justify-center shadow-2xl shadow-bear-blue/20 flex-shrink-0">
                        <CubeIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 flex-1 overflow-y-auto lg:overflow-visible">
                {[
                    { icon: WrenchScrewdriverIcon, title: "Three Trays", desc: "Can carry multiple dishes at once. Maximum 40kg total capacity.", bg: "bg-bear-blue/10", border: "border-bear-blue/20" },
                    { icon: ShieldCheckIcon, title: "Smart & Safe", desc: "Automatically stops if someone is in the way. Built-in safety features.", bg: "bg-bear-blue/10", border: "border-bear-blue/20" },
                    { icon: MapIcon, title: "Easy Control", desc: "Simple touchscreen interface - tap where you want it to go.", bg: "bg-bear-blue/10", border: "border-bear-blue/20" },
                    { icon: BoltIcon, title: "All-Day Battery", desc: "Runs for 8-12 hours on a full charge. Perfect for busy shifts.", bg: "bg-bear-blue/10", border: "border-bear-blue/20" },
                ].map((item, i) => (
                    <div 
                        key={i}
                        className={`${item.bg} border ${item.border} p-2 sm:p-5 rounded-lg sm:rounded-xl hover:bg-bear-blue/15 transition-all flex flex-col`}
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-bear-blue/20 rounded-lg flex items-center justify-center mb-1.5 sm:mb-3 flex-shrink-0">
                            <item.icon className="w-4 h-4 sm:w-6 sm:h-6 text-bear-blue" />
                        </div>
                        <h3 className="font-bold text-white mb-1 sm:mb-2 text-xs sm:text-base leading-tight">{item.title}</h3>
                        <p className="text-[10px] sm:text-sm text-gray-300 leading-snug sm:leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ModuleGettingStarted() {
    return (
        <div className="space-y-3 sm:space-y-6 h-full flex flex-col">
            <div className="bear-glass-card p-3 sm:p-6 flex flex-col justify-center flex-shrink-0">
                <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">Getting Started</h2>
                <p className="text-gray-300 text-xs sm:text-sm">Morning checklist - takes 2 minutes</p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:gap-4 flex-1 overflow-y-auto lg:overflow-visible">
                {[
                    { 
                        title: "Battery Check", 
                        desc: "Look at the screen - you should see a green battery icon showing 80-100%. This means Servi is ready to work.",
                        icon: "1"
                    },
                    { 
                        title: "Visual Inspection", 
                        desc: "Check if the trays look good and the wheels are clean. Takes just a few seconds.",
                        icon: "2"
                    },
                    { 
                        title: "Wipe Down", 
                        desc: "Give the trays a quick wipe with a clean cloth to ensure everything is sanitary.",
                        icon: "3"
                    },
                    { 
                        title: "Power On", 
                        desc: "Press the power button and wait for the startup screen. Button glows blue when ready.",
                        icon: "4"
                    },
                    { 
                        title: "Check Sensors", 
                        desc: "Make sure no objects are blocking the sensors around the base of the robot.",
                        icon: "5"
                    },
                ].map((step, i) => (
                    <div 
                        key={i}
                        className="flex gap-2 sm:gap-4 bg-white/5 p-2.5 sm:p-5 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                    >
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-bear-blue rounded-full flex items-center justify-center font-bold text-sm sm:text-lg shadow-lg shadow-bear-blue/20">
                            {step.icon}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-white mb-0.5 sm:mb-2 text-xs sm:text-sm leading-tight">{step.title}</h3>
                            <p className="text-gray-300 leading-snug text-[10px] sm:text-xs">{step.desc}</p>
                        </div>
                    </div>
                ))}

                <div
                    className="flex gap-3 sm:gap-4 bg-green-500/10 p-4 sm:p-5 rounded-xl border border-green-500/20"
                >
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                        <CheckCircleIcon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-green-400 mb-1.5 sm:mb-2 text-sm">Ready!</h3>
                        <p className="text-green-200/70 leading-relaxed text-xs">That's it! Servi is ready to help you have a productive shift.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ModuleUsingServi() {
    return (
        <div className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <div className="bear-glass-card p-4 sm:p-5 flex flex-col border-l-4 border-green-500">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        Correct Loading
                    </h3>
                    <div className="space-y-2 sm:space-y-3 flex-1">
                        {[
                            "Place items in the center of trays",
                            "Distribute weight evenly",
                            "Use all three trays when possible",
                            "Make sure items are stable"
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bear-glass-card p-4 sm:p-5 flex flex-col border-l-4 border-red-500">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                        <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                        Avoid This
                    </h3>
                    <div className="space-y-2 sm:space-y-3 flex-1">
                        {[
                            "Overload (max 40kg total)",
                            "Stack items too high",
                            "Rush - take your time",
                            "Let items hang off edges"
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bear-glass-card p-4 sm:p-6 flex flex-col justify-center">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Sending Servi</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    {[
                        { title: "Tap Screen", desc: "Select where you want Servi to go from the map" },
                        { title: "Confirm", desc: "Tap 'Yes' and Servi will start moving to destination" },
                        { title: "Walk Ahead", desc: "Clear the path and inform customers if needed" },
                    ].map((step, i) => (
                        <div key={i} className="text-center">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-bear-blue rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold mx-auto mb-3 sm:mb-4 shadow-lg shadow-bear-blue/20">
                                {i + 1}
                            </div>
                            <h4 className="font-bold text-white mb-2 text-sm sm:text-base">{step.title}</h4>
                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ModuleSafetyCommunication() {
    return (
        <div className="space-y-4 sm:space-y-5">
            <div className="bear-glass-card p-4 sm:p-5 flex flex-col justify-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Safety & Communication</h2>
                <p className="text-gray-300 text-sm">Working safely with customers around</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                    { icon: UserGroupIcon, title: "Alert Customers", desc: "Say 'Robot coming through' or 'Excuse me' before Servi approaches tables." },
                    { icon: ShieldCheckIcon, title: "Safe Distance", desc: "Keep 1 meter clearance around Servi when moving. Never reach under." },
                    { icon: MapIcon, title: "Clear Pathways", desc: "Move chairs, bags, and obstacles out of Servi's path before sending." },
                    { icon: ClockIcon, title: "Peak Hours", desc: "During busy times, coordinate with team to manage Servi routes." },
                    { icon: SparklesIcon, title: "Professional", desc: "Explain to curious customers that Servi is your helper. Builds positive perception." },
                    { icon: BoltIcon, title: "Emergency Stop", desc: "Red button on base. Press in emergency. Twist clockwise to resume." },
                ].map((item, i) => (
                    <div 
                        key={i}
                        className="bg-bear-blue/5 p-3 sm:p-4 rounded-xl border border-bear-blue/20 hover:bg-bear-blue/10 transition-all flex flex-col"
                    >
                        <div className="flex items-start gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-bear-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-bear-blue" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-white mb-1 sm:mb-1.5 text-sm">{item.title}</h3>
                                <p className="text-xs text-gray-300 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 p-3 sm:p-4 rounded-xl border border-red-500/30 flex items-start gap-2 sm:gap-3">
                <div className="bg-red-500/20 p-2 sm:p-2.5 rounded-lg flex-shrink-0">
                    <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                </div>
                <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm mb-1">Safety First</h3>
                    <p className="text-gray-300 text-xs leading-relaxed">Stop Servi immediately if you see any hazard. Customer safety is always priority.</p>
                </div>
            </div>
        </div>
    );
}

function ModuleBestPractices() {
    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="bear-glass-card p-4 sm:p-6 flex flex-col justify-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Best Practices</h2>
                <p className="text-gray-300 text-sm">Pro tips from experienced team</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                    { icon: UserGroupIcon, title: "Customer Alert", desc: "Always announce when Servi is approaching. A simple heads-up keeps everyone aware and comfortable." },
                    { icon: WrenchScrewdriverIcon, title: "Smart Loading", desc: "Use all three trays to maximize each trip. Heavy items on bottom, lighter items on top." },
                    { icon: MapIcon, title: "Path Watch", desc: "Watch for obstacles like chairs and bags. A clear path means faster and smoother service." },
                    { icon: ClipboardDocumentCheckIcon, title: "Shift End", desc: "Quick wipe down, check for debris, and park on charger. Takes 2 minutes and keeps Servi ready." },
                    { icon: ShieldCheckIcon, title: "Safety First", desc: "Never rush loading or sending. Stable loads only. Safety over speed always." },
                    { icon: SparklesIcon, title: "Keep Clean", desc: "Daily tray wipes are essential. Clean robot means happy customers." },
                    ].map((item, i) => (
                    <div 
                        key={i}
                        className="bg-bear-blue/5 p-4 sm:p-5 rounded-xl border border-bear-blue/20 hover:bg-bear-blue/10 transition-all flex flex-col"
                    >
                        <div className="flex items-start gap-2 sm:gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-bear-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-bear-blue" />
                            </div>
                            <div className="min-w-0">
                                    <h3 className="font-bold text-white mb-1.5 sm:mb-2 text-sm sm:text-base">{item.title}</h3>
                                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                    </div>
                    ))}
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 p-4 sm:p-5 rounded-xl border border-yellow-500/30 flex items-start gap-3 sm:gap-4">
                <div className="bg-yellow-500/20 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                    <LightBulbIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                </div>
                <div className="min-w-0">
                    <h3 className="font-bold text-white mb-1.5 sm:mb-2 text-sm sm:text-base">Always Ask</h3>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">If something doesn't feel right, tell your manager. It's always better to ask than to guess.</p>
                </div>
            </div>
        </div>
    );
}

function ModuleQuickTips() {
    return (
        <div className="space-y-3 sm:space-y-4">
            <div className="bear-glass-card p-4 flex flex-col justify-center">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Quick Tips</h2>
                <p className="text-gray-300 text-sm">Common situations and simple solutions</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-3 rounded-xl border-2 border-yellow-500/30 flex flex-col">
                    <div className="w-9 h-9 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-2">
                        <BoltIcon className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h3 className="font-bold text-white mb-1.5 text-sm">Low Battery</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">Servi auto-returns to charger. If it seems lost, send it to "Home" on screen.</p>
                </div>

                <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 p-3 rounded-xl border-2 border-red-500/30 flex flex-col">
                    <div className="w-9 h-9 bg-red-500/20 rounded-lg flex items-center justify-center mb-2">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                    </div>
                    <h3 className="font-bold text-white mb-1.5 text-sm">Servi Won't Move</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">Check red emergency button on base. Twist clockwise to release.</p>
                </div>

                <div className="bg-gradient-to-br from-bear-blue/10 to-cyan-600/5 p-3 rounded-xl border-2 border-bear-blue/30 flex flex-col">
                    <div className="w-9 h-9 bg-bear-blue/20 rounded-lg flex items-center justify-center mb-2">
                        <ClockIcon className="w-5 h-5 text-bear-blue" />
                        </div>
                    <h3 className="font-bold text-white mb-1.5 text-sm">Screen Not Working</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">Wipe with cloth first. Still not working? Hold power button 10 seconds.</p>
                    </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/5 p-3 rounded-xl border-2 border-green-500/30 flex flex-col">
                    <div className="w-9 h-9 bg-green-500/20 rounded-lg flex items-center justify-center mb-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    </div>
                    <h3 className="font-bold text-white mb-1.5 text-sm">Need Help?</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">Your manager and team are always there for you. Don't hesitate to ask.</p>
                        </div>
                    </div>

            <div className="bg-gradient-to-r from-green-500/15 to-emerald-500/10 p-3 rounded-xl border border-green-500/30 flex items-start gap-2 sm:gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg flex-shrink-0">
                    <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                </div>
                        <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm">You're Ready!</h3>
                    <p className="text-gray-200 text-xs leading-relaxed">Working with Servi will feel natural within a few shifts. Welcome to the team!</p>
                </div>
            </div>
        </div>
    );
}


