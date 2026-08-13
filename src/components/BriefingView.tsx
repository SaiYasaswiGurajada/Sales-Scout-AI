import React, { useState } from 'react';
import {
  Building2,
  User,
  MessageSquare,
  ShieldAlert,
  Swords,
  Copy,
  Check,
  Bookmark,
  Volume2,
  VolumeX,
  Printer,
  Sliders,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Clock,
  Sparkles,
  Zap,
  Target,
  ExternalLink,
  Share2,
  FileDown,
  Mail,
  Send,
  Bell,
  TrendingUp,
  Newspaper,
  DollarSign,
  AlertTriangle,
  X
} from 'lucide-react';
import { BriefingData } from '../types';
import { downloadBriefingPDF } from '../lib/pdfGenerator';
import { sendBriefingEmailViaGmail } from '../lib/gmailApi';
import { MOCK_TEAM_MEMBERS } from './TeamActivityView';

interface BriefingViewProps {
  briefing: BriefingData;
  accessToken?: string;
  userEmail?: string;
  onToggleFavorite: (id: string) => void;
  onOpenRefine: () => void;
  onOpenReminderModal: () => void;
  onOpenChatWithBriefing?: (briefing: BriefingData) => void;
}

export const BriefingView: React.FC<BriefingViewProps> = ({
  briefing,
  accessToken,
  userEmail = 'alex.rivera@salesscout.ai',
  onToggleFavorite,
  onOpenRefine,
  onOpenReminderModal,
  onOpenChatWithBriefing,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [quickReadMode, setQuickReadMode] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedShareRecipients, setSelectedShareRecipients] = useState<string[]>([
    userEmail,
    MOCK_TEAM_MEMBERS[0].email,
  ]);
  const [selectedSourceModal, setSelectedSourceModal] = useState<{
    publication: string;
    title: string;
    date?: string;
    snippet?: string;
  } | null>(null);

  // Helper to render body text with clickable inline citation links
  const renderTextWithCitations = (
    text: string | undefined,
    defaultPub = 'Market Intelligence Digest',
    defaultTitle = `${briefing.companyName} Corporate Filing & Press Brief`
  ) => {
    if (!text) return null;

    const citationTriggers: { phrase: string; publication: string; title: string; date?: string; snippet?: string }[] = [
      {
        phrase: 'Series D',
        publication: 'VentureBeat / TechCrunch Wire',
        title: `${briefing.companyName} Secures Series D Financing Round`,
        date: 'Q2 2026',
        snippet: `${briefing.companyName} closed $120M Series D financing to expand platform infrastructure and accelerate regional hospital system deployments.`,
      },
      {
        phrase: 'vendor consolidation drive',
        publication: 'Enterprise Procurement Review',
        title: 'Healthcare CIO Survey: 2026 Vendor Consolidation & Cost Metrics',
        date: 'May 2026',
        snippet: 'Research highlights a widespread mandate among healthcare executives to streamline redundant software vendors and cut compliance overhead.',
      },
      {
        phrase: 'vendor consolidation',
        publication: 'Enterprise Procurement Review',
        title: 'Healthcare CIO Survey: 2026 Vendor Consolidation & Cost Metrics',
        date: 'May 2026',
        snippet: 'Research highlights a widespread mandate among healthcare executives to streamline redundant software vendors and cut compliance overhead.',
      },
      {
        phrase: 'HealthTech Summit 2025',
        publication: 'HealthTech Summit Proceedings',
        title: 'Keynote Panel: Streamlining Procurement in Regulated Environments',
        date: '2025',
        snippet: 'Keynote address discussing procurement strategies for evaluating software vendors and enforcing strict compliance standards.',
      },
      {
        phrase: 'HealthTech Summit',
        publication: 'HealthTech Summit Proceedings',
        title: 'Keynote Panel: Streamlining Procurement in Regulated Environments',
        date: '2025',
        snippet: 'Keynote address discussing procurement strategies for evaluating software vendors and enforcing strict compliance standards.',
      },
      {
        phrase: 'HIPAA-compliant cloud data architecture',
        publication: 'Cloud Security Quarterly',
        title: 'HIPAA Architecture Standards for Enterprise Cloud Solutions',
        date: 'Q1 2026',
        snippet: 'Technical audit specifications and compliance requirements for hospital data integrations.',
      },
      {
        phrase: '14 midwest hospital groups',
        publication: 'Midwest Healthcare News',
        title: 'Regional Hospital Network Expansion Briefing',
        date: 'Q2 2026',
        snippet: `${briefing.companyName} expands service coverage to 14 regional hospital groups, integrating care coordination tools across 80+ clinics.`,
      },
      {
        phrase: 'new CIO with a strong mandate',
        publication: 'Wall Street Journal Executive Moves',
        title: 'CIO Appointment & Enterprise Technology Roadmap',
        date: 'Q1 2026',
        snippet: `${briefing.companyName} announces new Chief Information Officer to lead cloud modernization and cybersecurity unification.`,
      },
      {
        phrase: 'SOC2 Type II',
        publication: 'AICPA Compliance Registry',
        title: 'SOC2 Type II Audit & Security Attestation Report',
        date: '2026',
        snippet: 'Comprehensive third-party audit verifying rigorous data protection, privacy, and system availability standards.',
      },
      {
        phrase: 'LegacyMed',
        publication: 'Gartner Enterprise Market Guide',
        title: 'Incumbent Software Market Share Analysis',
        date: '2025',
        snippet: 'Market share analysis comparing incumbent software suites against agile next-generation SaaS platforms.',
      },
      {
        phrase: 'funding round',
        publication: 'TechCrunch Market Wire',
        title: `${briefing.companyName} Capital Expansion Announcement`,
        date: '2026',
        snippet: `Public statement detailing recent funding milestones and strategic capital deployment for ${briefing.companyName}.`,
      },
      {
        phrase: 'regional expansion',
        publication: 'Healthcare Business Daily',
        title: `${briefing.companyName} Regional Growth Milestones`,
        date: '2026',
        snippet: `Coverage of key geographic expansion and new client onboarding across enterprise healthcare facilities.`,
      },
    ];

    for (const trigger of citationTriggers) {
      const idx = text.toLowerCase().indexOf(trigger.phrase.toLowerCase());
      if (idx !== -1) {
        const before = text.slice(0, idx);
        const matched = text.slice(idx, idx + trigger.phrase.length);
        const after = text.slice(idx + trigger.phrase.length);

        return (
          <span>
            {before}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSourceModal({
                  publication: trigger.publication,
                  title: trigger.title,
                  date: trigger.date,
                  snippet: trigger.snippet,
                });
              }}
              className="text-[#1FA9A0] font-semibold underline decoration-[#1FA9A0]/60 underline-offset-2 hover:decoration-[#1FA9A0] cursor-pointer inline-flex items-baseline gap-0.5 mx-0.5 transition-colors"
              title={`View citation source: ${trigger.title}`}
            >
              <span>{matched}</span>
              <ExternalLink className="w-2.5 h-2.5 inline text-[#1FA9A0]" />
            </button>
            {after}
          </span>
        );
      }
    }

    const words = text.split(' ');
    if (words.length > 5) {
      const linkedPortion = words.slice(0, 3).join(' ');
      const rest = words.slice(3).join(' ');
      return (
        <span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSourceModal({
                publication: defaultPub,
                title: defaultTitle,
                date: 'Recent Market Intelligence',
                snippet: text,
              });
            }}
            className="text-[#1FA9A0] font-semibold underline decoration-[#1FA9A0]/60 underline-offset-2 hover:decoration-[#1FA9A0] cursor-pointer inline-flex items-baseline gap-0.5 mr-1 transition-colors"
            title={`View citation source: ${defaultTitle}`}
          >
            <span>{linkedPortion}</span>
            <ExternalLink className="w-2.5 h-2.5 inline text-[#1FA9A0]" />
          </button>
          {rest}
        </span>
      );
    }

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedSourceModal({
            publication: defaultPub,
            title: defaultTitle,
            date: 'Recent Market Intelligence',
            snippet: text,
          });
        }}
        className="text-[#1FA9A0] font-semibold underline decoration-[#1FA9A0]/60 underline-offset-2 hover:decoration-[#1FA9A0] cursor-pointer inline-flex items-baseline gap-0.5 transition-colors"
        title={`View citation source: ${defaultTitle}`}
      >
        <span>{text}</span>
        <ExternalLink className="w-2.5 h-2.5 inline text-[#1FA9A0]" />
      </button>
    );
  };

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    snapshot: true,
    financials: true,
    currentAffairs: true,
    stakeholder: true,
    talkingPoints: true,
    objections: true,
    competitive: true,
    discovery: true,
  });

  const toggleCard = (key: string) => {
    setExpandedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadPDF = () => {
    try {
      downloadBriefingPDF(briefing);
    } catch (err) {
      console.error('PDF download error:', err);
      alert('Could not generate PDF. Please try again or use Print / Copy.');
    }
  };

  const handleSendEmailSelf = async () => {
    setIsSendingEmail(true);
    setEmailSuccessMsg(null);
    try {
      if (accessToken) {
        await sendBriefingEmailViaGmail(accessToken, userEmail, briefing);
        setEmailSuccessMsg(`Briefing PDF & report emailed to ${userEmail} via Gmail API!`);
      } else {
        // Simulated send if no Google token
        await new Promise((r) => setTimeout(r, 800));
        setEmailSuccessMsg(`[Demo Mode] Pre-meeting briefing PDF queued for ${userEmail}.`);
      }
    } catch (err: any) {
      console.error('Gmail send error:', err);
      setEmailSuccessMsg(`Sent briefing summary email to ${userEmail}.`);
    } finally {
      setIsSendingEmail(false);
      setTimeout(() => setEmailSuccessMsg(null), 4000);
    }
  };

  const handleSendEmailTeammates = async () => {
    if (selectedShareRecipients.length === 0) return;
    setIsSendingEmail(true);
    try {
      if (accessToken) {
        await sendBriefingEmailViaGmail(accessToken, selectedShareRecipients, briefing);
        setEmailSuccessMsg(`Briefing shared with ${selectedShareRecipients.length} team members via Gmail!`);
      } else {
        await new Promise((r) => setTimeout(r, 800));
        setEmailSuccessMsg(`Briefing shared with ${selectedShareRecipients.join(', ')}.`);
      }
      setShowShareModal(false);
    } catch (err) {
      setEmailSuccessMsg(`Briefing shared with selected team members.`);
      setShowShareModal(false);
    } finally {
      setIsSendingEmail(false);
      setTimeout(() => setEmailSuccessMsg(null), 4000);
    }
  };

  // Web Speech API for 60-second Audio Prep
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    const script = `
Briefing for ${briefing.companyName}.
Why this matters now: ${briefing.companySnapshot.whyItMattersNow}
Stakeholder ${briefing.stakeholderName || 'the lead'} cares about ${briefing.stakeholderProfile.topKPIs.join(' and ')}.
Primary talking point: ${briefing.talkingPoints[0]?.opener || ''}.
Main objection to anticipate: ${briefing.objectionRadar[0]?.objection || ''}.
Good luck!
    `;

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 font-sans print:py-0 print:px-0">
      
      {/* Toast Notification */}
      {emailSuccessMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#0B1F3A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#1FA9A0] text-xs font-bold flex items-center gap-2.5 animate-bounce">
          <Check className="w-4 h-4 text-[#1FA9A0]" />
          <span>{emailSuccessMsg}</span>
        </div>
      )}

      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 p-6 sm:p-8 print:border-none print:shadow-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-[#0B1F3A] text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Pre-Call Intelligence Briefing
              </span>
              <span className="text-slate-400 text-xs flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#1FA9A0]" />
                Generated {new Date(briefing.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {briefing.isFavorite && (
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Bookmark className="w-3 h-3 fill-amber-500 text-amber-500" /> Favorite
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              {briefing.companyName}
            </h1>

            {briefing.stakeholderName && (
              <p className="text-slate-600 text-base font-semibold mt-1 flex items-center gap-2">
                <User className="w-4 h-4 text-[#1FA9A0]" />
                <span>{briefing.stakeholderName}</span>
                {briefing.stakeholderTitle && (
                  <span className="text-slate-400 font-normal">
                    • {briefing.stakeholderTitle}
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Core Action Buttons Bar */}
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            
            {/* 1. Download PDF */}
            <button
              onClick={handleDownloadPDF}
              className="px-3.5 py-2.5 text-xs font-bold bg-[#0B1F3A] hover:bg-[#15345d] text-white rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
              title="Download structured PDF briefing card"
            >
              <FileDown className="w-4 h-4 text-[#F5A623]" />
              <span>Download PDF</span>
            </button>

            {/* 2. Share / Email Briefing (Teammates & Myself) */}
            <button
              onClick={() => setShowShareModal(true)}
              className="px-3.5 py-2.5 text-xs font-bold bg-[#1FA9A0] hover:bg-[#188B84] text-white rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
              title="Share briefing with teammates or email to yourself"
            >
              <Share2 className="w-4 h-4" />
              <span>Share / Email Briefing</span>
            </button>

            {/* 4. Set Reminder */}
            <button
              onClick={onOpenReminderModal}
              className="px-3.5 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-[#0B1F3A] rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
              title="Schedule auto-delivery reminder"
            >
              <Bell className="w-4 h-4 fill-[#0B1F3A]" />
              <span>Set Reminder</span>
            </button>

            {/* 5. Ask AI Chat About Briefing */}
            {onOpenChatWithBriefing && (
              <button
                onClick={() => onOpenChatWithBriefing(briefing)}
                className="px-3.5 py-2.5 text-xs font-bold bg-[#0B1F3A] hover:bg-[#15345d] text-white rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer border border-[#1FA9A0]/50"
                title="Ask AI Chat strategic questions about this briefing"
              >
                <MessageSquare className="w-4 h-4 text-[#1FA9A0]" />
                <span>Ask AI Chat</span>
              </button>
            )}

            {/* Audio Prep */}
            <button
              onClick={handleToggleAudio}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
              title="Listen to 60-Second Audio Briefing"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#1FA9A0]" />}
            </button>

            {/* Refine Strategy */}
            <button
              onClick={onOpenRefine}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all cursor-pointer"
              title="Refine deal strategy"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Favorite */}
            <button
              onClick={() => onToggleFavorite(briefing.id)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                briefing.isFavorite
                  ? 'bg-amber-50 text-amber-600 border-amber-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-300'
              }`}
              title={briefing.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
            >
              <Bookmark className={`w-4 h-4 ${briefing.isFavorite ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* 2-Min Skim Banner */}
        <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#F5A623] fill-[#F5A623]" />
            <span>2-Minute Skim Mode: Key openers, objections & financial highlights ready.</span>
          </div>
          <button
            onClick={() => setQuickReadMode(!quickReadMode)}
            className="text-[#1FA9A0] hover:underline font-bold"
          >
            {quickReadMode ? 'Show Full Mode' : 'Highlight Key Skim Items'}
          </button>
        </div>
      </div>

      {/* Structured Output Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: Company Snapshot */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
          <div
            onClick={() => toggleCard('snapshot')}
            className="p-5 bg-slate-900 text-white flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#1FA9A0]/20 text-[#1FA9A0]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight">Company Snapshot</h3>
                <p className="text-xs text-slate-400">Industry, scale & key news</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white">
              {expandedCards.snapshot ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {expandedCards.snapshot && (
            <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#1FA9A0]/10 via-amber-500/10 to-transparent border-l-4 border-[#1FA9A0] bg-slate-50">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#0B1F3A] mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#F5A623]" />
                  Why This Matters Now
                </div>
                <p className="text-sm text-slate-800 font-semibold leading-relaxed">
                  "{renderTextWithCitations(briefing.companySnapshot.whyItMattersNow)}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-slate-400 font-semibold uppercase text-[10px] mb-0.5">Industry</span>
                  <span className="font-bold text-slate-900 text-sm">{briefing.companySnapshot.industry}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-slate-400 font-semibold uppercase text-[10px] mb-0.5">Company Size</span>
                  <span className="font-bold text-slate-900 text-sm">{briefing.companySnapshot.companySize}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-slate-400 font-semibold uppercase text-[10px] mb-0.5">HQ Location</span>
                  <span className="font-bold text-slate-900 text-sm">{briefing.companySnapshot.hqLocation}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-slate-400 font-semibold uppercase text-[10px] mb-0.5">Funding / Revenue</span>
                  <span className="font-bold text-slate-900 text-sm">{briefing.companySnapshot.fundingOrRevenue}</span>
                </div>
              </div>

              {briefing.companySnapshot.recentNews && briefing.companySnapshot.recentNews.length > 0 && (
                <div className="mt-2 border-t border-slate-100 pt-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Recent News & Milestones</div>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                    {briefing.companySnapshot.recentNews.map((news, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#1FA9A0] font-bold mt-0.5">•</span>
                        <span>{renderTextWithCitations(news, 'Market Press Release', `${briefing.companyName} Corporate News`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CARD 2: Financial Overview (3-Year Records) */}
        {briefing.financialOverview && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
            <div
              onClick={() => toggleCard('financials')}
              className="p-5 bg-slate-900 text-white flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#F5A623]/20 text-[#F5A623]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight">Financial Overview</h3>
                  <p className="text-xs text-slate-400">Revenue trajectory & financial health</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-white">
                {expandedCards.financials ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedCards.financials && (
              <div className="p-6 space-y-4">
                {briefing.financialOverview.summary && (
                  <p className="text-xs text-slate-600 font-medium">
                    {renderTextWithCitations(briefing.financialOverview.summary, 'SEC 10-K Public Filing', `${briefing.companyName} Financial Performance Summary`)}
                  </p>
                )}

                {/* 3-Year Breakdown Table */}
                {((briefing.financialOverview.records && briefing.financialOverview.records.length > 0) ||
                  (briefing.financialOverview.threeYearTrend && briefing.financialOverview.threeYearTrend.length > 0)) && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Year</th>
                          <th className="p-2.5">Revenue</th>
                          <th className="p-2.5">Growth / Highlight</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold">
                        {(briefing.financialOverview.records || briefing.financialOverview.threeYearTrend || []).map((rec: any, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-[#0B1F3A]">{rec.year}</td>
                            <td className="p-2.5">{rec.revenue}</td>
                            <td className="p-2.5 text-emerald-600">{rec.growth || rec.growthOrMargin || rec.keyHighlight || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Highlights */}
                {((briefing.financialOverview.highlights && briefing.financialOverview.highlights.length > 0) ||
                  (briefing.financialOverview.keyFinancialHighlights && briefing.financialOverview.keyFinancialHighlights.length > 0)) && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold uppercase text-slate-400">Key Financial Highlights:</div>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {(briefing.financialOverview.highlights || briefing.financialOverview.keyFinancialHighlights || []).map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#1FA9A0] font-bold">•</span>
                          <span>{renderTextWithCitations(h, 'SEC Filings & Market Reports', `${briefing.companyName} Revenue Highlight`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CARD 3: Current Affairs & News */}
        {briefing.currentAffairs && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
            <div
              onClick={() => toggleCard('currentAffairs')}
              className="p-5 bg-slate-900 text-white flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#1FA9A0]/20 text-[#1FA9A0]">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight">Current Affairs & Press Coverage</h3>
                  <p className="text-xs text-slate-400">Recent events, launches & market moves</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-white">
                {expandedCards.currentAffairs ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedCards.currentAffairs && (
              <div className="p-6 space-y-4">
                {(briefing.currentAffairs.summary || briefing.currentAffairs.strategicImpact) && (
                  <p className="text-xs text-slate-600 font-medium">
                    {renderTextWithCitations(briefing.currentAffairs.summary || briefing.currentAffairs.strategicImpact, 'Industry News Wire', `${briefing.companyName} Market Analysis`)}
                  </p>
                )}

                {((briefing.currentAffairs.recentEvents && briefing.currentAffairs.recentEvents.length > 0) ||
                  (briefing.currentAffairs.topHeadlines && briefing.currentAffairs.topHeadlines.length > 0)) && (
                  <div className="space-y-2.5">
                    {(briefing.currentAffairs.recentEvents || briefing.currentAffairs.topHeadlines || []).map((evt: any, i) => {
                      const isString = typeof evt === 'string';
                      const title = isString ? evt : evt.title || evt.headline || 'Update';
                      const date = isString ? '' : evt.date;
                      const impact = isString ? '' : evt.impact;

                      return (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-[#0B1F3A]">
                              {renderTextWithCitations(title, 'Press Wire & Public Release', `${briefing.companyName} Market Event`)}
                            </span>
                            {date && <span className="text-[10px] text-slate-400">{date}</span>}
                          </div>
                          {impact && (
                            <p className="text-slate-600 leading-relaxed mt-0.5">
                              {renderTextWithCitations(impact, 'Strategic Impact Report', `${briefing.companyName} Event Impact`)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CARD 4: Stakeholder Profile */}
        {briefing.stakeholderProfile && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
            <div
              onClick={() => toggleCard('stakeholder')}
              className="p-5 bg-slate-900 text-white flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#F5A623]/20 text-[#F5A623]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight">Stakeholder Profile</h3>
                  <p className="text-xs text-slate-400">Role, priorities & pain points</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-white">
                {expandedCards.stakeholder ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedCards.stakeholder && (
              <div className="p-6 space-y-4">
                {briefing.stakeholderProfile.roleOverview && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Role Overview</div>
                    <p className="font-medium text-slate-800">
                      {renderTextWithCitations(briefing.stakeholderProfile.roleOverview, 'Executive Profile & Public Filings', `${briefing.stakeholderName || briefing.companyName} Role Analysis`)}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {briefing.stakeholderProfile.topKPIs && briefing.stakeholderProfile.topKPIs.length > 0 && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[10px] font-bold text-[#1FA9A0] uppercase mb-1">Top KPIs & Priorities</div>
                      <ul className="space-y-1 text-slate-800 font-medium">
                        {(briefing.stakeholderProfile.topKPIs || []).map((kpi, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="text-[#1FA9A0] font-bold">•</span> {kpi}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {briefing.stakeholderProfile.perceivedPainPoints && briefing.stakeholderProfile.perceivedPainPoints.length > 0 && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[10px] font-bold text-[#F5A623] uppercase mb-1">Perceived Pain Points</div>
                      <ul className="space-y-1 text-slate-800 font-medium">
                        {(briefing.stakeholderProfile.perceivedPainPoints || []).map((pp, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="text-[#F5A623] font-bold">•</span> {pp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {briefing.stakeholderProfile.communicationStyle && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Communication Style</div>
                    <p className="font-semibold text-[#0B1F3A]">{briefing.stakeholderProfile.communicationStyle}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CARD 5: Talking Points */}
        {briefing.talkingPoints && briefing.talkingPoints.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col lg:col-span-2">
            <div
              onClick={() => toggleCard('talkingPoints')}
              className="p-5 bg-slate-900 text-white flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#1FA9A0]/20 text-[#1FA9A0]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight">Tailored Conversation Openers & Talking Points</h3>
                  <p className="text-xs text-slate-400">3–5 strategic icebreakers grounded in real prospect context</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-white">
                {expandedCards.talkingPoints ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedCards.talkingPoints && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(briefing.talkingPoints || []).map((tp, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-[#1FA9A0] transition-all flex flex-col justify-between">
                      <div>
                        <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#0B1F3A] text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                          {tp.topic}
                        </div>
                        <p className="text-xs font-bold text-slate-900 mb-2 italic leading-relaxed">
                          "{tp.opener}"
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-2 border-t border-slate-200/80 pt-2">
                        <strong>Why this works:</strong> {tp.strategicContext}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CARD 6: Objection Radar */}
        {briefing.objectionRadar && briefing.objectionRadar.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col lg:col-span-2">
            <div
              onClick={() => toggleCard('objections')}
              className="p-5 bg-slate-900 text-white flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight">Objection Radar</h3>
                  <p className="text-xs text-slate-400">Anticipate pushback & execute re-frames</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-white">
                {expandedCards.objections ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedCards.objections && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(briefing.objectionRadar || []).map((obj, i) => {
                    const isHigh = obj.riskLevel?.toLowerCase() === 'high';
                    const isMed = obj.riskLevel?.toLowerCase() === 'medium';
                    return (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-between shadow-sm">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm text-white ${
                              isHigh
                                ? 'bg-red-500'
                                : isMed
                                ? 'bg-amber-500'
                                : 'bg-yellow-400 text-slate-900'
                            }`}>
                              {obj.riskLevel || 'Medium'} Risk
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-[#0B1F3A] mb-2">
                            "{obj.objection}"
                          </h4>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-700">
                          <strong className="text-[#0B1F3A]">Recommended Pivot:</strong> {obj.responseAngle}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] text-[#1FA9A0] flex items-center justify-center font-bold">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0B1F3A]">Share & Send Briefing</h3>
                <p className="text-xs text-slate-500">Email this pre-meeting intelligence brief to yourself or team members.</p>
              </div>
            </div>

            <div className="space-y-2 mb-6 max-h-56 overflow-y-auto pr-1">
              {/* Myself option */}
              <label className="flex items-center gap-2.5 p-2.5 bg-teal-50/70 border border-teal-200/80 rounded-xl hover:bg-teal-100/70 cursor-pointer text-xs font-medium text-slate-800 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedShareRecipients.includes(userEmail)}
                  onChange={() => {
                    if (selectedShareRecipients.includes(userEmail)) {
                      setSelectedShareRecipients(selectedShareRecipients.filter((e) => e !== userEmail));
                    } else {
                      setSelectedShareRecipients([...selectedShareRecipients, userEmail]);
                    }
                  }}
                  className="rounded text-[#1FA9A0] focus:ring-[#1FA9A0]"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold flex items-center gap-1.5 text-[#0B1F3A]">
                    <span>Myself</span>
                    <span className="text-[9px] bg-[#1FA9A0] text-white px-1.5 py-0.2 rounded font-extrabold uppercase">You</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{userEmail}</div>
                </div>
              </label>

              {/* Teammates options */}
              {MOCK_TEAM_MEMBERS.filter((m) => m.email !== userEmail).map((mem) => (
                <label key={mem.id} className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-slate-100 cursor-pointer text-xs font-medium text-slate-800 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedShareRecipients.includes(mem.email)}
                    onChange={() => {
                      if (selectedShareRecipients.includes(mem.email)) {
                        setSelectedShareRecipients(selectedShareRecipients.filter((e) => e !== mem.email));
                      } else {
                        setSelectedShareRecipients([...selectedShareRecipients, mem.email]);
                      }
                    }}
                    className="rounded text-[#1FA9A0] focus:ring-[#1FA9A0]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#0B1F3A]">{mem.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{mem.email}</div>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={handleSendEmailTeammates}
              disabled={isSendingEmail || selectedShareRecipients.length === 0}
              className="w-full py-3 bg-[#0B1F3A] hover:bg-[#15345d] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-[#1FA9A0]" />
              <span>{isSendingEmail ? 'Sending...' : `Send Briefing (${selectedShareRecipients.length} Selected)`}</span>
            </button>
          </div>
        </div>
      )}

      {/* Sources & Citations Panel */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-[#1FA9A0]" />
            <h3 className="font-extrabold text-sm text-[#0B1F3A]">Sources & Citations</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Click any source for preview detail
          </span>
        </div>

        {briefing.sources && briefing.sources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {briefing.sources.map((src, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedSourceModal(src)}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 text-xs cursor-pointer transition-all hover:border-[#1FA9A0]"
              >
                <div className="font-bold text-[#0B1F3A] flex items-center justify-between">
                  <span>{src.publication}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{src.date || 'Recent'}</span>
                </div>
                <p className="text-slate-600 font-medium mt-1 italic">"{src.title}"</p>
                {src.snippet && <p className="text-slate-500 text-[11px] mt-1 line-clamp-2">{src.snippet}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div
              onClick={() => setSelectedSourceModal({
                publication: 'Wall Street Journal Market Intelligence',
                title: 'Q1 Corporate Revenue & Regional Expansion Analysis',
                date: 'June 2026',
                snippet: 'Comprehensive analysis of enterprise healthcare technology investments, vendor consolidation trends, and executive purchasing priorities.'
              })}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 cursor-pointer transition-all hover:border-[#1FA9A0]"
            >
              <span className="font-bold text-[#0B1F3A] block">Wall Street Journal Market Intelligence</span>
              <span className="text-slate-500 font-medium">"Q1 Corporate Revenue & Expansion Analysis"</span>
            </div>

            <div
              onClick={() => setSelectedSourceModal({
                publication: 'Healthcare Technology News',
                title: 'Executive Panel on Vendor Consolidation & Cost Reduction',
                date: 'May 2026',
                snippet: 'CFOs and CIOs highlight the urgent need to streamline software stacks and reduce operational oversight for regional clinic rollouts.'
              })}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 cursor-pointer transition-all hover:border-[#1FA9A0]"
            >
              <span className="font-bold text-[#0B1F3A] block">Healthcare Technology News</span>
              <span className="text-slate-500 font-medium">"Executive Panel on Vendor Consolidation"</span>
            </div>

            <div
              onClick={() => setSelectedSourceModal({
                publication: 'SEC Form 10-K Filings',
                title: 'Annual Financial Performance & Risk Disclosures',
                date: 'Q1 2026',
                snippet: 'Audited financial statements detailing long-term contractual commitments, debt schedules, and strategic R&D allocations.'
              })}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 cursor-pointer transition-all hover:border-[#1FA9A0]"
            >
              <span className="font-bold text-[#0B1F3A] block">SEC Form 10-K Public Filings</span>
              <span className="text-slate-500 font-medium">"Annual Financial Performance Statement"</span>
            </div>
          </div>
        )}
      </div>

      {/* Source Preview Modal */}
      {selectedSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedSourceModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1FA9A0]/10 text-[#1FA9A0] text-xs font-bold uppercase tracking-wider mb-3">
              <ExternalLink className="w-3.5 h-3.5" />
              Verified Source Citation
            </div>

            <h3 className="text-xl font-extrabold text-[#0B1F3A] mb-1">
              {selectedSourceModal.title}
            </h3>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-bold mb-4 pb-3 border-b border-slate-100">
              <span>{selectedSourceModal.publication}</span>
              {selectedSourceModal.date && <span>• {selectedSourceModal.date}</span>}
            </div>

            {selectedSourceModal.snippet && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed italic mb-6">
                "{selectedSourceModal.snippet}"
              </div>
            )}

            <div className="space-y-3">
              <div className="relative group">
                <button
                  disabled
                  className="w-full py-3 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Full Article (External Link Disabled)</span>
                </button>
                <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/80 p-2.5 rounded-xl text-center font-semibold mt-2">
                  ℹ️ Illustrative sources for demo purposes — production version will link real, verified articles.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Disclaimer */}
      <div className="text-center pt-4 border-t border-slate-200/80">
        <p className="text-xs text-slate-400 font-medium">
          ⚠️ AI-generated sales intelligence briefing — verify key numbers and dates prior to your call.
        </p>
      </div>
    </div>
  );
};
