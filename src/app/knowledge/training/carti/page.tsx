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
  RotateCcw as RestartIcon,
  Truck as TruckIcon
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
    const saved = localStorage.getItem('bear-training-carti-progress');
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
      localStorage.setItem('bear-training-carti-progress', JSON.stringify(completedModules));
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
      title: 'Meet Carti',
      subtitle: 'Hardware Overview',
      icon: <TruckIcon className="w-5 h-5" />,
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
      title: 'Using Carti',
      subtitle: 'Core Operations',
      icon: <PlayCircleIcon className="w-5 h-5" />,
      duration: '5 min',
    },
    {
      id: 4,
      title: 'Warehouse Safety',
      subtitle: 'Team Coordination',
      icon: <ShieldCheckIcon className="w-5 h-5" />,
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
    localStorage.removeItem('bear-training-carti-progress');
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
    }
  };

  const handleBack = () => {
    if (currentModule > 1) {
        setCurrentModule(currentModule - 1);
    }
  };

  const jumpToModule = (id: number) => {
    // If going to Welcome, allow it even if not "complete" (since it's the start)
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
                            Carti 100 Training
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-bear-blue/20 text-bear-blue border border-bear-blue/20">
                                LOGISTICS
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
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
                                    <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-white" />
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
                        <motion.div
                            key="content-card"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-[#0f1423] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative h-[calc(100vh-200px)] max-h-[700px]"
                        >
                            {/* Content - FIXED HEIGHT NO SCROLL */}
                            <div className="flex-1 p-6 lg:p-8 overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentModule}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {currentModule === 0 && <WelcomeContent onComplete={handleNext} />}
                                        {currentModule === 1 && <ModuleMeetCarti />}
                                        {currentModule === 2 && <ModuleGettingStarted />}
                                        {currentModule === 3 && <ModuleUsingCarti />}
                                        {currentModule === 4 && <ModuleWarehouseSafety />}
                                        {currentModule === 5 && <ModuleBestPractices />}
                                        {currentModule === 6 && <ModuleQuickTips />}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Fixed Footer Action Bar - ALWAYS SAME POSITION */}
                            {currentModule > 0 && (
                            <div className="p-6 border-t border-white/5 bg-[#0a0f1c]/50 backdrop-blur-md flex items-center justify-between flex-shrink-0">
                                <button 
                                    onClick={handleBack}
                                    disabled={currentModule <= 0}
                                    className={`text-sm font-medium px-6 py-3 rounded-xl transition-colors ${
                                        currentModule <= 0
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
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </main>

      {/* Restart Confirmation Modal */}
      <AnimatePresence>
        {showRestartConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={cancelRestart}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
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
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                    className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/30"
                >
                  <ExclamationTriangleIcon className="w-12 h-12 text-white" />
                </motion.div>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  You've successfully completed the Carti 100 training modules. You're now certified to work with Carti!
                </p>
                
                <div className="flex flex-col gap-3">
                    <Link
                    href="/knowledge"
                    className="w-full py-3.5 bg-bear-blue text-white font-semibold rounded-xl hover:bg-bear-blue-light transition-all shadow-lg shadow-bear-blue/20 flex items-center justify-center gap-2"
                    onClick={() => {
                        localStorage.removeItem('bear-training-carti-progress');
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Module Components with Rich Data ---

function WelcomeContent({ onComplete }: { onComplete: () => void }) {
    return (
        <div className="flex flex-col justify-center items-center text-center py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-bear-blue/5 to-transparent pointer-events-none" />
            
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-bear-blue rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-bear-blue/20 rotate-3"
            >
                <AcademicCapIcon className="w-10 h-10 text-white" />
            </motion.div>
    
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Welcome to Carti Training</h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed px-4">
                This interactive training will guide you through everything you need to know about working with Carti 100, your autonomous logistics robot.
            </p>
    
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-12 px-4">
                {[
                    { icon: ClockIcon, label: "30 Minutes", desc: "Comprehensive" },
                    { icon: PlayCircleIcon, label: "Interactive", desc: "Learn by doing" },
                    { icon: ShieldCheckIcon, label: "Certified", desc: "Get ready" },
                ].map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center text-center">
                        <item.icon className="w-6 h-6 text-bear-blue mx-auto mb-3" />
                        <div className="font-semibold text-white mb-1">{item.label}</div>
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

function ModuleWelcome({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="bg-[#0f1423] border border-white/10 rounded-3xl p-6 lg:p-12 text-center flex flex-col justify-center items-center relative overflow-hidden shadow-2xl h-[calc(100vh-200px)] max-h-[700px]">
        <WelcomeContent onComplete={onComplete} />
    </div>
  );
}

function ModuleMeetCarti() {
    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="bear-glass-card p-6 relative overflow-hidden flex items-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-bear-blue/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 w-full">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-bear-blue mb-2">
                            <TruckIcon className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase tracking-wider">Overview</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Meet Carti 100</h2>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Heavy-duty autonomous mobile robot designed for warehouse and logistics operations. It moves heavy loads efficiently and safely.
                        </p>
                    </div>
                    <div className="w-24 h-24 bg-gradient-to-br from-bear-blue to-cyan-400 rounded-full flex items-center justify-center shadow-2xl shadow-bear-blue/20 flex-shrink-0">
                        <TruckIcon className="w-12 h-12 text-white" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
                {[
                    { icon: WrenchScrewdriverIcon, title: "100kg Payload", desc: "Capable of transporting heavy goods and materials across the facility.", bg: "bg-bear-blue/10", border: "border-bear-blue/20" },
                    { icon: ShieldCheckIcon, title: "LiDAR Navigation", desc: "Advanced sensors for precise mapping and obstacle avoidance in dynamic environments.", bg: "bg-bear-blue/10", border: "border-bear-blue/20" },
                    { icon: MapIcon, title: "Fleet Management", desc: "Integrated with Bear Fleet Cloud for coordinated multi-robot operations.", bg: "bg-bear-blue/10", border: "border-bear-blue/20" },
                    { icon: BoltIcon, title: "Auto-Charging", desc: "Intelligent battery management ensures continuous operation with minimal downtime.", bg: "bg-bear-blue/10", border: "border-bear-blue/20" },
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`${item.bg} border ${item.border} p-5 rounded-xl hover:bg-bear-blue/15 transition-all flex flex-col`}
                    >
                        <div className="w-10 h-10 bg-bear-blue/20 rounded-lg flex items-center justify-center mb-3 flex-shrink-0">
                            <item.icon className="w-6 h-6 text-bear-blue" />
                        </div>
                        <h3 className="font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function ModuleGettingStarted() {
    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="bear-glass-card p-6 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-white mb-2">Getting Started</h2>
                <p className="text-gray-300 text-sm">Pre-operation safety checks</p>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
                {[
                    { 
                        title: "E-Stop Check", 
                        desc: "Ensure the Emergency Stop button is disengaged (rotate clockwise).",
                        icon: "1"
                    },
                    { 
                        title: "Sensor Clean", 
                        desc: "Wipe LiDAR and depth camera lenses with a microfiber cloth.",
                        icon: "2"
                    },
                    { 
                        title: "Path Clearance", 
                        desc: "Verify that the main transport aisles are free of large debris.",
                        icon: "3"
                    },
                    { 
                        title: "Battery Level", 
                        desc: "Check charge status on the display. Should be above 20% to start operations.",
                        icon: "4"
                    },
                    { 
                        title: "Payload Area", 
                        desc: "Ensure platform is clean, empty, and free of any previous load debris.",
                        icon: "5"
                    },
                ].map((step, i) => (
                    <motion.div 
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-4 bg-white/5 p-5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                    >
                        <div className="flex-shrink-0 w-10 h-10 bg-bear-blue rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-bear-blue/20">
                            {step.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-2 text-sm">{step.title}</h3>
                            <p className="text-gray-300 leading-relaxed text-xs">{step.desc}</p>
                        </div>
                    </motion.div>
                ))}

                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-4 bg-green-500/10 p-5 rounded-xl border border-green-500/20"
                >
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                        <CheckCircleIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-green-400 mb-2 text-sm">Systems Go</h3>
                        <p className="text-green-200/70 leading-relaxed text-xs">Carti 100 is online and ready for tasks.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function ModuleUsingCarti() {
    return (
        <div className="space-y-5 h-full flex flex-col">
            <div className="grid grid-cols-2 gap-4">
                <div className="bear-glass-card p-5 flex flex-col border-l-4 border-green-500">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        Loading Procedures
                    </h3>
                    <div className="space-y-3 flex-1">
                        {[
                            "Center load on the platform",
                            "Secure loose items",
                            "Respect payload limits",
                            "Check overhead clearance"
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bear-glass-card p-5 flex flex-col border-l-4 border-red-500">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <XMarkIcon className="w-5 h-5 text-red-500" />
                        Prohibited Actions
                    </h3>
                    <div className="space-y-3 flex-1">
                        {[
                            "Riding on the robot",
                            "Overhanging loads > 10cm",
                            "Blocking safety scanners",
                            "Operating on wet floors"
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bear-glass-card p-6 flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-white mb-6">Mission Control</h3>
                <div className="grid grid-cols-3 gap-6">
                    {[
                        { title: "Select Destination", desc: "Choose a predefined station from the tablet interface" },
                        { title: "Engage Auto", desc: "Press 'Start' to begin autonomous navigation" },
                        { title: "Monitor Status", desc: "Watch the LED ring: Blue is moving, Yellow is obstacle" },
                    ].map((step, i) => (
                        <div key={i} className="text-center">
                            <div className="w-14 h-14 bg-bear-blue rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg shadow-bear-blue/20">
                                {i + 1}
                            </div>
                            <h4 className="font-bold text-white mb-2">{step.title}</h4>
                            <p className="text-sm text-gray-300 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ModuleWarehouseSafety() {
    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="bear-glass-card p-5 flex flex-col justify-center">
                <h2 className="text-xl font-bold text-white mb-1">Warehouse Safety</h2>
                <p className="text-gray-300 text-xs">Safe operations in shared spaces</p>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
                {[
                    { icon: UserGroupIcon, title: "Team Communication", desc: "Alert team when Carti enters their zone. Use radio or verbal warnings." },
                    { icon: ShieldCheckIcon, title: "Safety Zones", desc: "Maintain 2 meter clearance when moving. Never walk in front." },
                    { icon: MapIcon, title: "Aisle Management", desc: "Keep aisles clear. Stack pallets properly and secure loose materials." },
                    { icon: ClockIcon, title: "Shift Changes", desc: "Brief incoming team on Carti's tasks and any issues." },
                    { icon: WrenchScrewdriverIcon, title: "Visual Signals", desc: "Blue = moving, Yellow = obstacle, Red = error or E-stop." },
                    { icon: BoltIcon, title: "Emergency Protocol", desc: "Hit E-Stop if someone at risk. Report all incidents to supervisor." },
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-bear-blue/5 p-3 rounded-xl border border-bear-blue/20 hover:bg-bear-blue/10 transition-all flex flex-col"
                    >
                        <div className="flex items-start gap-2">
                            <div className="w-8 h-8 bg-bear-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <item.icon className="w-4 h-4 text-bear-blue" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white mb-1 text-xs">{item.title}</h3>
                                <p className="text-xs text-gray-300 leading-snug">{item.desc}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 p-3 rounded-xl border border-red-500/30 flex items-center gap-3">
                <div className="bg-red-500/20 p-2 rounded-lg flex-shrink-0">
                    <ShieldCheckIcon className="w-5 h-5 text-red-500" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Safety First Always</h3>
                    <p className="text-gray-300 text-xs leading-snug">Stop Carti immediately if you see any hazard. Safety trumps productivity.</p>
                </div>
            </div>
        </div>
    );
}

function ModuleBestPractices() {
    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="bear-glass-card p-5 flex flex-col justify-center">
                <h2 className="text-xl font-bold text-white mb-1">Operational Excellence</h2>
                <p className="text-gray-300 text-xs">Professional standards for warehouse operations</p>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
                {[
                    { icon: UserGroupIcon, title: "Zone Safety", desc: "Clear zone around picking stations. Allow Carti space to maneuver." },
                    { icon: WrenchScrewdriverIcon, title: "Maintenance", desc: "Report unusual noises or wheel wear to fleet manager immediately." },
                    { icon: MapIcon, title: "Mapping Updates", desc: "Alert admins of layout changes so maps can be updated." },
                    { icon: ClipboardDocumentCheckIcon, title: "Charge Management", desc: "Send to charge during breaks to ensure full shift coverage." },
                    { icon: ShieldCheckIcon, title: "Weight Limits", desc: "Never exceed 100kg. Overloading damages robot and voids warranty." },
                    { icon: SparklesIcon, title: "Clean Sensors", desc: "Daily LiDAR wipe prevents navigation errors and maintains efficiency." },
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-bear-blue/5 p-3 rounded-xl border border-bear-blue/20 hover:bg-bear-blue/10 transition-all flex flex-col"
                    >
                        <div className="flex items-start gap-2">
                            <div className="w-8 h-8 bg-bear-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <item.icon className="w-4 h-4 text-bear-blue" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white mb-1 text-xs">{item.title}</h3>
                                <p className="text-xs text-gray-300 leading-snug">{item.desc}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 p-3 rounded-xl border border-yellow-500/30 flex items-center gap-3">
                <div className="bg-yellow-500/20 p-2 rounded-lg flex-shrink-0">
                    <LightBulbIcon className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Fleet Manager Contact</h3>
                    <p className="text-gray-300 text-xs leading-snug">For operational questions, issues, or emergencies, contact fleet manager immediately.</p>
                </div>
            </div>
        </div>
    );
}

function ModuleQuickTips() {
    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="bear-glass-card p-5 flex flex-col justify-center">
                <h2 className="text-xl font-bold text-white mb-1">Troubleshooting</h2>
                <p className="text-gray-300 text-xs">Common situations and solutions</p>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-4 rounded-xl border-2 border-yellow-500/30 flex flex-col">
                    <div className="w-9 h-9 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-2">
                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h3 className="font-bold text-white mb-1 text-sm">Obstacle Detected</h3>
                    <p className="text-xs text-gray-300 leading-snug">If Carti flashes yellow, check path. Clear objects and it will resume.</p>
                </div>

                <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 p-4 rounded-xl border-2 border-red-500/30 flex flex-col">
                    <div className="w-9 h-9 bg-red-500/20 rounded-lg flex items-center justify-center mb-2">
                        <BoltIcon className="w-5 h-5 text-red-500" />
                    </div>
                    <h3 className="font-bold text-white mb-1 text-sm">System Error</h3>
                    <p className="text-xs text-gray-300 leading-snug">Red status light? Press E-Stop, wait 5 seconds, release to reboot.</p>
                </div>

                <div className="bg-gradient-to-br from-bear-blue/10 to-cyan-600/5 p-4 rounded-xl border-2 border-bear-blue/30 flex flex-col">
                    <div className="w-9 h-9 bg-bear-blue/20 rounded-lg flex items-center justify-center mb-2">
                        <MapIcon className="w-5 h-5 text-bear-blue" />
                    </div>
                    <h3 className="font-bold text-white mb-1 text-sm">Navigation Issue</h3>
                    <p className="text-xs text-gray-300 leading-snug">Lost position? Return to home, restart, allow re-mapping if needed.</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/5 p-4 rounded-xl border-2 border-green-500/30 flex flex-col">
                    <div className="w-9 h-9 bg-green-500/20 rounded-lg flex items-center justify-center mb-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    </div>
                    <h3 className="font-bold text-white mb-1 text-sm">Need Help?</h3>
                    <p className="text-xs text-gray-300 leading-snug">Contact fleet manager for technical issues or operational questions.</p>
                </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/15 to-emerald-500/10 p-3 rounded-xl border border-green-500/30 flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg flex-shrink-0">
                    <SparklesIcon className="w-6 h-6 text-green-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">You're Certified!</h3>
                    <p className="text-gray-200 text-xs leading-snug">You're ready to operate Carti 100. Welcome to the logistics team!</p>
                </div>
            </div>
        </div>
    );
}
