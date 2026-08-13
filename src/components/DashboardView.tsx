import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  PlusCircle,
  MessageSquare,
  Video,
  Link2,
  ArrowRight,
  Clock,
  Building2,
  User,
  Users,
  X,
  FileText,
  Bookmark,
  ChevronRight,
  ChevronDown,
  Zap,
  Info,
  Edit3,
  Check
} from 'lucide-react';
import { BriefingData, GoogleCalendarEvent, UserProfile, SearchInput } from '../types';

export interface DataTimeframeConfig {
  option: '3m' | '6m' | '1y' | 'custom';
  customLabel?: string;
  startDate?: string;
  endDate?: string;
}

const TIMEFRAME_OPTIONS: { id: '3m' | '6m' | '1y' | 'custom'; label: string; subtext: string }[] = [
  { id: '3m', label: '3 Months (Default)', subtext: 'Pulls last 90 days of company news, filings & press' },
  { id: '6m', label: '6 Months', subtext: 'Pulls last 6 months of financial trends & market events' },
  { id: '1y', label: '1 Year', subtext: 'Pulls full 1-year performance & leadership news' },
  { id: 'custom', label: 'Custom Range...', subtext: 'User-specified start/end dates or multi-year lookback' },
];

interface DashboardViewProps {
  userProfile: UserProfile | null;
  isDemoMode: boolean;
  briefings: BriefingData[];
  upcomingEvents: GoogleCalendarEvent[];
  crmConnectedCount: number;
  dataTimeframe: DataTimeframeConfig;
  onChangeDataTimeframe: (timeframe: DataTimeframeConfig) => void;
  onSelectTab: (tab: 'dashboard' | 'search' | 'crm' | 'chat' | 'meeting' | 'calendar' | 'team' | 'history') => void;
  onSelectBriefing: (briefing: BriefingData) => void;
  onQuickGenerateMeeting: (input: SearchInput) => void;
  onOpenUpgradeModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  isDemoMode,
  briefings,
  upcomingEvents,
  crmConnectedCount,
  dataTimeframe,
  onChangeDataTimeframe,
  onSelectTab,
  onSelectBriefing,
  onQuickGenerateMeeting,
  onOpenUpgradeModal,
}) => {
  const [showChecklist, setShowChecklist] = useState(true);

  // Timeframe Dropdown State & Ref
  const [isTimeframeDropdownOpen, setIsTimeframeDropdownOpen] = useState(false);
  const timeframeDropdownRef = useRef<HTMLDivElement>(null);

  // Close timeframe dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timeframeDropdownRef.current && !timeframeDropdownRef.current.contains(event.target as Node)) {
        setIsTimeframeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Custom Date Range Modal State
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(dataTimeframe.startDate || '2024-01-01');
  const [customEndDate, setCustomEndDate] = useState(dataTimeframe.endDate || '2026-08-01');
  const [customPresetName, setCustomPresetName] = useState(dataTimeframe.customLabel || '');

  // Setup Checklist Item States
  const isWorkspaceReady = true;
  const isCalendarConnected = userProfile?.googleConnected || isDemoMode;
  const isCRMConnected = crmConnectedCount > 0;
  const isFirstBriefingDone = briefings.length > 0;
  const isTeamInvited = userProfile?.accountType === 'enterprise';

  const checklistCompletedCount = [
    isWorkspaceReady,
    isCalendarConnected,
    isCRMConnected,
    isFirstBriefingDone,
    userProfile?.accountType === 'enterprise' ? isTeamInvited : true,
  ].filter(Boolean).length;

  const totalChecklistItems = userProfile?.accountType === 'enterprise' ? 5 : 4;

  const handleTimeframeSelect = (option: '3m' | '6m' | '1y' | 'custom') => {
    if (option === 'custom') {
      setShowCustomModal(true);
      onChangeDataTimeframe({
        ...dataTimeframe,
        option: 'custom',
      });
    } else {
      let label = '3 Months';
      if (option === '6m') label = '6 Months';
      if (option === '1y') label = '1 Year';

      onChangeDataTimeframe({
        option,
        customLabel: label,
      });
    }
  };

  const handleSaveCustomRange = () => {
    let label = customPresetName;
    if (!label) {
      if (customStartDate && customEndDate) {
        label = `${customStartDate.split('-')[0]}–${customEndDate.split('-')[0]}`;
      } else {
        label = 'Custom Range';
      }
    }

    onChangeDataTimeframe({
      option: 'custom',
      customLabel: label,
      startDate: customStartDate,
      endDate: customEndDate,
    });
    setShowCustomModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-sans">
      
      {/* Top Welcome Header */}
      <div className="bg-[#0B1F3A] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative">
        {/* Isolated background glow container with overflow-hidden so child popovers are NOT clipped */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1FA9A0]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F5A623]/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-[#1FA9A0]/20 text-[#1FA9A0] border border-[#1FA9A0]/30 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                SalesScout AI Workspace
              </span>
              {isDemoMode && (
                <span className="bg-amber-500/20 text-[#F5A623] border border-[#F5A623]/30 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Demo Mode
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {userProfile?.name || 'Sales Scout'}!
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-lg">
              "Walk in informed. Every time." Here is your sales intelligence command center.
            </p>
          </div>

          {/* Timeframe Selection Dropdown */}
          <div className="flex flex-col gap-1.5 md:items-end flex-shrink-0">
            <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#1FA9A0]" />
              <span>AI Data Timeframe</span>
            </span>

            <div className="relative inline-block text-left" ref={timeframeDropdownRef}>
              <div className="flex items-center gap-1 bg-[#071527] border border-slate-700/80 rounded-2xl p-1 shadow-lg backdrop-blur">
                <button
                  type="button"
                  onClick={() => setIsTimeframeDropdownOpen(!isTimeframeDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-white font-extrabold hover:text-[#1FA9A0] transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#1FA9A0]" />
                  <span>
                    {dataTimeframe.option === 'custom' && dataTimeframe.customLabel
                      ? `Custom (${dataTimeframe.customLabel})`
                      : TIMEFRAME_OPTIONS.find((t) => t.id === dataTimeframe.option)?.label || '3 Months (Default)'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isTimeframeDropdownOpen ? 'rotate-180 text-[#1FA9A0]' : ''}`} />
                </button>

                {dataTimeframe.option === 'custom' && (
                  <button
                    type="button"
                    onClick={() => setShowCustomModal(true)}
                    className="px-2.5 py-1 bg-[#1FA9A0]/20 hover:bg-[#1FA9A0]/30 text-[#1FA9A0] border border-[#1FA9A0]/40 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 mr-0.5"
                    title="Configure custom date range"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {/* Timeframe Dropdown Popover */}
              {isTimeframeDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 max-h-[240px] overflow-y-auto bg-[#071527] border border-slate-700 rounded-2xl shadow-2xl p-1.5 z-50 font-sans divide-y divide-slate-800 animate-fade-in">
                  <div className="py-1 space-y-1">
                    {TIMEFRAME_OPTIONS.map((opt) => {
                      const isSelected = dataTimeframe.option === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            handleTimeframeSelect(opt.id);
                            setIsTimeframeDropdownOpen(false);
                          }}
                          className={`w-full p-2.5 rounded-xl text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#1FA9A0]/20 text-white font-bold border border-[#1FA9A0]/40'
                              : 'hover:bg-slate-800/80 text-slate-200 font-medium'
                          }`}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {isSelected ? (
                              <Check className="w-4 h-4 text-[#1FA9A0]" />
                            ) : (
                              <Clock className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-white flex items-center justify-between">
                              <span>{opt.label}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{opt.subtext}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 max-w-xs md:text-right">
              {dataTimeframe.option === '3m' && 'Pulls last 90 days of company news, filings & press'}
              {dataTimeframe.option === '6m' && 'Pulls last 6 months of financial trends & market events'}
              {dataTimeframe.option === '1y' && 'Pulls full 1-year performance & leadership news'}
              {dataTimeframe.option === 'custom' && `Custom range: ${dataTimeframe.customLabel || 'User specified'}`}
            </p>
          </div>
        </div>
      </div>

      {/* Setup Checklist Card */}
      {showChecklist && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md relative">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0B1F3A] text-[#1FA9A0] flex items-center justify-center font-bold text-xs">
                {checklistCompletedCount}/{totalChecklistItems}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#0B1F3A]">Setup Checklist</h3>
                <p className="text-xs text-slate-500">Complete setup to maximize briefing intelligence accuracy</p>
              </div>
            </div>

            <button
              onClick={() => setShowChecklist(false)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              title="Dismiss checklist"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            
            {/* Item 1 */}
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Workspace Created</span>
                <span className="text-[11px] text-slate-500">
                  {userProfile?.accountType === 'enterprise' ? 'Enterprise Mode' : 'Individual Mode'}
                </span>
              </div>
            </div>

            {/* Item 2 */}
            <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
              isCalendarConnected ? 'bg-emerald-50/60 border-emerald-200/80' : 'bg-slate-50 border-slate-200'
            }`}>
              {isCalendarConnected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 justify-between">
                <span className="font-bold text-slate-900 block">Connect Google Calendar</span>
                {!isCalendarConnected ? (
                  <button
                    onClick={() => onSelectTab('calendar')}
                    className="text-[11px] text-[#1FA9A0] font-bold hover:underline"
                  >
                    Connect now →
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500">Calendar synced</span>
                )}
              </div>
            </div>

            {/* Item 3 */}
            <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
              isCRMConnected ? 'bg-emerald-50/60 border-emerald-200/80' : 'bg-slate-50 border-slate-200'
            }`}>
              {isCRMConnected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <span className="font-bold text-slate-900 block">Connect CRM Tools</span>
                {!isCRMConnected ? (
                  <button
                    onClick={() => onSelectTab('crm')}
                    className="text-[11px] text-[#1FA9A0] font-bold hover:underline"
                  >
                    Connect CRM →
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500">{crmConnectedCount} CRMs connected</span>
                )}
              </div>
            </div>

            {/* Item 4 */}
            <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
              isFirstBriefingDone ? 'bg-emerald-50/60 border-emerald-200/80' : 'bg-slate-50 border-slate-200'
            }`}>
              {isFirstBriefingDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold text-slate-900 block">Generate First Briefing</span>
                {!isFirstBriefingDone ? (
                  <button
                    onClick={() => onSelectTab('search')}
                    className="text-[11px] text-[#1FA9A0] font-bold hover:underline"
                  >
                    Run prompt →
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500">{briefings.length} generated</span>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Tile 1: Briefing Generator */}
        <div
          onClick={() => onSelectTab('search')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1FA9A0] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="p-2.5 w-10 h-10 rounded-xl bg-[#1FA9A0]/10 text-[#1FA9A0] group-hover:bg-[#1FA9A0] group-hover:text-white transition-colors mb-3">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[#0B1F3A]">Briefing Generator</h4>
            <p className="text-xs text-slate-500 mt-0.5">Search prospect & decision maker</p>
          </div>
        </div>

        {/* Tile 2: AI Chat */}
        <div
          onClick={() => onSelectTab('chat')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1FA9A0] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="p-2.5 w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors mb-3">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[#0B1F3A]">AI Sales Chat</h4>
            <p className="text-xs text-slate-500 mt-0.5">Ask questions about past briefs</p>
          </div>
        </div>

        {/* Tile 3: Live Meeting Assistant */}
        <div
          onClick={() => onSelectTab('meeting')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1FA9A0] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="p-2.5 w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors mb-3">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[#0B1F3A]">Meeting Assistant</h4>
            <p className="text-xs text-slate-500 mt-0.5">Live suggestions & transcript wrap-up</p>
          </div>
        </div>

        {/* Tile 4: CRM Integrations */}
        <div
          onClick={() => onSelectTab('crm')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1FA9A0] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="p-2.5 w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-3">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[#0B1F3A]">CRM Tools</h4>
            <p className="text-xs text-slate-500 mt-0.5">{crmConnectedCount} Connected</p>
          </div>
        </div>

      </div>

      {/* Main Section: Detected Upcoming Meetings & Recent Briefings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Detected Upcoming Meetings */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1FA9A0]" />
              <h2 className="font-extrabold text-lg text-[#0B1F3A]">Detected Upcoming Meetings</h2>
            </div>
            <button
              onClick={() => onSelectTab('calendar')}
              className="text-xs font-bold text-[#1FA9A0] hover:underline"
            >
              View Full Calendar →
            </button>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">No upcoming sales meetings detected on calendar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.slice(0, 3).map((evt) => {
                const startDate = evt.start.dateTime ? new Date(evt.start.dateTime) : new Date();
                
                return (
                  <div
                    key={evt.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1FA9A0] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-[#0B1F3A] text-white rounded-xl p-2.5 text-center min-w-[60px] flex-shrink-0">
                        <span className="block text-[9px] uppercase font-bold text-[#1FA9A0]">
                          {startDate.toLocaleDateString([], { month: 'short' })}
                        </span>
                        <span className="block text-lg font-extrabold leading-tight">
                          {startDate.getDate()}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-[#0B1F3A]">{evt.summary}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                          <span>Company: <strong className="text-[#1FA9A0]">{evt.companyNameParsed}</strong></span>
                          {evt.stakeholderNameParsed && (
                            <span>• Lead: <strong>{evt.stakeholderNameParsed}</strong></span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onQuickGenerateMeeting({
                        companyName: evt.companyNameParsed || evt.summary,
                        stakeholderName: evt.stakeholderNameParsed,
                        naturalLanguagePrompt: `Meeting scheduled on ${startDate.toLocaleDateString()}: "${evt.summary}". Please generate complete briefing with 3 years financial records, current affairs, and stakeholder priorities.`,
                        timeframe: '60 minutes before',
                      })}
                      className="w-full sm:w-auto px-4 py-2.5 bg-[#F5A623] hover:bg-[#E09419] text-[#0B1F3A] font-extrabold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 flex-shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#0B1F3A]" />
                      <span>Generate Briefing</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Recent Briefings Library */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#F5A623]" />
              <h2 className="font-extrabold text-lg text-[#0B1F3A]">Recent Briefings</h2>
            </div>
            <button
              onClick={() => onSelectTab('history')}
              className="text-xs font-bold text-[#1FA9A0] hover:underline"
            >
              History ({briefings.length}) →
            </button>
          </div>

          {briefings.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
              <p className="text-xs text-slate-500">No briefings generated yet.</p>
              <button
                onClick={() => onSelectTab('search')}
                className="mt-3 px-3.5 py-2 bg-[#0B1F3A] text-white font-bold text-xs rounded-xl"
              >
                Create First Briefing
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {briefings.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  onClick={() => onSelectBriefing(b)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-[#1FA9A0] shadow-sm hover:shadow transition-all cursor-pointer group flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-[#0B1F3A] group-hover:text-[#1FA9A0] transition-colors truncate">
                      {b.companyName}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium truncate">
                      {b.stakeholderName ? `${b.stakeholderName}` : 'Company Brief'} • {new Date(b.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#1FA9A0] transition-colors flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Custom Date Range Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowCustomModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] text-[#1FA9A0] flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0B1F3A]">Custom AI Data Lookback Range</h3>
                <p className="text-xs text-slate-500">Configure historical lookback depth for briefing generation</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* Quick presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Historical Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Last 2 Years', start: '2024-01-01', end: '2026-08-01' },
                    { label: 'Last 3 Years', start: '2023-01-01', end: '2026-08-01' },
                    { label: 'Last 5 Years', start: '2021-01-01', end: '2026-08-01' },
                    { label: '10-Year Full Lookback', start: '2016-01-01', end: '2026-08-01' },
                  ].map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setCustomStartDate(p.start);
                        setCustomEndDate(p.end);
                        setCustomPresetName(p.label);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                        customPresetName === p.label
                          ? 'bg-teal-50 border-[#1FA9A0] text-[#0B1F3A] ring-1 ring-[#1FA9A0]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Date Pickers */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => {
                      setCustomStartDate(e.target.value);
                      setCustomPresetName('');
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#1FA9A0] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => {
                      setCustomEndDate(e.target.value);
                      setCustomPresetName('');
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#1FA9A0] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveCustomRange}
              className="w-full py-3 bg-[#0B1F3A] hover:bg-[#15345d] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#1FA9A0]" />
              <span>Apply Custom Range ({customPresetName || `${customStartDate.split('-')[0]}–${customEndDate.split('-')[0]}`})</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
