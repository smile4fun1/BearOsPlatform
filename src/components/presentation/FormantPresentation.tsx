"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Brain, Zap, AlertTriangle, Target, Shield, CheckCircle2, Clock, DollarSign, Lock, Database, Users, GitBranch, Award, TrendingUp, Code, Network, Search } from "lucide-react";

export function FormantPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);
  
  const totalSlides = 5;

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

  const slides = [
    // Slide 1: Formant Strengths Based on Public Positioning
    <div key="slide-1" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <Award className="h-12 w-12 text-emerald-400" />
          <h2 className="text-5xl font-bold text-white">Formant Strengths Based on Public Positioning</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          What Formant claims and demonstrates in the market
        </p>

        <div className="grid gap-8">
          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 flex items-center justify-center">
                <Brain className="h-8 w-8 text-indigo-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">AI-Native Operations Layer</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed">
              Formant presents F3 as a generative AI and agentic reasoning platform that can interpret data and automate decisions. 
              Positioned as intelligent infrastructure, not just passive telemetry.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 flex items-center justify-center">
                <Shield className="h-8 w-8 text-emerald-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">Enterprise-Ready Robotics Infrastructure</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed">
              Robust telemetry, data ingestion, events, observability, and operational tooling. 
              Built for commercial-scale deployments with proven reliability.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-500/30 to-sky-600/30 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-sky-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">Focus on Efficiency Uplift</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed">
              Positioned to deliver measurable operational improvements through insights and automation. 
              Claims to optimize fleet performance and reduce operational overhead.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/30 flex items-center justify-center">
                <Users className="h-8 w-8 text-amber-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">Established Robotics Experience</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed">
              Years of work with commercial fleets and complex deployments across multiple robotics domains. 
              Deep understanding of operational challenges at scale.
            </p>
          </div>
        </div>
      </div>
    </div>,

    // Slide 2: What Formant's AI Actually Represents
    <div key="slide-2" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <Brain className="h-12 w-12 text-indigo-400" />
          <h2 className="text-5xl font-bold text-white">What Formant's AI Actually Represents</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          Technical reality behind the marketing claims
        </p>

        <div className="grid gap-8">
          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-10">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 flex items-center justify-center">
                <Network className="h-8 w-8 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">AI Orchestration Rather Than Full AI Models</h3>
                <p className="text-xl text-white/70 leading-relaxed">
                  The intelligence appears centered on automation logic, workflow execution, and agentic reasoning 
                  rather than supplying deep AI models. They coordinate AI, not create it.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-10">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-500/30 to-sky-600/30 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-sky-300" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Insight Generation</h3>
                <p className="text-xl text-white/70 leading-relaxed">
                  Transforms ingested fleet data into recommendations, anomaly detection, and early-warning signals. 
                  Analytics layer, not perception layer.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-10">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 flex items-center justify-center">
                <Search className="h-8 w-8 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Knowledge Intelligence</h3>
                <p className="text-xl text-white/70 leading-relaxed">
                  Supports searchable documentation, context-aware reasoning, and structured knowledge exploration. 
                  RAG-style systems for operational context.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-10">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/30 flex items-center justify-center">
                <Code className="h-8 w-8 text-amber-300" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Interface-Level Intelligence</h3>
                <p className="text-xl text-white/70 leading-relaxed mb-4">
                  Voice and text command handling for natural-language control. 
                  UX convenience, not core robotics intelligence.
                </p>
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-rose-500/30">
                  <AlertTriangle className="h-6 w-6 text-rose-400 flex-shrink-0" />
                  <div className="text-lg text-white/70">
                    <span className="font-semibold text-white">Critical:</span> No domain-specific AI models. 
                    Perception, recognition, or detection models must be supplied by us.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Slide 3: Benefits of Working with Formant Now
    <div key="slide-3" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <Zap className="h-12 w-12 text-emerald-400" />
          <h2 className="text-5xl font-bold text-white">Benefits of Working with Formant Now</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          Concrete advantages for accelerating operations
        </p>

        <div className="grid gap-8">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 flex items-center justify-center">
                <Clock className="h-8 w-8 text-emerald-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">Faster Implementation</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed">
              Provides an immediate foundation for telemetry, event pipelines, monitoring, and operational dashboards. 
              Skips months of infrastructure development.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-500/30 to-sky-600/30 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-sky-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">AI-Enabled Workflows Available</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed">
              Even if limited, their automation and insight engine accelerates operational improvements. 
              Useful for immediate efficiency gains while we build our own models.
            </p>
          </div>

          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 flex items-center justify-center">
                <Database className="h-8 w-8 text-indigo-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">Strong Data Pipeline Environment</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed">
              Well-suited to ingest outputs from our models such as detection events or observations. 
              They handle the plumbing, we provide the intelligence.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/30 flex items-center justify-center">
                <Shield className="h-8 w-8 text-amber-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">Mature Robotics Tooling</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed">
              Includes scheduling, monitoring, remote access, and incident handling. 
              Proven tools that reduce operational burden immediately.
            </p>
          </div>

          <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-violet-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/30 to-violet-600/30 flex items-center justify-center">
                <Award className="h-8 w-8 text-violet-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">Operational Credibility</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed">
              Helpful when working with enterprise clients and scaling deployments. 
              Their brand recognition adds legitimacy to our operations.
            </p>
          </div>
        </div>
      </div>
    </div>,

    // Slide 4: Key Risks and Concerns
    <div key="slide-4" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <AlertTriangle className="h-12 w-12 text-rose-400" />
          <h2 className="text-5xl font-bold text-white">Key Risks and Concerns</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          Critical issues that require careful evaluation and mitigation
        </p>

        <div className="grid gap-8">
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-10">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/30 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-amber-300" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Ambiguity in AI Capabilities</h3>
                <p className="text-xl text-white/70 leading-relaxed">
                  Public claims of generative AI contrast with the expectation that we supply our own models. 
                  This gap requires immediate clarification before deep integration.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-10">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-500/30 to-rose-600/30 flex items-center justify-center">
                <Lock className="h-8 w-8 text-rose-300" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Vendor Dependency</h3>
                <p className="text-xl text-white/70 leading-relaxed">
                  Deep integration makes future migration costly and complex. 
                  Every operational process that intertwines with Formant increases switching costs exponentially.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-10">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500/30 to-orange-600/30 flex items-center justify-center">
                <Database className="h-8 w-8 text-orange-300" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Data Exposure</h3>
                <p className="text-xl text-white/70 leading-relaxed">
                  Our model outputs and operational data sit within their ecosystem unless contractually controlled. 
                  IP protection and competitive intelligence require explicit legal safeguards.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-violet-500/5 p-10">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/30 to-violet-600/30 flex items-center justify-center">
                <Shield className="h-8 w-8 text-violet-300" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Limited Control</h3>
                <p className="text-xl text-white/70 leading-relaxed">
                  Customization of their AI layer and pipelines is constrained. 
                  Cannot rapidly iterate on proprietary workflows or competitive advantages.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-500/5 p-10">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500/30 to-red-600/30 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-red-300" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Cost Scaling</h3>
                <p className="text-xl text-white/70 leading-relaxed">
                  Usage-based pricing may escalate with high-volume AI outputs and data loads. 
                  Financial risk grows as the fleet scales and data volume increases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Slide 5: Strategic Position for Bear
    <div key="slide-5" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <Target className="h-12 w-12 text-sky-400" />
          <h2 className="text-5xl font-bold text-white">Strategic Position for Bear</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          Clear separation of responsibilities with long-term independence
        </p>

        <div className="grid gap-8">
          {/* Short-term Practicality */}
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 flex items-center justify-center">
                <Zap className="h-8 w-8 text-emerald-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">Short-Term Practicality</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed">
              Use Formant as the operational substrate for telemetry, dashboards, insights, and workflow automation. 
              Leverage their infrastructure while we focus on intelligence development.
            </p>
          </div>

          {/* Bear Supplies the Core Intelligence */}
          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 flex items-center justify-center">
                <Brain className="h-8 w-8 text-indigo-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">Bear Supplies the Core Intelligence</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed">
              Our models provide the actual perception, event detection, and domain-specific reasoning. 
              We own the differentiation, not the plumbing.
            </p>
          </div>

          {/* Clear Separation */}
          <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-500/30 to-sky-600/30 flex items-center justify-center">
                <GitBranch className="h-8 w-8 text-sky-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">Clear Separation of Responsibilities</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                <div className="font-bold text-white mb-3 text-xl flex items-center gap-2">
                  <Shield className="h-5 w-5 text-sky-400" />
                  Formant's Domain
                </div>
                <p className="text-lg text-white/70">
                  Orchestration, infrastructure, data pipelines, operational tooling, and monitoring dashboards
                </p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                <div className="font-bold text-white mb-3 text-xl flex items-center gap-2">
                  <Brain className="h-5 w-5 text-indigo-400" />
                  Bear's Domain
                </div>
                <p className="text-lg text-white/70">
                  Intelligence, perception models, detection algorithms, domain expertise, and competitive innovation
                </p>
              </div>
            </div>
          </div>

          {/* Long-term Independence */}
          <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-violet-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/30 to-violet-600/30 flex items-center justify-center">
                <Target className="h-8 w-8 text-violet-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">Long-Term Independence</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed">
              Maintaining control of our model stack preserves IP, differentiation, and strategic flexibility. 
              Design for decoupling from day one, execute migration when we have internal capability.
            </p>
          </div>

          {/* Strategic Summary */}
          <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              <h3 className="text-3xl font-bold text-white">Strategic Summary</h3>
            </div>
            <p className="text-xl text-white/80 max-w-5xl mx-auto leading-relaxed">
              Formant manages orchestration and infrastructure. Bear owns intelligence and innovation. 
              Use them now, plan for independence later, never lose control of our competitive advantage.
            </p>
          </div>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
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
    </div>
  );
}
