"use client";

import { Users, MessageSquare, TrendingUp, Wrench, DollarSign, Shield, Sparkles } from "lucide-react";

const departmentalModels = [
  {
    icon: MessageSquare,
    name: "Sun Bear",
    department: "Customer Support",
    description: "7B parameter model fine-tuned for customer inquiries, troubleshooting, and onboarding assistance",
    params: "7B",
    use: "Chatbot, Email Support, FAQ",
    status: "Q1 2026",
    color: "from-amber-500/20 to-yellow-500/10",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/20"
  },
  {
    icon: TrendingUp,
    name: "Spectacled Bear",
    department: "Sales & Analytics",
    description: "13B parameter model for lead scoring, pipeline forecasting, and sales intelligence",
    params: "13B",
    use: "CRM Analysis, Forecasting, Lead Qualification",
    status: "Q2 2026",
    color: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/20"
  },
  {
    icon: Wrench,
    name: "Black Bear",
    department: "Field Engineering",
    description: "7B parameter model trained on maintenance logs, repair procedures, and diagnostic protocols",
    params: "7B",
    use: "Remote Diagnostics, Repair Guides, Parts Lookup",
    status: "Q2 2026",
    color: "from-sky-500/20 to-blue-500/10",
    iconColor: "text-sky-400",
    borderColor: "border-sky-500/20"
  },
  {
    icon: DollarSign,
    name: "Gobi Bear",
    department: "Finance & Accounting",
    description: "3B parameter model for invoice processing, expense categorization, and financial reporting",
    params: "3B",
    use: "Invoice Parsing, Expense Management, Reporting",
    status: "Q3 2026",
    color: "from-violet-500/20 to-purple-500/10",
    iconColor: "text-violet-400",
    borderColor: "border-violet-500/20"
  },
  {
    icon: Shield,
    name: "Syrian Brown Bear",
    department: "Compliance & Legal",
    description: "13B parameter model for contract review, regulatory compliance, and policy interpretation",
    params: "13B",
    use: "Contract Analysis, Compliance Checks, Policy Q&A",
    status: "Q3 2026",
    color: "from-rose-500/20 to-pink-500/10",
    iconColor: "text-rose-400",
    borderColor: "border-rose-500/20"
  },
  {
    icon: Users,
    name: "Panda Bear",
    department: "Human Resources",
    description: "7B parameter model for candidate screening, policy guidance, and employee onboarding",
    params: "7B",
    use: "Resume Screening, Onboarding, Policy Assistant",
    status: "Q4 2026",
    color: "from-indigo-500/20 to-blue-500/10",
    iconColor: "text-indigo-400",
    borderColor: "border-indigo-500/20"
  }
];

export function DepartmentalModels() {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="h-6 w-6 text-sky-400" />
          <h2 className="text-2xl font-bold">Departmental AI Models</h2>
        </div>
        <p className="text-white/60">
          Specialized models designed for efficiency across company departments. 
          Smaller, focused models trained on domain-specific data for optimal performance and cost-effectiveness.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departmentalModels.map((model) => {
          const Icon = model.icon;
          return (
            <div
              key={model.name}
              className={`rounded-2xl border ${model.borderColor} bg-gradient-to-r ${model.color} p-6 transition-all duration-300 hover:border-white/20 hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10`}>
                  <Icon className={`h-6 w-6 ${model.iconColor}`} />
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                  {model.status}
                </span>
              </div>

              <div className="mb-3">
                <h3 className="font-bold text-lg text-white mb-1">{model.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                    {model.department}
                  </span>
                  <span className="text-xs font-semibold text-white/70">
                    • {model.params}
                  </span>
                </div>
              </div>

              <p className="text-sm text-white/70 leading-relaxed mb-4">
                {model.description}
              </p>

              <div className="pt-4 border-t border-white/10">
                <div className="text-xs text-white/50 mb-2">Use Cases</div>
                <div className="flex flex-wrap gap-2">
                  {model.use.split(", ").map((useCase, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/80"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-sky-500/20">
            <Sparkles className="h-5 w-5 text-sky-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Why Smaller Models?</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Each departmental model is optimized for specific tasks, offering <span className="text-sky-400 font-medium">faster inference</span>, 
              <span className="text-sky-400 font-medium"> lower costs</span>, and <span className="text-sky-400 font-medium">higher accuracy</span> compared 
              to using large general-purpose models. A 7B model for customer support can outperform a 120B model on domain-specific tasks 
              while being 95% cheaper to run.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

