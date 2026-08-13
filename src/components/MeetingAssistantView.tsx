import React, { useState, useEffect } from 'react';
import {
  Video,
  Play,
  Square,
  Sparkles,
  Zap,
  CheckCircle2,
  RefreshCw,
  MessageSquare,
  FileText,
  AlertTriangle,
  Send,
  HelpCircle,
  Users,
  Building2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { MeetingPlatformConnector, TranscriptItem, LiveSuggestion } from '../types';

interface MeetingAssistantViewProps {
  onGenerateMeetingSummary?: (transcriptText: string) => void;
}

export const INITIAL_MEETING_CONNECTORS: MeetingPlatformConnector[] = [
  {
    id: 'zoom',
    name: 'Zoom Meetings',
    icon: 'zoom',
    connected: true,
    lastSynced: '15 mins ago',
  },
  {
    id: 'google-meet',
    name: 'Google Meet',
    icon: 'meet',
    connected: true,
    lastSynced: 'Just now',
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    icon: 'teams',
    connected: false,
  },
];

/* Scripted Conversation Loop for Capstone Demo Presentation */
const SCRIPTED_TRANSCRIPT: TranscriptItem[] = [
  {
    id: 't-1',
    speaker: 'Alex Rivera (You)',
    role: 'rep',
    text: "Thanks for taking the time today, Sarah. I saw Acme Health Tech recently announced the regional expansion across 14 hospital groups.",
    timestamp: '00:02',
  },
  {
    id: 't-2',
    speaker: 'Sarah Chen (CFO / Acme)',
    role: 'prospect',
    text: "Thanks Alex. Yes, it's an exciting quarter for us, but honestly our procurement team is drowning in vendor maintenance overhead right now.",
    timestamp: '00:08',
  },
  {
    id: 't-3',
    speaker: 'Alex Rivera (You)',
    role: 'rep',
    text: "I completely understand. In your HealthTech summit panel, you mentioned vendor consolidation was a top priority for 2026.",
    timestamp: '00:15',
  },
  {
    id: 't-4',
    speaker: 'Sarah Chen (CFO / Acme)',
    role: 'prospect',
    text: "Exactly. But we have LegacyMed locked into a 3-year contract, and our CIO insists on strict HIPAA compliance auditing before any new software onboarding.",
    timestamp: '00:24',
  },
  {
    id: 't-5',
    speaker: 'Sarah Chen (CFO / Acme)',
    role: 'prospect',
    text: "Also, frankly, our budget for Q3 is locked. If we can't show a clear 3-month ROI or deferred terms, it's going to be tough.",
    timestamp: '00:32',
  }
];

const SCRIPTED_SUGGESTIONS: LiveSuggestion[] = [
  {
    id: 's-1',
    triggerPhrase: 'vendor maintenance overhead',
    category: 'Talking Point',
    title: 'Consolidation & Overhead Reduction',
    suggestionText: 'Pivot to how SalesScout AI eliminates point-solution bloat and cuts vendor review overhead by 40%.',
    confidence: 96,
    timestamp: '00:09',
  },
  {
    id: 's-2',
    triggerPhrase: 'LegacyMed locked into 3-year contract',
    category: 'Objection Re-frame',
    title: 'Incumbent Contract Bypass',
    suggestionText: 'Offer a low-friction pilot for new regional expansion clinics without replacing LegacyMed immediately.',
    confidence: 94,
    timestamp: '00:25',
  },
  {
    id: 's-3',
    triggerPhrase: 'budget for Q3 is locked',
    category: 'Financial Insight',
    title: 'Flexible Q4 Deferred Terms',
    suggestionText: 'Offer deferred billing starting Q4 or a 14-day zero-risk trial to fit current fiscal timeline.',
    confidence: 98,
    timestamp: '00:33',
  }
];

export const MeetingAssistantView: React.FC<MeetingAssistantViewProps> = () => {
  const [connectors, setConnectors] = useState<MeetingPlatformConnector[]>(INITIAL_MEETING_CONNECTORS);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [visibleTranscriptIndex, setVisibleTranscriptIndex] = useState(0);
  const [visibleSuggestions, setVisibleSuggestions] = useState<LiveSuggestion[]>([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryReport, setSummaryReport] = useState<string | null>(null);

  /* 
    FRONT-END SIMULATION NOTE:
    Scripted live meeting assistant simulation.
    In production, this hooks into the Zoom/Meet Real-time Audio Stream WebSockets.
  */

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLiveActive) {
      if (visibleTranscriptIndex < SCRIPTED_TRANSCRIPT.length) {
        timer = setTimeout(() => {
          setVisibleTranscriptIndex((prev) => prev + 1);

          // Check if suggestion matches
          if (visibleTranscriptIndex < SCRIPTED_SUGGESTIONS.length) {
            setVisibleSuggestions((prev) => [
              SCRIPTED_SUGGESTIONS[visibleTranscriptIndex],
              ...prev,
            ]);
          }
        }, 2200);
      }
    }
    return () => clearTimeout(timer);
  }, [isLiveActive, visibleTranscriptIndex]);

  const handleStartLive = () => {
    setIsLiveActive(true);
    setVisibleTranscriptIndex(1);
    setVisibleSuggestions([SCRIPTED_SUGGESTIONS[0]]);
    setSummaryReport(null);
  };

  const handleStopLive = () => {
    setIsLiveActive(false);
  };

  const handleToggleConnect = (id: string) => {
    setConnectors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, connected: !c.connected } : c))
    );
  };

  const handleGenerateWrapupSummary = async () => {
    setIsGeneratingSummary(true);
    const fullTranscriptText = SCRIPTED_TRANSCRIPT.map((t) => `${t.speaker}: ${t.text}`).join('\n');

    try {
      const res = await fetch('/api/meeting-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: 'Acme Health Tech',
          meetingTitle: 'Executive Call with Sarah Chen (CFO)',
          transcript: fullTranscriptText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSummaryReport(data.summary);
      } else {
        throw new Error('Summary failed');
      }
    } catch (err) {
      // Fallback structured summary
      setSummaryReport(`
📌 **Post-Meeting Executive Summary — Acme Health Tech**
• **Key Pain Point:** Procurement team overwhelmed by vendor maintenance overhead during regional expansion.
• **Main Objection:** Incumbent (LegacyMed) locked in 3-year contract & Q3 budget locked.
• **Agreed Action Items:**
  1. Send SOC2 / HIPAA fast-track compliance package by Friday.
  2. Draft proposal for low-risk expansion clinic pilot with Q4 deferred billing terms.
  3. Schedule follow-up demo with CIO & Procurement committee.
      `);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 border border-purple-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Video className="w-3.5 h-3.5 text-purple-600" />
            Real-Time AI Meeting Assistant
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
            AI Live Assistant & Wrap-Up
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
            Connect Zoom, Google Meet, or Microsoft Teams to receive real-time objection re-frames during your call and auto-generate executive post-meeting summaries.
          </p>
        </div>

        {/* Start / Stop Assistant Button */}
        <div className="flex items-center gap-3">
          {isLiveActive ? (
            <button
              onClick={handleStopLive}
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center gap-2 animate-pulse"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>End Live Call Session</span>
            </button>
          ) : (
            <button
              onClick={handleStartLive}
              className="px-5 py-3 bg-[#0B1F3A] hover:bg-[#15345d] text-white font-extrabold text-xs rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-[#1FA9A0] fill-[#1FA9A0]" />
              <span>Start Live Demo Meeting</span>
            </button>
          )}
        </div>
      </div>

      {/* Connected Meeting Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {connectors.map((conn) => (
          <div
            key={conn.id}
            className={`p-4 rounded-2xl border bg-white flex items-center justify-between transition-all ${
              conn.connected ? 'border-[#1FA9A0] shadow-sm' : 'border-slate-200 opacity-75'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#0B1F3A]">{conn.name}</h4>
                <span className="text-[10px] text-slate-400">
                  {conn.connected ? 'Ready for live stream' : 'Not connected'}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleToggleConnect(conn.id)}
              className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                conn.connected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              {conn.connected ? 'Connected' : 'Connect'}
            </button>
          </div>
        ))}
      </div>

      {/* Live Meeting Interface (Active or Idle) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        
        {/* Left Panel (7 cols): Real-Time Live Transcript Feed */}
        <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isLiveActive ? 'bg-red-500 animate-ping' : 'bg-slate-300'}`} />
                <h3 className="font-extrabold text-sm text-[#0B1F3A]">
                  {isLiveActive ? 'Live Audio Stream & Transcript' : 'Meeting Transcript Simulator'}
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">
                Acme Health Tech — Sarah Chen (CFO)
              </span>
            </div>

            {/* Transcript Stream */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {!isLiveActive && visibleTranscriptIndex === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <Video className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>Click <strong>"Start Live Demo Meeting"</strong> above to launch the real-time meeting assistant simulation.</p>
                </div>
              ) : (
                SCRIPTED_TRANSCRIPT.slice(0, visibleTranscriptIndex).map((t) => (
                  <div key={t.id} className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-xs leading-relaxed space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`font-bold uppercase tracking-wider ${
                        t.role === 'rep' ? 'text-[#1FA9A0]' : 'text-amber-600'
                      }`}>
                        {t.speaker}
                      </span>
                      <span className="text-slate-400">{t.timestamp}</span>
                    </div>
                    <p className="text-slate-800 font-medium">"{t.text}"</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Wrap-up CTA */}
          {visibleTranscriptIndex >= 3 && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <button
                onClick={handleGenerateWrapupSummary}
                disabled={isGeneratingSummary}
                className="w-full py-3 bg-[#0B1F3A] hover:bg-[#15345d] text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingSummary ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#1FA9A0]" />
                    <span>Generating Gemini Post-Meeting Wrap-Up...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 text-[#F5A623]" />
                    <span>Generate Executive Post-Meeting Summary</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Panel (5 cols): AI Live Suggestions Radar */}
        <div className="lg:col-span-5 p-6 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-[#F5A623]" />
              <h3 className="font-extrabold text-sm text-[#0B1F3A]">
                AI Live Suggestions Radar
              </h3>
            </div>

            {visibleSuggestions.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                <Zap className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#F5A623]" />
                <p>AI suggestions will automatically pop up here as key keywords and objections are mentioned in the meeting audio stream.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {visibleSuggestions.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 bg-gradient-to-r from-[#1FA9A0]/10 to-amber-500/10 rounded-2xl border border-[#1FA9A0]/30 shadow-sm text-xs space-y-1.5 animate-fade-in"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#0B1F3A] text-white">
                        {s.category}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {s.confidence}% AI Match
                      </span>
                    </div>

                    <h4 className="font-bold text-[#0B1F3A]">{s.title}</h4>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {s.suggestionText}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 text-[10px] text-slate-400 text-center font-medium">
            🔒 Privacy Mode: Audio processed in real-time streaming buffers — no permanent raw voice recording stored.
          </div>
        </div>

      </div>

      {/* Post-Meeting Summary Report Card */}
      {summaryReport && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#1FA9A0] shadow-2xl space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-extrabold text-[#0B1F3A]">
              Post-Meeting Executive Wrap-Up Report
            </h2>
          </div>

          <div className="prose text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-200">
            {summaryReport}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(summaryReport);
                alert('Copied wrap-up summary to clipboard!');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0B1F3A] font-bold text-xs rounded-xl border border-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Copy Full Report</span>
            </button>

            <button
              onClick={() => alert('Summary sent to your email & logged in CRM.')}
              className="px-4 py-2 bg-[#0B1F3A] hover:bg-[#15345d] text-white font-bold text-xs rounded-xl shadow cursor-pointer"
            >
              Email Summary & Log to CRM
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
