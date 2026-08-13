import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Loader2, Globe, UserCheck, ShieldAlert, FileText } from 'lucide-react';

interface LoadingSequenceProps {
  companyName: string;
  stakeholderName?: string;
}

const STEPS = [
  {
    title: 'Scanning company news & market presence',
    subtitle: 'Checking funding history, press releases, and key triggers',
    icon: Globe,
  },
  {
    title: 'Mapping stakeholder persona & top KPIs',
    subtitle: 'Analyzing decision authority, role priorities, and communication style',
    icon: UserCheck,
  },
  {
    title: 'Evaluating competitive risks & objection radar',
    subtitle: 'Identifying incumbent landmines and response strategies',
    icon: ShieldAlert,
  },
  {
    title: 'Synthesizing 2-minute executive briefing',
    subtitle: 'Formatting conversation openers and discovery questions',
    icon: FileText,
  },
];

export const LoadingSequence: React.FC<LoadingSequenceProps> = ({ companyName, stakeholderName }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(Math.round(((currentStep + 1) / STEPS.length) * 100), 95);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 text-center relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-[#1FA9A0] via-[#F5A623] to-[#1FA9A0] animate-pulse" />

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B1F3A] text-white text-xs font-semibold mb-6 shadow">
          <Sparkles className="w-4 h-4 text-[#F5A623] animate-spin" />
          <span>SalesScout AI Intelligence Engine Active</span>
        </div>

        <h2 className="text-2xl font-extrabold text-[#0B1F3A] mb-1">
          Building Briefing for {companyName}
        </h2>
        {stakeholderName && (
          <p className="text-sm font-medium text-[#1FA9A0] mb-6">
            Focused on {stakeholderName}
          </p>
        )}

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-8 max-w-lg mx-auto border border-slate-200">
          <div
            className="bg-gradient-to-r from-[#1FA9A0] to-[#F5A623] h-full transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Animated Step List */}
        <div className="space-y-4 text-left max-w-md mx-auto">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3.5 p-3 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#1FA9A0]/10 border border-[#1FA9A0]/30 scale-[1.02] shadow-sm'
                    : isDone
                    ? 'opacity-80'
                    : 'opacity-40 grayscale'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-[#1FA9A0] animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div
                    className={`text-sm font-bold ${
                      isCurrent ? 'text-[#0B1F3A]' : isDone ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{step.subtitle}</div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 mt-8 italic">
          Tip: Briefings are saved automatically to your history sidebar so you can review before follow-up calls.
        </p>
      </div>
    </div>
  );
};
