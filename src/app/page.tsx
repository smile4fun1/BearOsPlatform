import Link from "next/link";
import { ArrowRight, Sparkles, BarChart3, Brain, Database, Zap, Globe2, Shield, Bot, Network, CheckCircle2, Target, Users, Workflow } from "lucide-react";
import { composeCurationResponse } from "@/lib/dataCurator";
import { HomeStats } from "@/components/HomeStats";

export default async function Home() {
  const universe = composeCurationResponse();
  const latestKPI = universe.kpis[0];
  const latestFinancials = universe.financials.at(-1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]" />
        
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="flex items-center gap-2 rounded-full border border-[#5DADE2]/20 bg-[#5DADE2]/10 px-4 py-2 text-sm font-medium text-[#85C1E9] backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered · Agentic Automation · Real-time Intelligence</span>
            </div>

            {/* Main Heading */}
            <h1 className="mt-8 max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              The Bear Universe
              <span className="block mt-2 bg-gradient-to-r from-sky-400 via-indigo-400 to-rose-400 bg-clip-text text-transparent">
                Intelligent Automation Ecosystem
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-xl text-white/70 leading-relaxed">
              Centralized operations platform powered by multi-agent AI systems. 
              Monitor fleet health, diagnose incidents in real-time, and leverage AI-assisted 
              troubleshooting for field engineers and operations teams.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/features"
                className="group flex items-center justify-center gap-2 rounded-xl bg-[#5DADE2] hover:bg-[#3498DB] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#5DADE2]/30 transition-all hover:shadow-[#5DADE2]/50 hover:scale-105"
              >
                Explore Features
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/operations"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#5DADE2]/30 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-[#5DADE2]/10 hover:border-[#5DADE2]/50"
              >
                View Operations
              </Link>
            </div>

            {/* Live Stats with Animated Counters */}
            <HomeStats 
              ordersValue={latestKPI?.value || "12.4M"}
              ordersDelta={latestKPI?.delta || "+8.2%"}
              deployments={latestFinancials?.deployments || 1247}
              aiModels={universe.trainingPlans.length}
            />
          </div>
        </div>
      </section>

      {/* Bear AI Agents Section */}
      <section className="relative py-24 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 text-indigo-400 mb-4">
              <Bot className="h-6 w-6" />
              <span className="text-sm font-medium uppercase tracking-wider">Bear AI Constellation</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Multi-Agent Intelligence
            </h2>
            <p className="mt-4 text-lg text-white/60 max-w-3xl mx-auto">
              Our ecosystem of specialized AI agents, each named after bear species, 
              work together to orchestrate operations, solve problems, and optimize performance.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Ursa Minor */}
            <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-8 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl transition-all group-hover:bg-indigo-500/20" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-indigo-600/30">
                    <Bot className="h-6 w-6 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Ursa Minor</h3>
                    <p className="text-sm text-white/50">Interactive Assistant</p>
                  </div>
                </div>
                <p className="text-white/70 leading-relaxed mb-4">
                  Your personal Bear Universe companion. Navigate dashboards, modify robot parameters, 
                  and execute commands with intelligent permission controls.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-300">40B params</span>
                  <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-300">Tool Calling</span>
                  <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-300">Context Aware</span>
                </div>
              </div>
            </div>

            {/* Ursa Major */}
            <div className="rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-sky-500/5 p-8 relative overflow-hidden group hover:border-sky-500/40 transition-all">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl transition-all group-hover:bg-sky-500/20" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/30 to-sky-600/30">
                    <Brain className="h-6 w-6 text-sky-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Ursa Major</h3>
                    <p className="text-sm text-white/50">Fleet Orchestrator</p>
                  </div>
                </div>
                <p className="text-white/70 leading-relaxed mb-4">
                  Analyzes fleet telemetry, surfaces KPIs, auto-drafts diagnostics, and orchestrates 
                  multi-agent task delegation across the entire Bear ecosystem.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-300">70B params</span>
                  <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-300">Multi-Agent</span>
                  <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-300">Ready</span>
                </div>
              </div>
            </div>

            {/* Aurora Bear Lore */}
            <div className="rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-8 relative overflow-hidden group hover:border-rose-500/40 transition-all">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-rose-500/10 blur-3xl transition-all group-hover:bg-rose-500/20" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/30 to-rose-600/30">
                    <Database className="h-6 w-6 text-rose-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Aurora Bear Lore</h3>
                    <p className="text-sm text-white/50">Knowledge Core</p>
                  </div>
                </div>
                <p className="text-white/70 leading-relaxed mb-4">
                  Institutional memory for Bear Robotics. Answers questions about products, 
                  partnerships, compliance, and brand voice with encyclopedic accuracy.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs text-rose-300">120B params</span>
                  <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs text-rose-300">Knowledge</span>
                  <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs text-rose-300">Training</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Features Section */}
      <section className="relative py-24 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 text-emerald-400 mb-4">
              <Sparkles className="h-6 w-6" />
              <span className="text-sm font-medium uppercase tracking-wider">Coming Soon</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Next-Generation Capabilities
            </h2>
            <p className="mt-4 text-lg text-white/60 max-w-3xl mx-auto">
              Advanced agentic features currently in development to revolutionize robotic fleet management
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                  <Workflow className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-lg">Agentic Task Delegation</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Automatically distribute complex tasks across specialized bear agents. 
                Each agent handles its domain expertise while coordinating seamlessly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20">
                  <Target className="h-5 w-5 text-sky-400" />
                </div>
                <h3 className="font-semibold text-lg">Proactive Problem Solving</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                AI agents scan telemetry 24/7, identifying and resolving issues before they impact operations. 
                Autonomous fixes with human oversight.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/20">
                  <Shield className="h-5 w-5 text-rose-400" />
                </div>
                <h3 className="font-semibold text-lg">Permission Blacklisting</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Granular control over agent capabilities. Define what each agent can and cannot do 
                with role-based access and action constraints.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
                  <Network className="h-5 w-5 text-indigo-400" />
                </div>
                <h3 className="font-semibold text-lg">Multi-Agent Aggregation</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Orchestrate teams of bear agents for complex workflows. Combine Ursa Major's 
                analytics with Aurora's knowledge for comprehensive insights.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                  <CheckCircle2 className="h-5 w-5 text-amber-400" />
                </div>
                <h3 className="font-semibold text-lg">Hallucination Prevention</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Keep agent conversations short and precise. Structured prompts and fact-checking 
                pipelines ensure 99.9%+ accuracy on critical operations.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20">
                  <Users className="h-5 w-5 text-violet-400" />
                </div>
                <h3 className="font-semibold text-lg">Real-time Robot Dashboards</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Individual robot monitoring with live status updates. Agents automatically update 
                dashboards when completing tasks or detecting anomalies.
              </p>
            </div>
          </div>

          {/* Additional Features List */}
          <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8">
            <h3 className="text-xl font-bold mb-6">Additional Capabilities</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Tool Calling Framework</div>
                  <div className="text-sm text-white/60">Agents can invoke APIs, query databases, and modify parameters safely</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Context-Aware Memory</div>
                  <div className="text-sm text-white/60">LangChain-powered conversation memory across sessions</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Permission-Gated Commands</div>
                  <div className="text-sm text-white/60">All actions require explicit user approval before execution</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Robot-Specific Navigation</div>
                  <div className="text-sm text-white/60">Ask "show me robot c44e79" to jump to detailed interface</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="relative py-24 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Platform Capabilities
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Everything you need to monitor, analyze, and optimize robotic operations
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature Cards */}
            <Link
              href="/operations"
              className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 transition-all hover:border-[#5DADE2]/30 hover:shadow-lg hover:shadow-[#5DADE2]/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 text-sky-400">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Real-time Operations</h3>
              <p className="mt-3 text-white/60 leading-relaxed">
                Live telemetry monitoring across all deployed facilities 
                with shift-level granularity and instant health diagnostics.
              </p>
              <div className="mt-6 flex items-center text-sm font-medium text-[#5DADE2] transition-colors group-hover:text-[#85C1E9]">
                View Dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/ai-models"
              className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 transition-all hover:border-[#5DADE2]/30 hover:shadow-lg hover:shadow-[#5DADE2]/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-rose-500/20 text-indigo-400">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">AI Model Orchestration</h3>
              <p className="mt-3 text-white/60 leading-relaxed">
                Track training progress for Ursa Minor, Ursa Major, and Aurora Bear Lore with milestone monitoring.
              </p>
              <div className="mt-6 flex items-center text-sm font-medium text-[#5DADE2] transition-colors group-hover:text-[#85C1E9]">
                Monitor Training
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/data-lake"
              className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 transition-all hover:border-[#5DADE2]/30 hover:shadow-lg hover:shadow-[#5DADE2]/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 text-rose-400">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Data Lake Insights</h3>
              <p className="mt-3 text-white/60 leading-relaxed">
                Curated operational datasets with KPI aggregation, demand heatmaps, 
                and incident radar across all facilities.
              </p>
              <div className="mt-6 flex items-center text-sm font-medium text-[#5DADE2] transition-colors group-hover:text-[#85C1E9]">
                Explore Data
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">ChatGPT Integration</h3>
              <p className="mt-3 text-white/60 leading-relaxed">
                Ask ad-hoc questions about operations, KPIs, and training progress 
                with context-aware AI responses.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Knowledge Base</h3>
              <p className="mt-3 text-white/60 leading-relaxed">
                Comprehensive documentation of Bear products, partnerships, 
                and GTM strategies with confidence scoring.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-violet-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">API Catalog</h3>
              <p className="mt-3 text-white/60 leading-relaxed">
                RESTful endpoints for curation data, insights, and model telemetry 
                with latency monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="rounded-[40px] border border-white/10 bg-gradient-to-br from-[#090f2f] via-[#080d24] to-[#02040c] p-12 text-center lg:p-16">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to explore the Bear Universe?
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Start monitoring operations, tracking AI training, and accessing insights with Ursa Minor.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/features"
                className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-rose-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition-all hover:shadow-sky-500/50 hover:scale-105"
              >
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/data-lake"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg overflow-hidden">
                <img 
                  src="/download.png" 
                  alt="Bear Robotics" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-semibold">Bear Universe</div>
                <div className="text-xs text-white/50">Bearrobotics.ai</div>
              </div>
            </div>
            <div className="text-sm text-white/50">
              © 2025 Bear Robotics Operations Platform.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
