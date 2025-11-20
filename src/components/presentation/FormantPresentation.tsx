"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, TrendingUp, Zap, AlertTriangle, Target, Shield, CheckCircle2, Clock, DollarSign, Lock, Database, Users, GitBranch } from "lucide-react";

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
    // Slide 1: Why Formant Is Attractive
    <div key="slide-1" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="h-12 w-12 text-emerald-400" />
          <h2 className="text-5xl font-bold text-white">Why Formant Is Attractive Right Now</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          Clear advantages that make Formant a compelling option for robotics operations
        </p>

        <div className="grid gap-8">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 flex items-center justify-center">
                <Shield className="h-8 w-8 text-emerald-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">Enterprise-Grade Readiness</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed">
              Mature telemetry platform, incident tracking systems, and data infrastructure available immediately. 
              No need to build foundational systems from scratch.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-500/30 to-sky-600/30 flex items-center justify-center">
                <Zap className="h-8 w-8 text-sky-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">Operational Efficiency Gains</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed">
              Their model focuses on delivering measurable 5–20% improvements in fleet operations. 
              Proven track record with robotics deployments at scale.
            </p>
          </div>

          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 flex items-center justify-center">
                <Users className="h-8 w-8 text-indigo-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">Robotics Domain Expertise</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed">
              Years of experience with complex robotic deployments and fleet environments. 
              Deep understanding of telemetry, diagnostics, and operational challenges.
            </p>
          </div>
        </div>
      </div>
    </div>,

    // Slide 2: Acceleration Benefits
    <div key="slide-2" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <Zap className="h-12 w-12 text-sky-400" />
          <h2 className="text-5xl font-bold text-white">Acceleration Benefits</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          How Formant speeds up deployment and reduces operational burden
        </p>

        <div className="grid grid-cols-3 gap-8">
          <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-10 transform transition-all hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-sky-500/30 to-sky-600/30 flex items-center justify-center">
                <Clock className="h-10 w-10 text-sky-300" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4 text-center">Faster Implementation</h3>
            <p className="text-base text-white/70 leading-relaxed text-center">
              Skips months of building foundational systems from scratch. 
              Get operational telemetry and incident tracking up and running quickly.
            </p>
          </div>

          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-10 transform transition-all hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 flex items-center justify-center">
                <Users className="h-10 w-10 text-indigo-300" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4 text-center">Access to Embedded Engineers</h3>
            <p className="text-base text-white/70 leading-relaxed text-center">
              Formant deploys specialists on-site, reducing internal support load 
              and accelerating insights from telemetry data.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-10 transform transition-all hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 flex items-center justify-center">
                <Database className="h-10 w-10 text-emerald-300" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4 text-center">Scalable Backbone</h3>
            <p className="text-base text-white/70 leading-relaxed text-center">
              Reliable infrastructure that can support large-scale operations from day one. 
              Built to handle enterprise fleet complexity.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">Immediate</div>
              <div className="text-base text-white/60">Time to Value</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sky-400 mb-2">Proven</div>
              <div className="text-base text-white/60">Infrastructure</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-400 mb-2">Reduced</div>
              <div className="text-base text-white/60">Internal Burden</div>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Slide 3: Risks and Concerns
    <div key="slide-3" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <AlertTriangle className="h-12 w-12 text-amber-400" />
          <h2 className="text-5xl font-bold text-white">Risks and Concerns</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          Critical considerations that must be evaluated before committing
        </p>

        <div className="grid gap-8">
          <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-10">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-500/30 to-rose-600/30 flex items-center justify-center">
                <Lock className="h-8 w-8 text-rose-300" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Vendor Lock-In</h3>
                <p className="text-xl text-white/70 leading-relaxed">
                  Deep dependency on their platform, tools, and roadmap. Migration becomes exponentially 
                  harder over time as operational processes intertwine with Formant architecture. 
                  Exit strategy must be considered from day one.
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
                  Operational data contributes to their AI models unless tightly restricted contractually. 
                  IP and competitive intelligence risk if data handling terms aren't explicit. 
                  Requires careful legal review.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-10">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/30 flex items-center justify-center">
                <Shield className="h-8 w-8 text-amber-300" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Limited Customization</h3>
                <p className="text-xl text-white/70 leading-relaxed">
                  Their architecture, UI, and model behavior are not fully under our control. 
                  Custom features require their development cycles. Cannot rapidly iterate on 
                  proprietary workflows or competitive advantages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Slide 4: Strategic Alignment Risks
    <div key="slide-4" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <Target className="h-12 w-12 text-rose-400" />
          <h2 className="text-5xl font-bold text-white">Strategic Alignment Risks</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          Long-term concerns about business direction and cost structure
        </p>

        <div className="grid gap-8">
          <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-10">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-500/30 to-rose-600/30 flex items-center justify-center">
                <GitBranch className="h-8 w-8 text-rose-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-4">Different Long-Term Goals</h3>
                <p className="text-xl text-white/70 leading-relaxed mb-6">
                  Formant has repositioned away from robotics tooling toward enterprise AI efficiency. 
                  Their strategic priorities may diverge from robotics-specific needs over time.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                    <div className="font-semibold text-white mb-2 text-base">Formant's Focus</div>
                    <div className="text-base text-white/60">Enterprise AI efficiency, cross-industry solutions</div>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                    <div className="font-semibold text-white mb-2 text-base">Our Needs</div>
                    <div className="text-base text-white/60">Robotics-specific tools, competitive differentiation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-10">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500/30 to-orange-600/30 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-orange-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-4">Cost and Complexity Escalation</h3>
                <p className="text-xl text-white/70 leading-relaxed mb-6">
                  Usage fees and storage costs can scale aggressively with fleet growth. 
                  Migration becomes prohibitively difficult after deep integration.
                </p>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-orange-400" />
                  <div className="text-base text-white/70">
                    Financial risk increases as operational dependency deepens
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Slide 5: Recommended Positioning
    <div key="slide-5" className="flex flex-col justify-center min-h-[80vh] px-16 pb-32">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <CheckCircle2 className="h-12 w-12 text-emerald-400" />
          <h2 className="text-5xl font-bold text-white">Recommended Positioning</h2>
        </div>
        
        <p className="text-2xl text-white/70 mb-12 leading-relaxed">
          Balanced approach to maximize benefits while minimizing long-term risk
        </p>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 flex items-center justify-center">
                <Zap className="h-8 w-8 text-emerald-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">Short-Term Strategy</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed mb-6">
              Use Formant to gain stability, speed, insight, and knowledge.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-base text-white/70">Accelerate operational visibility immediately</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-base text-white/70">Learn from their robotics expertise and patterns</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-base text-white/70">Reduce internal development burden during growth phase</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-base text-white/70">Gain embedded engineering support while building team</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-500/30 to-sky-600/30 flex items-center justify-center">
                <Target className="h-8 w-8 text-sky-300" />
              </div>
              <h3 className="text-3xl font-bold text-white">Long-Term Strategy</h3>
            </div>
            <p className="text-xl text-white/70 leading-relaxed mb-6">
              Plan for gradual decoupling to maintain independent control, IP, and data ownership.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-sky-400 mt-0.5 flex-shrink-0" />
                <div className="text-base text-white/70">Build internal capabilities while using Formant</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-sky-400 mt-0.5 flex-shrink-0" />
                <div className="text-base text-white/70">Design data architecture with migration in mind</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-sky-400 mt-0.5 flex-shrink-0" />
                <div className="text-base text-white/70">Develop proprietary features on separate infrastructure</div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-sky-400 mt-0.5 flex-shrink-0" />
                <div className="text-base text-white/70">Retain strategic control over competitive advantages</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-10 text-center">
          <h3 className="text-3xl font-bold text-white mb-5">Balanced Approach</h3>
          <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Leverage Formant's strengths now while building the foundation for independence later. 
            Maximize immediate value without compromising long-term strategic flexibility.
          </p>
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
    </div>
  );
}

