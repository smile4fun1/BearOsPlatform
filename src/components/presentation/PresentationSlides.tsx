"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Bot, Brain, Database, Zap, TrendingUp, Shield, Network, Target, CheckCircle2, AlertTriangle, BarChart3, Activity, Cpu, Globe2, ArrowRight, Lightbulb, Code, Rocket, Users, Clock } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { composeCurationResponse } from "@/lib/dataCurator";

export function PresentationSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);
  
  const universe = composeCurationResponse();
  const totalSlides = 10;

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1 && !isAnimating) {
      setIsAnimating(true);
      setSlideDirection("next");
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0 && !isAnimating) {
      setIsAnimating(true);
      setSlideDirection("prev");
      setTimeout(() => {
        setCurrentSlide(currentSlide - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  // Keyboard navigation removed - use mouse only to avoid chat input conflicts

  const slides = [
    // Slide 1: Title
    <div key="slide-1" className="flex flex-col items-center justify-center min-h-[80vh] text-center px-16 pb-32 max-w-[1800px] mx-auto">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(93,173,226,0.2),transparent_70%)] animate-pulse" />
        <div className="relative flex items-center justify-center mb-8">
          <div className="h-24 w-24 rounded-3xl overflow-hidden shadow-2xl shadow-sky-500/50 ring-4 ring-sky-500/30">
            <img 
              src="/download.png" 
              alt="Bear Robotics" 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
      
      <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-sky-400 via-indigo-400 to-rose-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
        Bear Universe
      </h1>
      
      <p className="text-3xl text-white/90 mb-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
        Intelligent Automation Ecosystem
      </p>
      
      <p className="text-xl text-white/60 max-w-3xl mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
        AI-Powered Operations Platform for Next-Generation Fleet Management
      </p>

      <div className="flex items-center gap-6 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-500">
        <div className="flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-6 py-3 backdrop-blur-sm">
          <Sparkles className="h-5 w-5 text-sky-400" />
          <span className="text-white/80">Multi-Agent AI</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-6 py-3 backdrop-blur-sm">
          <Zap className="h-5 w-5 text-indigo-400" />
          <span className="text-white/80">Real-Time Intelligence</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-6 py-3 backdrop-blur-sm">
          <Shield className="h-5 w-5 text-rose-400" />
          <span className="text-white/80">Production Ready</span>
        </div>
      </div>
    </div>,

    // Slide 2: Problem Statement
    <div key="slide-2" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1800px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <AlertTriangle className="h-12 w-12 text-rose-400" />
          <h2 className="text-5xl font-bold text-white">The Challenge</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          Robotics operations today lack intelligent automation and real-time AI assistance
        </p>

        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-8 transform transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <Activity className="h-6 w-6 text-rose-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Operational Visibility</h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              Operations teams lack a unified platform with real-time AI insights across distributed fleets. 
              No centralized view of fleet health, performance trends, or predictive diagnostics.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-8 transform transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Slow Incident Response</h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              Engineers troubleshoot without AI assistance. Scattered logs, manual diagnostics, 
              and no intelligent root cause analysis lead to extended downtime and reactive responses.
            </p>
          </div>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-8 transform transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Database className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Data Fragmentation</h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              Operational data lives in disconnected systems. No AI layer to synthesize information, 
              detect patterns, or provide intelligent recommendations to operations teams.
            </p>
          </div>

          <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-violet-500/5 p-8 transform transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Manual Workflows</h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              Zero AI-powered automation in daily operations. Manual report generation, 
              reactive incident response, and no proactive problem-solving capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>,

    // Slide 3: Solution Overview
    <div key="slide-3" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1800px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <Rocket className="h-12 w-12 text-emerald-400" />
          <h2 className="text-5xl font-bold text-white">The Solution</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          Bear Universe POC: Demonstrating how multi-agent AI can transform robotics operations
        </p>

        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-8 text-center transform transition-all hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-sky-500/30 to-sky-600/30 flex items-center justify-center">
                <BarChart3 className="h-10 w-10 text-sky-300" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">Unified Operations</h3>
            <p className="text-white/70 leading-relaxed">
              AI-powered operations interface that aggregates fleet data, 
              surfaces insights, and provides intelligent recommendations
            </p>
          </div>

          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-8 text-center transform transition-all hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 flex items-center justify-center">
                <Bot className="h-10 w-10 text-indigo-300" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">AI-Powered Assistance</h3>
            <p className="text-white/70 leading-relaxed">
              Multi-agent architecture where specialized AI models work together: 
              interactive assistants, diagnostic analyzers, and knowledge systems
            </p>
          </div>

          <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-8 text-center transform transition-all hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-rose-500/30 to-rose-600/30 flex items-center justify-center">
                <Lightbulb className="h-10 w-10 text-rose-300" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">Intelligent Insights</h3>
            <p className="text-white/70 leading-relaxed">
              AI-driven pattern recognition, anomaly detection, and predictive analytics 
              that enable proactive operations management
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-8">
          <div className="flex items-start gap-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-semibold text-white mb-3">Built for Production</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                This POC demonstrates the architecture, UI/UX patterns, and multi-agent orchestration 
                concepts. Built with modern web stack (Next.js, TypeScript, Tailwind) to show how 
                AI integration could elevate Bear Robotics operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Slide 4: Multi-Agent AI
    <div key="slide-4" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1800px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <Network className="h-12 w-12 text-indigo-400" />
          <h2 className="text-5xl font-bold text-white">Bear AI Constellation</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          Multi-agent architecture concept: specialized AI models collaborating to handle different operational domains
        </p>

        <div className="grid gap-8 mb-12">
          {/* Ursa Minor */}
          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-10 transform transition-all hover:scale-[1.02]">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Bot className="h-12 w-12 text-indigo-300" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-3xl font-bold text-white">Ursa Minor</h3>
                  <div className="flex gap-2">
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300">POC Demo</span>
                  </div>
                </div>
                <p className="text-xl text-white/70 mb-6 leading-relaxed">
                  Interactive AI assistant concept. Navigate dashboards, query data, 
                  and demonstrate intelligent command execution with permission controls.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="text-white/80 text-base">Natural language commands</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="text-white/80 text-base">Context-aware responses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="text-white/80 text-base">Tool calling & navigation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="text-white/80 text-base">Real-time data access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ursa Major */}
          <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-10 transform transition-all hover:scale-[1.02]">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-sky-500/30 to-sky-600/30 flex items-center justify-center shadow-lg shadow-sky-500/30">
                  <Brain className="h-12 w-12 text-sky-300" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-3xl font-bold text-white">Ursa Major</h3>
                  <div className="flex gap-2">
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-300">Concept</span>
                  </div>
                </div>
                <p className="text-xl text-white/70 mb-6 leading-relaxed">
                  Fleet orchestrator concept for KPI analysis. Would analyze telemetry patterns, 
                  surface insights, generate diagnostics, and coordinate multi-agent workflows.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="text-white/80 text-base">Telemetry analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="text-white/80 text-base">Predictive maintenance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="text-white/80 text-base">Multi-agent orchestration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="text-white/80 text-base">Automated diagnostics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grizzly */}
          <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-10 transform transition-all hover:scale-[1.02]">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-rose-500/30 to-rose-600/30 flex items-center justify-center shadow-lg shadow-rose-500/30">
                  <Database className="h-12 w-12 text-rose-300" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-3xl font-bold text-white">Grizzly Bear</h3>
                  <div className="flex gap-2">
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-300">Concept</span>
                  </div>
                </div>
                <p className="text-xl text-white/70 mb-6 leading-relaxed">
                  Knowledge core concept for institutional memory. Would provide answers about products, 
                  partnerships, compliance, brand voice, and technical documentation.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="text-white/80 text-base">Product knowledge</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="text-white/80 text-base">Partnership context</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="text-white/80 text-base">Brand voice consistency</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="text-white/80 text-base">Source citation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Slide 5: Real-Time Operations
    <div key="slide-5" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1800px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="h-12 w-12 text-sky-400" />
          <h2 className="text-5xl font-bold text-white">Real-Time Operations</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          POC demonstrates how AI can centralize and intelligently present operational data
        </p>

        {/* Live Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-sky-500/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-sky-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              Live
            </div>
            <div className="text-sm text-white/60">Active Robots</div>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              Real-time
            </div>
            <div className="text-sm text-white/60">Fleet Uptime</div>
          </div>

          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              Total
            </div>
            <div className="text-sm text-white/60">Orders Served</div>
          </div>

          <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <Globe2 className="h-6 w-6 text-rose-400" />
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              Multi
            </div>
            <div className="text-sm text-white/60">Global Facilities</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Activity className="h-7 w-7 text-sky-400" />
              Live Telemetry Dashboard
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Real-time data streaming from 1,200+ robots across 6 facilities</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Shift-level granularity (Breakfast, Lunch, Dinner, Late Night)</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Interactive sortable tables with expandable detail rows</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Color-coded performance indicators and status alerts</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Target className="h-7 w-7 text-indigo-400" />
              KPI Tracking & Insights
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Automated KPI aggregation with momentum indicators (up/down/steady)</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Weekly trend analysis with interactive charts (Recharts)</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Facility demand heatmaps showing utilization patterns</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Real-time alerts with severity levels and owner assignment</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Bot className="h-7 w-7 text-rose-400" />
              Individual Robot Pages
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Dynamic routing for each robot with detailed overview</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Live navigation map showing real-time position and path</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Streaming telemetry with battery, sensors, and system health</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>RFE diagnostic tools and system logs for field engineers</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Shield className="h-7 w-7 text-emerald-400" />
              Fleet Management Tools
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Search and filter by robot ID, facility, status, or model</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Fleet statistics dashboard with animated counters</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Multi-tab interface for different operational views</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Live system status popup with health indicators</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>,

    // Slide 6: Incident Management
    <div key="slide-6" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1800px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <AlertTriangle className="h-12 w-12 text-amber-400" />
          <h2 className="text-5xl font-bold text-white">Intelligent Incident Management</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          How AI could transform incident response with intelligent diagnostics and root cause analysis
        </p>

        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-10 mb-8">
          <h3 className="text-3xl font-semibold text-white mb-6">Interactive Incident Radar</h3>
          <p className="text-xl text-white/70 mb-8 leading-relaxed">
            Concept: AI analyzes incident patterns, suggests fixes, and provides engineers 
            with contextual assistance directly in the workflow.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-sky-400" />
                Incident Categories
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-sm text-white/70">• Navigation Drift</div>
                <div className="text-sm text-white/70">• Battery Degradation</div>
                <div className="text-sm text-white/70">• LIDAR Contamination</div>
                <div className="text-sm text-white/70">• Mechanical Faults</div>
                <div className="text-sm text-white/70">• Network Issues</div>
                <div className="text-sm text-white/70">• Software Crashes</div>
                <div className="text-sm text-white/70">• Collision Detection</div>
                <div className="text-sm text-white/70">• Sensor Calibration</div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-400" />
                AI Capabilities
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Root cause analysis with confidence scores
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Step-by-step remediation recommendations
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Historical pattern matching
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Preventive maintenance suggestions
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-5 text-center">
              <div className="text-3xl font-bold text-rose-400 mb-2">
                Live
              </div>
              <div className="text-sm text-white/60">Active Incidents</div>
            </div>

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-5 text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">
                Fast
              </div>
              <div className="text-sm text-white/60">Avg Resolution Time</div>
            </div>

            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-5 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                High
              </div>
              <div className="text-sm text-white/60">AI Accuracy</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-8">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Code className="h-7 w-7 text-sky-400" />
              Field Engineer Tools
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>SSH access directly from incident cards</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>System logs and diagnostic data viewer</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>AI chat integration for context-aware help</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>One-click navigation to robot detail pages</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-8">
            <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <Zap className="h-7 w-7 text-indigo-400" />
              Proactive Detection
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>24/7 telemetry monitoring with anomaly detection</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Predictive maintenance alerts before failures occur</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Pattern recognition across fleet for early warning</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Automated ticket creation with context and priority</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>,

    // Slide 7: Data Intelligence
    <div key="slide-7" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1800px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <Database className="h-12 w-12 text-rose-400" />
          <h2 className="text-5xl font-bold text-white">Data Intelligence Platform</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          Architecture for AI-powered data layer: unified access, intelligent curation, and API orchestration
        </p>

        {/* Data Stats */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">
              Unified
            </div>
            <div className="text-sm text-white/60">Operations Records</div>
            <div className="text-xs text-white/40 mt-1">Multi-facility aggregation</div>
          </div>

          <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">
              RESTful
            </div>
            <div className="text-sm text-white/60">API Architecture</div>
            <div className="text-xs text-white/40 mt-1">Real-time endpoints</div>
          </div>

          <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">
              Smart
            </div>
            <div className="text-sm text-white/60">Data Curation</div>
            <div className="text-xs text-white/40 mt-1">AI-powered validation</div>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">
              Fast
            </div>
            <div className="text-sm text-white/60">Response Time</div>
            <div className="text-xs text-white/40 mt-1">Optimized queries</div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8">
            <h3 className="text-2xl font-semibold text-white mb-6">Data Pipeline Architecture</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold">
                  1
                </div>
                <div>
                  <div className="font-medium text-white">Data Generation</div>
                  <div className="text-sm text-white/60">Mock data with @faker-js/faker (16 weeks ops data)</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                  2
                </div>
                <div>
                  <div className="font-medium text-white">Data Curation</div>
                  <div className="text-sm text-white/60">KPI aggregation, momentum calculation, trend analysis</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
                  3
                </div>
                <div>
                  <div className="font-medium text-white">API Layer</div>
                  <div className="text-sm text-white/60">REST endpoints for curation, insights, live streaming</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                  4
                </div>
                <div>
                  <div className="font-medium text-white">Frontend Rendering</div>
                  <div className="text-sm text-white/60">Next.js SSR, Recharts visualization, Tailwind styling</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8">
            <h3 className="text-2xl font-semibold text-white mb-6">Knowledge Base</h3>
            <div className="space-y-4">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-white">Product Documentation</div>
                  <div className="text-sm text-emerald-400">95% confidence</div>
                </div>
                <div className="text-sm text-white/60">
                  Servi Plus, Carti 100, Carti 600 specs and capabilities
                </div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-white">Partnership Context</div>
                  <div className="text-sm text-emerald-400">92% confidence</div>
                </div>
                <div className="text-sm text-white/60">
                  Hospital partnerships, Korean franchises, enterprise dining
                </div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-white">Technical Guides</div>
                  <div className="text-sm text-emerald-400">98% confidence</div>
                </div>
                <div className="text-sm text-white/60">
                  Bear Cloud API, Spatial Vision Stream, system architecture
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Catalog */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8">
          <h3 className="text-2xl font-semibold text-white mb-6">API Endpoints</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-sky-500/10 border border-sky-500/30 p-4">
              <div className="text-xs text-sky-400 mb-2 font-mono">GET /api/curation</div>
              <div className="text-sm text-white/70">Returns full curated KPI payload for dashboards</div>
            </div>
            <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/30 p-4">
              <div className="text-xs text-indigo-400 mb-2 font-mono">POST /api/chat</div>
              <div className="text-sm text-white/70">Ursa Minor AI assistant with tool calling</div>
            </div>
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-4">
              <div className="text-xs text-rose-400 mb-2 font-mono">GET /api/live</div>
              <div className="text-sm text-white/70">Real-time data streaming (ops, metrics, training)</div>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Slide 8: Future Capabilities
    <div key="slide-8" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1800px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="h-12 w-12 text-emerald-400" />
          <h2 className="text-5xl font-bold text-white">Future Roadmap</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          Realistic path from POC to production requires careful planning and phased development
        </p>

        <div className="grid gap-8 mb-12">
          {/* Phase 1 */}
          <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl font-bold text-white">Phase 1: Foundation</div>
              <div className="flex-1 h-px bg-gradient-to-r from-sky-500/50 to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Database className="h-6 w-6 text-sky-400" />
                  Real Data Integration
                </h4>
                <p className="text-base text-white/70 leading-relaxed">
                  Connect to actual fleet telemetry, operations data, and system logs. Build data pipeline infrastructure for real-time ingestion.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="h-6 w-6 text-sky-400" />
                  Team Feedback & Requirements
                </h4>
                <p className="text-base text-white/70 leading-relaxed">
                  Gather input from field engineers, ops teams, and leadership. Define exact use cases and pain points to solve.
                </p>
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl font-bold text-white">Phase 2: AI Development</div>
              <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/50 to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Brain className="h-6 w-6 text-indigo-400" />
                  Model Training & Fine-tuning
                </h4>
                <p className="text-base text-white/70 leading-relaxed">
                  Train AI models on Bear Robotics data. Fine-tune for specific use cases like diagnostics and incident analysis.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="h-6 w-6 text-indigo-400" />
                  Small-Scale Testing
                </h4>
                <p className="text-base text-white/70 leading-relaxed">
                  Pilot with limited user group. Test accuracy, gather feedback, iterate on models and interfaces.
                </p>
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl font-bold text-white">Phase 3: Production Readiness</div>
              <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/50 to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-emerald-400" />
                  Security & Compliance
                </h4>
                <p className="text-base text-white/70 leading-relaxed">
                  Implement authentication, authorization, audit logs. Ensure data privacy and operational security.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-emerald-400" />
                  Scale & Performance
                </h4>
                <p className="text-base text-white/70 leading-relaxed">
                  Optimize for production load. Deploy monitoring, error handling, and infrastructure scaling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Slide 9: Technical Excellence
    <div key="slide-9" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1800px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <Code className="h-12 w-12 text-violet-400" />
          <h2 className="text-5xl font-bold text-white">Technical Excellence</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          POC built with production-grade stack to demonstrate real-world viability
        </p>

        {/* Tech Stack */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-8">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Cpu className="h-7 w-7 text-sky-400" />
              Technology Stack
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Framework</span>
                <span className="font-semibold text-white">Next.js 16.0.3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Language</span>
                <span className="font-semibold text-white">TypeScript 5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Styling</span>
                <span className="font-semibold text-white">Tailwind CSS 4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Charts</span>
                <span className="font-semibold text-white">Recharts 3.4.1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Icons</span>
                <span className="font-semibold text-white">Lucide React 0.554.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">AI Integration</span>
                <span className="font-semibold text-white">OpenAI SDK 6.9.1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Data Generation</span>
                <span className="font-semibold text-white">@faker-js/faker 10.1.0</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-8">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Zap className="h-7 w-7 text-indigo-400" />
              Performance Optimizations
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-white/70">Server-side rendering for fast initial page loads</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-white/70">Dynamic imports and code splitting</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-white/70">Optimized animations with RequestAnimationFrame</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-white/70">Tree-shaking for minimal bundle size</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-white/70">Memoized calculations in data pipelines</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-white/70">Efficient drag handling with proper cleanup</div>
              </div>
            </div>
          </div>
        </div>

        {/* Architecture */}
        <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-8 mb-8">
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <Network className="h-7 w-7 text-rose-400" />
            Production-Ready Architecture
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="rounded-xl bg-white/5 border border-white/10 p-6">
              <div className="text-lg font-semibold text-white mb-3">Frontend</div>
              <div className="text-sm text-white/60 space-y-1">
                <div>• React 19.2.0 Server Components</div>
                <div>• Mobile-responsive layouts</div>
                <div>• Accessible UI with ARIA labels</div>
                <div>• Dark theme with glassmorphism</div>
              </div>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-6">
              <div className="text-lg font-semibold text-white mb-3">Backend</div>
              <div className="text-sm text-white/60 space-y-1">
                <div>• Next.js API routes</div>
                <div>• RESTful endpoints</div>
                <div>• Real-time data generation</div>
                <div>• OpenAI GPT-4 integration</div>
              </div>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-6">
              <div className="text-lg font-semibold text-white mb-3">Deployment</div>
              <div className="text-sm text-white/60 space-y-1">
                <div>• Vercel optimized</div>
                <div>• Edge Functions ready</div>
                <div>• CDN distribution</div>
                <div>• Zero configuration needed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Quality */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-5 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">0</div>
            <div className="text-sm text-white/60">Linter Errors</div>
          </div>
          <div className="rounded-xl bg-sky-500/10 border border-sky-500/30 p-5 text-center">
            <div className="text-3xl font-bold text-sky-400 mb-2">100%</div>
            <div className="text-sm text-white/60">TypeScript</div>
          </div>
          <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/30 p-5 text-center">
            <div className="text-3xl font-bold text-indigo-400 mb-2">12+</div>
            <div className="text-sm text-white/60">New Components</div>
          </div>
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-5 text-center">
            <div className="text-3xl font-bold text-rose-400 mb-2">7</div>
            <div className="text-sm text-white/60">Pages Built</div>
          </div>
        </div>
      </div>
    </div>,

    // Slide 10: Impact & Next Steps
    <div key="slide-10" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1800px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <Rocket className="h-12 w-12 text-emerald-400" />
          <h2 className="text-5xl font-bold text-white">Impact & Next Steps</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          What we've learned from this POC and realistic next steps forward
        </p>

        {/* POC Learnings */}
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-10 mb-10">
          <h3 className="text-3xl font-semibold text-white mb-8 flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-emerald-400" />
            Key POC Insights
          </h3>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold text-emerald-400 mb-3">
                Proven UX
              </div>
              <div className="text-lg text-white mb-2">Interface Patterns Work</div>
              <div className="text-base text-white/70 leading-relaxed">Multi-agent chat, operations dashboards, and incident radar demonstrate viable interaction models</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-sky-400 mb-3">
                Architecture
              </div>
              <div className="text-lg text-white mb-2">Scalable Foundation</div>
              <div className="text-base text-white/70 leading-relaxed">Data pipeline and API structure can support real production workloads with proper integration</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-400 mb-3">
                Potential
              </div>
              <div className="text-lg text-white mb-2">Clear Value Proposition</div>
              <div className="text-base text-white/70 leading-relaxed">AI could meaningfully improve incident response and operational intelligence with real data</div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-10">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Target className="h-7 w-7 text-sky-400" />
              Realistic Next Steps
            </h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-base">
                  1
                </div>
                <div>
                  <div className="font-medium text-white mb-2 text-base">Gather Feedback & Define Scope</div>
                  <div className="text-base text-white/70 leading-relaxed">Present to team, gather requirements, identify highest-value use cases to tackle first</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-base">
                  2
                </div>
                <div>
                  <div className="font-medium text-white mb-2 text-base">Assess Data Availability</div>
                  <div className="text-base text-white/70 leading-relaxed">Determine what operational data exists, quality level, and integration complexity</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-sm">
                  3
                </div>
                <div>
                  <div className="font-medium text-white mb-2 text-base">Plan Phased Rollout</div>
                  <div className="text-base text-white/70 leading-relaxed">Start small - one feature, one team, iterate based on real usage</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-10">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Users className="h-7 w-7 text-indigo-400" />
              Open Questions
            </h3>
            <div className="space-y-5">
              <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                <div className="font-medium text-white mb-2 text-base">Data Integration</div>
                <div className="text-base text-white/70 leading-relaxed">
                  How complex is connecting to existing systems? What's the data quality?
                </div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                <div className="font-medium text-white mb-2 text-base">AI Model Development</div>
                <div className="text-base text-white/70 leading-relaxed">
                  What's realistic timeframe for training models? Internal vs external resources?
                </div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                <div className="font-medium text-white mb-2 text-base">Resource Commitment</div>
                <div className="text-base text-white/70 leading-relaxed">
                  What team capacity exists? Budget for infrastructure and development?
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-10 text-center">
          <h3 className="text-3xl font-bold text-white mb-5">This is a Starting Point</h3>
          <p className="text-xl text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed">
            POC demonstrates what's possible with multi-agent AI for robotics operations. 
            The real work starts with understanding your needs, connecting real data, and building incrementally.
          </p>
          <div className="flex items-center justify-center gap-6">
            <a
              href="/"
              className="group flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-sky-500/30 transition-all hover:shadow-sky-500/50 hover:scale-105"
            >
              Explore POC
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <div className="text-white/70 text-base">
              Let's discuss feasibility and priorities
            </div>
          </div>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="relative min-h-screen">
      {/* Slide Content */}
      <div
        className={`transition-all duration-300 ${
          isAnimating
            ? slideDirection === "next"
              ? "opacity-0 translate-x-12"
              : "opacity-0 -translate-x-12"
            : "opacity-100 translate-x-0"
        }`}
      >
        {slides[currentSlide]}
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#020511]/95 backdrop-blur-xl px-6 py-4 shadow-2xl">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0 || isAnimating}
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
              currentSlide === 0
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : "bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 hover:scale-110"
            }`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating && index !== currentSlide) {
                    setIsAnimating(true);
                    setSlideDirection(index > currentSlide ? "next" : "prev");
                    setTimeout(() => {
                      setCurrentSlide(index);
                      setIsAnimating(false);
                    }, 300);
                  }
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-8 bg-sky-400"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="text-white/60 text-sm font-medium min-w-[60px] text-center">
            {currentSlide + 1} / {totalSlides}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1 || isAnimating}
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
              currentSlide === totalSlides - 1
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : "bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 hover:scale-110"
            }`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mouse-only navigation - no keyboard conflicts with chat */}
    </div>
  );
}

