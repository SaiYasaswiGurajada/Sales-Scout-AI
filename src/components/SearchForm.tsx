import React, { useState } from 'react';
import { Building2, User, Briefcase, Sparkles, ArrowRight, Zap, Target, Calendar, Clock, MessageSquare } from 'lucide-react';
import { SearchInput } from '../types';

interface SearchFormProps {
  onSearch: (input: SearchInput) => void;
  isLoading: boolean;
}

const PRESET_DEMOS = [
  {
    companyName: 'Acme Health Tech',
    stakeholderName: 'Sarah Chen',
    stakeholderTitle: 'VP of Procurement & Operations',
    industry: 'Healthcare SaaS',
    prompt: 'I have a meeting on 5 Aug 2026 with Acme Health Tech. I want information about this company — last 3 years of data, all financial records, current affairs about the company. I want a full brief.',
    tag: 'Procurement / SaaS'
  },
  {
    companyName: 'Snowflake Data',
    stakeholderName: 'Elena Rostova',
    stakeholderTitle: 'Director of Security Architecture',
    industry: 'Enterprise Data',
    prompt: 'Meeting tomorrow with Snowflake Data. Focus on data warehouse expansion, cloud security compliance, and 3-year revenue growth.',
    tag: 'Security Lead'
  },
  {
    companyName: 'Stripe Global',
    stakeholderName: 'Marcus Vance',
    stakeholderTitle: 'Head of Growth Engineering',
    industry: 'Fintech / Payments',
    prompt: 'Upcoming call with Stripe Global. Provide full executive brief, 3 years financial highlights, recent current affairs and objections.',
    tag: 'Fintech Growth'
  },
  {
    companyName: 'Datadog Systems',
    stakeholderName: 'David Kogan',
    stakeholderTitle: 'VP of Infrastructure & DevOps',
    industry: 'Cloud Infrastructure',
    prompt: 'Preparing for Datadog Systems sync. Give me competitive positioning against Dynatrace and 3-year financial record.',
    tag: 'Cloud DevOps'
  }
];

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [companyName, setCompanyName] = useState('');
  const [stakeholderName, setStakeholderName] = useState('');
  const [stakeholderTitle, setStakeholderTitle] = useState('');
  const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState('');
  const [timeframe, setTimeframe] = useState('60 minutes before');
  const [customScheduledDate, setCustomScheduledDate] = useState<string>(() => {
    const d = new Date(Date.now() + 24 * 3600 * 1000);
    return d.toISOString().slice(0, 10);
  });
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [industry, setIndustry] = useState('');
  const [dealSize, setDealSize] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    onSearch({
      companyName: companyName.trim(),
      stakeholderName: stakeholderName.trim() || undefined,
      stakeholderTitle: stakeholderTitle.trim() || undefined,
      industry: industry.trim() || undefined,
      dealSize: dealSize.trim() || undefined,
      naturalLanguagePrompt: naturalLanguagePrompt.trim() || undefined,
      timeframe,
      customScheduledDate: showCalendarPicker ? customScheduledDate : undefined,
    });
  };

  const handlePresetClick = (preset: typeof PRESET_DEMOS[0]) => {
    setCompanyName(preset.companyName);
    setStakeholderName(preset.stakeholderName);
    setStakeholderTitle(preset.stakeholderTitle);
    setIndustry(preset.industry);
    setNaturalLanguagePrompt(preset.prompt);
    
    onSearch({
      companyName: preset.companyName,
      stakeholderName: preset.stakeholderName,
      stakeholderTitle: preset.stakeholderTitle,
      industry: preset.industry,
      naturalLanguagePrompt: preset.prompt,
      timeframe: '60 minutes before',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 font-sans">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1FA9A0]/10 text-[#1FA9A0] border border-[#1FA9A0]/20 text-xs font-bold uppercase tracking-wider mb-4">
          <Zap className="w-3.5 h-3.5 fill-[#1FA9A0]" />
          Instant Pre-Meeting Sales Intelligence
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1F3A] tracking-tight mb-3">
          Walk in informed. <span className="text-[#1FA9A0]">Every time.</span>
        </h1>
        
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
          Generate an executive pre-meeting briefing on any prospect company & decision maker in seconds, automatically synced to your calendar.
        </p>
      </div>

      {/* Main Search Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle decorative background blur */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#1FA9A0]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#F5A623]/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          
          {/* Primary Company & Stakeholder Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Company Name (Span 6) */}
            <div className="md:col-span-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F3A] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#1FA9A0]" />
                  Company Name <span className="text-amber-500">*</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Stripe, Datadog, Acme Corp, Snowflake"
                  required
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1FA9A0] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Stakeholder Name (Span 3) */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-500" />
                Stakeholder Name
              </label>
              <input
                type="text"
                value={stakeholderName}
                onChange={(e) => setStakeholderName(e.target.value)}
                placeholder="e.g., Sarah Chen"
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1FA9A0]"
              />
            </div>

            {/* Stakeholder Title (Span 3) */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-500" />
                Title / Role
              </label>
              <input
                type="text"
                value={stakeholderTitle}
                onChange={(e) => setStakeholderTitle(e.target.value)}
                placeholder="e.g., VP Procurement"
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1FA9A0]"
              />
            </div>
          </div>

          {/* Natural Language Free-Text Prompt Box */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F3A] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#F5A623]" />
                Natural Language Briefing Prompt <span className="text-slate-400 font-normal lowercase">(describe what you need)</span>
              </span>
            </label>
            <textarea
              value={naturalLanguagePrompt}
              onChange={(e) => setNaturalLanguagePrompt(e.target.value)}
              rows={3}
              placeholder='e.g., "I have a meeting on 5 Aug 2026. I want information about this company — last 3 years of data, all financial records, current affairs about the company. I want a full brief."'
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1FA9A0] transition-all leading-relaxed"
            />
          </div>

          {/* Timeframe & Calendar Picker Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            
            {/* Delivery Timeframe Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#1FA9A0]" />
                Auto-Delivery Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1FA9A0]"
              >
                <option value="15 minutes before">15 minutes before meeting</option>
                <option value="60 minutes before">60 minutes before meeting</option>
                <option value="24 hours before">24 hours before meeting</option>
                <option value="48 hours before">48 hours before meeting</option>
                <option value="Custom Date / Immediate">Custom Date / Send Immediately</option>
              </select>
            </div>

            {/* Manual Date Picker Button */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#F5A623]" />
                  Meeting / Report Date
                </span>
                <button
                  type="button"
                  onClick={() => setShowCalendarPicker(!showCalendarPicker)}
                  className="text-[11px] text-[#1FA9A0] font-semibold hover:underline"
                >
                  {showCalendarPicker ? 'Auto Date' : 'Pick Custom Date'}
                </button>
              </label>

              {showCalendarPicker ? (
                <input
                  type="date"
                  value={customScheduledDate}
                  onChange={(e) => setCustomScheduledDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:ring-2 focus:ring-[#1FA9A0]"
                />
              ) : (
                <div
                  onClick={() => setShowCalendarPicker(true)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-500 text-xs font-medium cursor-pointer hover:border-[#1FA9A0] flex items-center justify-between"
                >
                  <span>Auto-detect from Calendar</span>
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </div>
          </div>

          {/* Advanced Context Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-semibold text-[#1FA9A0] hover:text-[#188B84] flex items-center gap-1 transition-colors"
            >
              {showAdvanced ? '− Hide deal size & industry options' : '+ Add deal size / industry context (optional)'}
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Industry Focus</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Healthcare SaaS, Fintech"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-[#1FA9A0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Deal Size</label>
                  <input
                    type="text"
                    value={dealSize}
                    onChange={(e) => setDealSize(e.target.value)}
                    placeholder="e.g., $50k-$100k ARR"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-[#1FA9A0]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !companyName.trim()}
            className="w-full py-4 px-6 bg-[#F5A623] hover:bg-[#E09419] active:bg-[#C98212] text-[#0B1F3A] font-extrabold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer mt-2"
          >
            <Sparkles className="w-5 h-5 text-[#0B1F3A] group-hover:rotate-12 transition-transform" />
            <span>Generate Pre-Meeting Briefing</span>
            <ArrowRight className="w-5 h-5 text-[#0B1F3A] group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Demo Presets Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-[#1FA9A0]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Try Sample Pre-Meeting Prompts:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESET_DEMOS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className="text-left p-3 rounded-xl border border-slate-200 hover:border-[#1FA9A0] bg-slate-50 hover:bg-[#1FA9A0]/5 transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-[#0B1F3A] group-hover:text-[#1FA9A0] transition-colors">
                    {preset.companyName}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {preset.stakeholderName}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="inline-block text-[10px] font-semibold bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded">
                    {preset.tag}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
