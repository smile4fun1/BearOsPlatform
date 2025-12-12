'use client';

import { useState, useRef } from 'react';
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
} from 'lucide-react';

export default function TrainingPage() {
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [trainingStarted, setTrainingStarted] = useState(false);
  const trainingContentRef = useRef<HTMLDivElement>(null);

  const modules = [
    {
      id: 0,
      title: 'Welcome',
      icon: <AcademicCapIcon className="w-6 h-6" />,
      duration: '2 min',
    },
    {
      id: 1,
      title: 'Meet Servi',
      icon: <CubeIcon className="w-6 h-6" />,
      duration: '3 min',
    },
    {
      id: 2,
      title: 'Getting Started',
      icon: <BoltIcon className="w-6 h-6" />,
      duration: '5 min',
    },
    {
      id: 3,
      title: 'Using Servi',
      icon: <PlayCircleIcon className="w-6 h-6" />,
      duration: '5 min',
    },
    {
      id: 4,
      title: 'Best Practices',
      icon: <SparklesIcon className="w-6 h-6" />,
      duration: '3 min',
    },
    {
      id: 5,
      title: 'Quick Tips',
      icon: <LightBulbIcon className="w-6 h-6" />,
      duration: '2 min',
    },
  ];

  const scrollToTraining = () => {
    setTimeout(() => {
      if (trainingContentRef.current) {
        const element = trainingContentRef.current;
        const offset = 100; // Offset for navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const startTraining = () => {
    setTrainingStarted(true);
    setCompletedModules([0]); // Mark Welcome as completed
    setCurrentModule(1);
    scrollToTraining();
  };

  const completeModule = (moduleId: number) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
    }
    if (moduleId === modules.length - 1) {
      setShowCongrats(true);
    } else {
      setCurrentModule(moduleId + 1);
      scrollToTraining();
    }
  };

  const goBack = () => {
    if (currentModule > 1) {
      setCurrentModule(currentModule - 1);
      scrollToTraining();
    }
  };

  const progress = (completedModules.length / modules.length) * 100;

  const leftModules = modules.slice(0, 3);
  const rightModules = modules.slice(3, 6);

  return (
    <div className="min-h-screen bg-bear-dark text-white p-6">
      {/* Header Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/knowledge" className="hover:text-bear-blue transition-colors">Knowledge Base</Link>
        <ChevronRightIcon className="w-4 h-4" />
        <span className="text-white">Training</span>
      </div>

      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 overflow-hidden rounded-3xl bear-glass-card mb-8">
        <div className="absolute inset-0">
          <motion.div
            className="absolute -top-20 -right-20 w-96 h-96 bg-bear-blue/10 rounded-full filter blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-5 py-2 bg-white/5 border border-white/10 text-bear-blue rounded-full text-sm font-semibold mb-6"
            >
              NEW STAFF TRAINING
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight"
            >
              Welcome to
              <span className="block text-gradient">
                Servi Training
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl lg:text-2xl text-gray-400 mb-4 max-w-3xl mx-auto font-medium"
            >
              Learn to work with Servi Plus in 20 minutes
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl mx-auto mt-12"
            >
              <div className="bg-white/5 rounded-full h-3 overflow-hidden shadow-inner border border-white/10">
                <motion.div
                  className="bg-bear-blue h-full rounded-full shadow-[0_0_10px_rgba(81,166,214,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-3">
                {completedModules.length} of {modules.length} modules completed
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Training Content */}
      <section className="py-8" ref={trainingContentRef}>
        <div className="max-w-7xl mx-auto">
          {!trainingStarted ? (
            <ModuleWelcome onComplete={startTraining} />
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
              {/* Left Module Cards */}
              <div className="hidden lg:flex flex-col gap-4 w-64 flex-shrink-0">
                {leftModules.map((module, index) => (
                  <ModuleCard 
                    key={module.id} 
                    module={module} 
                    currentModule={currentModule} 
                    completedModules={completedModules} 
                    onClick={() => setCurrentModule(module.id)}
                    index={index}
                    direction={-1}
                  />
                ))}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 w-full max-w-3xl">
                <AnimatePresence mode="wait">
                  {currentModule === 1 && (
                    <ModuleMeetServi key="meet" onComplete={() => completeModule(1)} onBack={goBack} showBack={false} />
                  )}
                  {currentModule === 2 && (
                    <ModuleGettingStarted key="start" onComplete={() => completeModule(2)} onBack={goBack} showBack={true} />
                  )}
                  {currentModule === 3 && (
                    <ModuleUsingServi key="using" onComplete={() => completeModule(3)} onBack={goBack} showBack={true} />
                  )}
                  {currentModule === 4 && (
                    <ModuleBestPractices key="practices" onComplete={() => completeModule(4)} onBack={goBack} showBack={true} />
                  )}
                  {currentModule === 5 && (
                    <ModuleQuickTips key="tips" onComplete={() => completeModule(5)} onBack={goBack} showBack={true} />
                  )}
                </AnimatePresence>
              </div>

              {/* Right Module Cards */}
              <div className="hidden lg:flex flex-col gap-4 w-64 flex-shrink-0">
                {rightModules.map((module, index) => (
                   <ModuleCard 
                    key={module.id} 
                    module={module} 
                    currentModule={currentModule} 
                    completedModules={completedModules} 
                    onClick={() => setCurrentModule(module.id)}
                    index={index}
                    direction={1}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Congratulations Modal */}
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
              className="bg-[#1a1f36] border border-white/10 rounded-3xl p-8 lg:p-12 max-w-2xl w-full relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowCongrats(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                  <CheckCircleIcon className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Training Complete!
                </h2>
                <div className="text-xl text-gray-300 mb-8 leading-relaxed space-y-2">
                  <p>You're now ready to work with Servi Plus.</p>
                  <p>Welcome to the team!</p>
                </div>
                
                <Link
                  href="/knowledge"
                  className="px-8 py-4 bg-bear-blue text-white font-semibold rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-bear-blue/20 inline-flex items-center justify-center gap-2"
                >
                  Back to Knowledge Base
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Reusable Module Card Component
function ModuleCard({ module, currentModule, completedModules, onClick, index, direction }: any) {
    const isActive = currentModule === module.id;
    const isCompleted = completedModules.includes(module.id);
    
    return (
        <motion.button
            onClick={onClick}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`relative p-4 rounded-2xl border transition-all duration-300 text-left w-full ${
                isActive
                ? 'border-bear-blue bg-bear-blue/10 shadow-lg shadow-bear-blue/10'
                : isCompleted
                ? 'border-green-500/50 bg-green-500/5 hover:bg-green-500/10'
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
            }`}
        >
            {isCompleted && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircleIcon className="w-4 h-4 text-white" />
                </div>
            )}
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                isActive
                    ? 'bg-bear-blue text-white'
                    : isCompleted
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-white/10 text-gray-400'
                }`}>
                {module.icon}
                </div>
                <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm mb-0.5 truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>{module.title}</h3>
                <p className="text-xs text-gray-500">{module.duration}</p>
                </div>
            </div>
        </motion.button>
    )
}


// Module Components (Dark Mode Adapted)
function ModuleWelcome({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bear-glass-card p-6 md:p-8 lg:p-12 max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-bear-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-bear-blue/30">
          <AcademicCapIcon className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Welcome to the Team</h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          This training will help you feel confident working with Servi Plus
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[
            { icon: ClockIcon, title: "20 Minutes", sub: "Quick and easy to complete", color: "text-bear-blue", bg: "bg-blue-500/20" },
            { icon: PlayCircleIcon, title: "Interactive", sub: "Learn by doing", color: "text-green-500", bg: "bg-green-500/20" },
            { icon: UserGroupIcon, title: "Practical", sub: "Real-world scenarios", color: "text-purple-500", bg: "bg-purple-500/20" }
        ].map((item, i) => (
             <div key={i} className="bg-white/5 rounded-2xl p-6 text-center border border-white/10 hover:border-white/20 transition-all">
                <div className={`w-12 h-12 ${item.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.sub}</p>
            </div>
        ))}
      </div>

      <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
        <h3 className="font-bold text-white mb-4 text-lg">What you'll learn:</h3>
        <ul className="space-y-3">
            {[
                "How to safely work with Servi Plus",
                "Starting and stopping your shift",
                "Loading and sending deliveries",
                "Handling common situations"
            ].map((text, i) => (
                <li key={i} className="flex items-center text-gray-300">
                    <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    {text}
                </li>
            ))}
        </ul>
      </div>

      <button
        onClick={onComplete}
        className="w-full py-5 bg-bear-blue text-white font-bold rounded-full hover:shadow-xl hover:shadow-bear-blue/20 transform hover:scale-105 transition-all text-lg flex items-center justify-center gap-2"
      >
        Start Training
        <ChevronRightIcon className="w-6 h-6" />
      </button>
    </motion.div>
  );
}

function ModuleMeetServi({ onComplete, onBack, showBack }: { onComplete: () => void; onBack: () => void; showBack: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bear-glass-card p-6 md:p-8 flex flex-col min-h-[600px]"
    >
      {showBack && (
        <button onClick={onBack} className="mb-4 text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
          <ChevronLeftIcon className="w-5 h-5" /> Back
        </button>
      )}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-bear-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-bear-blue/20">
          <CubeIcon className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Meet Servi Plus</h2>
        <p className="text-lg text-gray-400">Your new co-worker designed to help you deliver efficiently</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
          {[
              { icon: WrenchScrewdriverIcon, title: "Three Trays", desc: "Max 40kg total capacity.", color: "text-bear-blue", bg: "bg-blue-500/20" },
              { icon: ShieldCheckIcon, title: "Smart & Safe", desc: "Built-in obstacle avoidance.", color: "text-green-500", bg: "bg-green-500/20" },
              { icon: MapIcon, title: "Easy Control", desc: "Simple touchscreen interface.", color: "text-purple-500", bg: "bg-purple-500/20" },
              { icon: BoltIcon, title: "All-Day Battery", desc: "Runs for 8-12 hours.", color: "text-orange-500", bg: "bg-orange-500/20" },
          ].map((item, i) => (
             <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center mb-3`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h4 className="font-bold text-white mb-1">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
      </div>

      <button onClick={onComplete} className="mt-auto w-full py-4 bg-bear-blue text-white font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2">
        Continue <ChevronRightIcon className="w-6 h-6" />
      </button>
    </motion.div>
  );
}

function ModuleGettingStarted({ onComplete, onBack, showBack }: { onComplete: () => void; onBack: () => void; showBack: boolean }) {
    return (
        <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="bear-glass-card p-6 md:p-8 flex flex-col min-h-[600px]"
        >
        {showBack && (
            <button onClick={onBack} className="mb-4 text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
            <ChevronLeftIcon className="w-5 h-5" /> Back
            </button>
        )}
        <div className="text-center mb-8">
             <div className="w-16 h-16 bg-bear-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-bear-blue/20">
            <BoltIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Getting Started</h2>
            <p className="text-lg text-gray-400">Simple steps to start your shift</p>
        </div>

        <div className="space-y-6 mb-8 bg-white/5 p-6 rounded-2xl border border-white/10">
             <StepItem num="1" title="Check the Battery" text="Screen should show green battery (80-100%)." />
             <StepItem num="2" title="Visual Inspection" text="Check trays and wheels are clean." />
             <StepItem num="3" title="Clean the Trays" text="Wipe with a clean cloth." />
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                  <CheckCircleIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-green-400 mb-1">You're Ready</h4>
                  <p className="text-gray-400 text-sm">Servi is ready to help!</p>
                </div>
            </div>
        </div>

        <button onClick={onComplete} className="mt-auto w-full py-4 bg-bear-blue text-white font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2">
            Continue <ChevronRightIcon className="w-6 h-6" />
        </button>
        </motion.div>
    )
}

function StepItem({ num, title, text }: { num: string, title: string, text: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-bear-blue text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg shadow-bear-blue/20">
                {num}
            </div>
            <div>
                <h4 className="font-bold text-white mb-1">{title}</h4>
                <p className="text-gray-400 text-sm">{text}</p>
            </div>
        </div>
    )
}

function ModuleUsingServi({ onComplete, onBack, showBack }: { onComplete: () => void; onBack: () => void; showBack: boolean }) {
     return (
        <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="bear-glass-card p-6 md:p-8 flex flex-col min-h-[600px]"
        >
        {showBack && (
            <button onClick={onBack} className="mb-4 text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
            <ChevronLeftIcon className="w-5 h-5" /> Back
            </button>
        )}
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-bear-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-bear-blue/20">
            <PlayCircleIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Using Servi</h2>
            <p className="text-lg text-gray-400">Loading and Sending</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-500/10 p-5 rounded-2xl border border-green-500/20">
                 <h4 className="font-bold text-green-400 mb-4 flex items-center gap-2"><CheckCircleIcon className="w-5 h-5"/> Do This</h4>
                 <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Center items on trays</li>
                    <li>• Distribute weight evenly</li>
                    <li>• Use all 3 trays</li>
                 </ul>
            </div>
            <div className="bg-red-500/10 p-5 rounded-2xl border border-red-500/20">
                 <h4 className="font-bold text-red-400 mb-4 flex items-center gap-2"><XMarkIcon className="w-5 h-5"/> Don't Do This</h4>
                 <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Overload (max 40kg)</li>
                    <li>• Stack too high</li>
                    <li>• Rush loading</li>
                 </ul>
            </div>
        </div>

        <button onClick={onComplete} className="mt-auto w-full py-4 bg-bear-blue text-white font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2">
            Continue <ChevronRightIcon className="w-6 h-6" />
        </button>
        </motion.div>
    )
}

function ModuleBestPractices({ onComplete, onBack, showBack }: { onComplete: () => void; onBack: () => void; showBack: boolean }) {
     return (
        <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="bear-glass-card p-6 md:p-8 flex flex-col min-h-[600px]"
        >
        {showBack && (
            <button onClick={onBack} className="mb-4 text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
            <ChevronLeftIcon className="w-5 h-5" /> Back
            </button>
        )}
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-bear-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-bear-blue/20">
            <SparklesIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Best Practices</h2>
            <p className="text-lg text-gray-400">Tips from the pros</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
                { title: "Communicate", text: "Announce when Servi is approaching.", icon: UserGroupIcon, color: "text-bear-blue", bg: "bg-blue-500/20" },
                { title: "Efficient Loading", text: "Heavy items on bottom.", icon: WrenchScrewdriverIcon, color: "text-green-500", bg: "bg-green-500/20" },
                { title: "Clear Paths", text: "Watch for bags and chairs.", icon: MapIcon, color: "text-purple-500", bg: "bg-purple-500/20" },
                { title: "End of Shift", text: "Wipe down and charge.", icon: ClipboardDocumentCheckIcon, color: "text-orange-500", bg: "bg-orange-500/20" },
            ].map((item, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className={`w-8 h-8 ${item.bg} rounded-full flex items-center justify-center mb-2`}>
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <h3 className="font-bold text-white text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-400">{item.text}</p>
                </div>
            ))}
        </div>

        <button onClick={onComplete} className="mt-auto w-full py-4 bg-bear-blue text-white font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2">
            Continue <ChevronRightIcon className="w-6 h-6" />
        </button>
        </motion.div>
    )
}

function ModuleQuickTips({ onComplete, onBack, showBack }: { onComplete: () => void; onBack: () => void; showBack: boolean }) {
    return (
        <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="bear-glass-card p-6 md:p-8 flex flex-col min-h-[600px]"
        >
        {showBack && (
            <button onClick={onBack} className="mb-4 text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
            <ChevronLeftIcon className="w-5 h-5" /> Back
            </button>
        )}
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-bear-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-bear-blue/20">
            <LightBulbIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Quick Tips</h2>
            <p className="text-lg text-gray-400">Common situations</p>
        </div>

        <div className="space-y-4 mb-8">
            <TipCard title="Low Battery" text="Servi will auto-return. If lost, send to Home." icon={BoltIcon} color="text-yellow-500" border="border-yellow-500/30" />
            <TipCard title="Servi Won't Move" text="Check Emergency Stop button." icon={ExclamationTriangleIcon} color="text-red-500" border="border-red-500/30" />
            <TipCard title="Screen Issues" text="Wipe clean or restart (hold power 10s)." icon={ClockIcon} color="text-blue-500" border="border-blue-500/30" />
        </div>

        <button onClick={onComplete} className="mt-auto w-full py-4 bg-green-500 text-white font-bold rounded-full hover:scale-105 hover:bg-green-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
            Complete Training <CheckCircleIcon className="w-6 h-6" />
        </button>
        </motion.div>
    )
}

function TipCard({ title, text, icon: Icon, color, border }: any) {
    return (
        <div className={`bg-white/5 p-4 rounded-xl border ${border} flex items-start gap-3`}>
             <Icon className={`w-5 h-5 ${color} mt-0.5 flex-shrink-0`} />
             <div>
                 <h4 className="font-bold text-white text-sm">{title}</h4>
                 <p className="text-xs text-gray-400">{text}</p>
             </div>
        </div>
    )
}
