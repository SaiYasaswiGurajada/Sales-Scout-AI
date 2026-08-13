import React, { useState } from 'react';
import { Sparkles, X, Sliders, ArrowRight } from 'lucide-react';

interface RefineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefine: (instruction: string) => void;
  isLoading: boolean;
  companyName: string;
}

const QUICK_INSTRUCTIONS = [
  'Focus more on pricing & budget objection handling',
  'Emphasize cloud security, SOC2 & compliance questions',
  'Tailor conversation openers for a technical CTO/VP of Eng',
  'Highlight competitor trap questions against legacy vendors',
];

export const RefineModal: React.FC<RefineModalProps> = ({
  isOpen,
  onClose,
  onRefine,
  isLoading,
  companyName,
}) => {
  const [instruction, setInstruction] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;
    onRefine(instruction.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F3A]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-[#1FA9A0]/10 text-[#1FA9A0] border border-[#1FA9A0]/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0B1F3A]">
              Refine Briefing Strategy
            </h3>
            <p className="text-xs text-slate-500">
              Customize focus points for {companyName}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Specific Instructions or Focus Area
            </label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g., Focus heavily on security compliance objections, or tailor talking points for a budget-conscious procurement officer..."
              rows={3}
              required
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1FA9A0]"
            />
          </div>

          {/* Quick suggestions */}
          <div>
            <span className="block text-[11px] font-bold uppercase text-slate-400 mb-2">
              Quick Focus Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_INSTRUCTIONS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInstruction(preset)}
                  className="text-xs bg-slate-100 hover:bg-[#1FA9A0]/10 text-slate-700 hover:text-[#1FA9A0] px-2.5 py-1 rounded-lg border border-slate-200 hover:border-[#1FA9A0]/30 transition-all text-left"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !instruction.trim()}
              className="px-5 py-2.5 bg-[#F5A623] hover:bg-[#E09419] text-[#0B1F3A] font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#0B1F3A]" />
              <span>{isLoading ? 'Refining...' : 'Update Briefing'}</span>
              <ArrowRight className="w-4 h-4 text-[#0B1F3A]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
