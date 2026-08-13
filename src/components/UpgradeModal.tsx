import React, { useState } from 'react';
import { X, Check, Zap, Sparkles, Building2, User, Users, CheckCircle2 } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopUpTokens?: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onTopUpTokens }) => {
  const [selectedTier, setSelectedTier] = useState<'individual' | 'team' | 'enterprise'>('team');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubscribe = (tierName: string) => {
    setToastMessage(`Subscribe to ${tierName} plan coming soon! Payment processing is simulated for MVP demo.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Decorative ambient gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1FA9A0]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F5A623]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5A623]/10 text-[#B87B11] border border-[#F5A623]/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />
            SalesScout AI Launch Offer
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
            Upgrade Your Sales Intelligence
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-md mx-auto">
            Unlimited pre-meeting briefings, stakeholder deep dives, CRM auto-sync, and live meeting assistance.
          </p>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          
          {/* Individual Tier */}
          <div
            onClick={() => setSelectedTier('individual')}
            className={`rounded-2xl p-5 border cursor-pointer transition-all flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg ${
              selectedTier === 'individual'
                ? 'bg-slate-50 border-2 border-[#1FA9A0] shadow-md ring-2 ring-[#1FA9A0]/20'
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#1FA9A0]/10 text-[#1FA9A0]">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-base text-[#0B1F3A]">Individual</h3>
                </div>
                <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded uppercase">
                  Launch Offer
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">For solo Account Executives & SDRs</p>
              
              <div className="mb-4 flex items-baseline gap-2">
                <span className="text-sm text-slate-400 line-through font-semibold">$49</span>
                <span className="text-3xl font-extrabold text-[#F5A623]">$29</span>
                <span className="text-xs text-slate-500 font-medium"> / month</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1FA9A0]" />
                  <span>30 Briefings / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1FA9A0]" />
                  <span>Google Calendar Sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1FA9A0]" />
                  <span>Gmail PDF Briefing Delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1FA9A0]" />
                  <span>3-Year Financial Records</span>
                </li>
              </ul>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSubscribe('Individual ($29/mo)');
              }}
              className="w-full py-2.5 px-3 bg-[#0B1F3A] hover:bg-[#15345d] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow"
            >
              Subscribe ($29/mo)
            </button>
          </div>

          {/* Team Tier (Featured) */}
          <div
            onClick={() => setSelectedTier('team')}
            className={`rounded-2xl p-5 border cursor-pointer transition-all flex flex-col justify-between relative transform md:-translate-y-2 hover:-translate-y-3 hover:shadow-2xl ${
              selectedTier === 'team'
                ? 'bg-[#0B1F3A] text-white border-2 border-[#1FA9A0] shadow-2xl ring-2 ring-[#1FA9A0]/40'
                : 'bg-[#0B1F3A]/90 text-white border-slate-700'
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1FA9A0] text-white text-[10px] uppercase font-extrabold tracking-widest px-3 py-0.5 rounded-full shadow">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 mt-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#1FA9A0]/20 text-[#1FA9A0]">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-base text-white">Team</h3>
                </div>
                <span className="text-[9px] bg-[#F5A623] text-[#0B1F3A] font-extrabold px-1.5 py-0.5 rounded uppercase">
                  50% Off
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-4">Up to 10 Reps & Supervisors</p>
              
              <div className="mb-4 flex items-baseline gap-2">
                <span className="text-sm text-slate-400 line-through font-semibold">$99</span>
                <span className="text-3xl font-extrabold text-[#F5A623]">$49</span>
                <span className="text-xs text-slate-300 font-medium"> / month</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-200 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1FA9A0]" />
                  <span>Unlimited Briefings</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1FA9A0]" />
                  <span>Team Activity Dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1FA9A0]" />
                  <span>Teammate Briefing Sharing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1FA9A0]" />
                  <span>Supervisor Oversight & Logs</span>
                </li>
              </ul>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSubscribe('Team ($49/mo)');
              }}
              className="w-full py-2.5 px-3 bg-[#F5A623] hover:bg-[#E09419] text-[#0B1F3A] font-extrabold text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              Subscribe ($49/mo)
            </button>
          </div>

          {/* Enterprise Tier */}
          <div
            onClick={() => setSelectedTier('enterprise')}
            className={`rounded-2xl p-5 border cursor-pointer transition-all flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg ${
              selectedTier === 'enterprise'
                ? 'bg-slate-50 border-2 border-[#1FA9A0] shadow-md ring-2 ring-[#1FA9A0]/20'
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-[#0B1F3A]/10 text-[#0B1F3A]">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#0B1F3A]">Enterprise</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">Custom deployment for large sales orgs</p>
              
              <div className="mb-4">
                <span className="text-2xl font-extrabold text-[#0B1F3A]">Custom</span>
                <span className="text-xs text-slate-500 font-medium"> pricing</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1FA9A0]" />
                  <span>Custom CRM Integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1FA9A0]" />
                  <span>Dedicated Account Manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1FA9A0]" />
                  <span>Custom AI Model Fine-tuning</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1FA9A0]" />
                  <span>SOC2 & Custom SLA</span>
                </li>
              </ul>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                alert('Contact Enterprise Sales: sales@salesscout.ai');
              }}
              className="w-full py-2.5 px-3 bg-[#0B1F3A] hover:bg-[#183961] text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Contact Sales
            </button>
          </div>

        </div>

        {/* Demo Top-up bar */}
        {onTopUpTokens && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Evaluation Mode Active:</strong> Click below to immediately top-up 5 free briefing tokens.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onTopUpTokens();
                onClose();
              }}
              className="px-4 py-2 bg-[#F5A623] hover:bg-[#E09419] text-[#0B1F3A] font-extrabold rounded-xl shadow transition-all cursor-pointer whitespace-nowrap"
            >
              + Add 5 Free Tokens
            </button>
          </div>
        )}

        {/* Note */}
        <p className="text-center text-[11px] text-slate-400 mt-4">
          Note: Payment processing simulated for MVP capstone demo.
        </p>
      </div>
    </div>
  );
};

