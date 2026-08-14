import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Loader2,
  Target,
  History,
  Sparkles,
  Building2,
  UserCircle,
  Briefcase,
  ChevronRight,
  CheckCircle2,
  ChevronDown,
  Trash2,
  Bookmark,
  Zap,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { BriefingData, ChatMessage } from '../types';
import { chatWithAssistant } from '../lib/gemini';

interface AIChatViewProps {
  briefings: BriefingData[];
  selectedBriefing: BriefingData | null;
  onSelectBriefing: (briefing: BriefingData | null) => void;
}

const PRESET_QUESTIONS = [
  'What are the top 3 things I should know before meeting the CFO?',
  'Give me 3 tough questions to ask during discovery.',
  'How should I handle price objections for an incumbent contract?',
  'Summarize the company snapshot in 2 bullet points.',
  'Compare our solution against their current legacy stack.',
];

export const AIChatView: React.FC<AIChatViewProps> = ({
  briefings,
  selectedBriefing,
  onSelectBriefing,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: selectedBriefing
        ? `Hello! I'm your SalesScout AI Assistant. I have loaded the briefing for **${selectedBriefing.companyName}** (${selectedBriefing.stakeholderName || 'Lead'}). What strategic questions do you have before your meeting?`
        : `Hello! I'm your SalesScout AI Assistant. Ask me anything about your prospect companies, industry intelligence, or objection re-frames. You can also select a specific briefing below to ask targeted questions!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const apiKey = localStorage.getItem('geminiApiKey');
      if (!apiKey) {
        throw new Error('Missing Gemini API Key! Please click your profile avatar in the top right and open "Account Settings" to add your API key before using the AI chat.');
      }

      const aiReply = await chatWithAssistant(
        apiKey,
        query,
        selectedBriefing,
        briefings.slice(0, 5),
        messages.slice(-6)
      );

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat API error:', err);
      // Dynamic fallback response for offline or error states based on query keywords
      let fallbackText = '';
      const qLower = query.toLowerCase();

      if (qLower.includes('pricing') || qLower.includes('price') || qLower.includes('cost') || qLower.includes('budget')) {
        fallbackText = selectedBriefing
          ? `Regarding pricing for **${selectedBriefing.companyName}**: Frame your proposal around total cost of ownership (TCO) reduction and multi-year contract predictability. Highlight how our ROI pays back within 6 months.`
          : `Handling price objections: Shift the conversation from price tag to risk & value. Ask: "What is the financial impact of staying on your current workflow for another 12 months?"`;
      } else if (qLower.includes('cfo') || qLower.includes('finance') || qLower.includes('executive')) {
        fallbackText = selectedBriefing
          ? `Key CFO Insights for **${selectedBriefing.companyName}**:\n1. Margin expansion & cap-ex predictability.\n2. Risk mitigation & audit readiness.\n3. Highlight 3-year ROI modeling early.`
          : `CFO Engagement Strategy: Keep slides metric-dense. Lead with EBITDA impact, implementation velocity, and risk mitigation.`;
      } else if (qLower.includes('question') || qLower.includes('discovery') || qLower.includes('ask')) {
        fallbackText = selectedBriefing
          ? `Top Discovery Questions for **${selectedBriefing.companyName}** (${selectedBriefing.stakeholderName || 'Lead'}):\n1. "What is your primary roadblock to hitting Q3 milestones?"\n2. "How are your current tools handling recent growth?"\n3. "What happens if this procurement decision is delayed?"`
          : `Top Discovery Questions:\n1. "What single KPI is your executive team tracking most closely this quarter?"\n2. "Where is your team spending the most unnecessary manual effort?"`;
      } else if (qLower.includes('summarize') || qLower.includes('snapshot') || qLower.includes('overview') || qLower.includes('bullet')) {
        fallbackText = selectedBriefing
          ? `**${selectedBriefing.companyName}** Strategic Snapshot:\n- **Industry**: ${selectedBriefing.companySnapshot.industry}\n- **Trigger Event**: ${selectedBriefing.companySnapshot.whyItMattersNow}\n- **Primary Focus**: ${selectedBriefing.stakeholderName || 'Executive'}'s top KPIs.`
          : `Strategic Overview: Research executive pain points, align on ROI metrics, and present clear 3-point action plans.`;
      } else if (qLower.includes('objection') || qLower.includes('pushback') || qLower.includes('risk')) {
        fallbackText = selectedBriefing
          ? `Objection handling for **${selectedBriefing.companyName}**:\n- **Objection**: "${selectedBriefing.objectionRadar[0]?.objection || 'Implementation time'}"\n- **Response Angle**: ${selectedBriefing.objectionRadar[0]?.responseAngle || 'Emphasize fast onboarding and dedicated support.'}`
          : `Objection Strategy: Acknowledge the concern directly, isolate whether it's timing vs budget vs trust, and re-anchor on business impact.`;
      } else {
        fallbackText = selectedBriefing
          ? `Advice regarding "${query}" for **${selectedBriefing.companyName}**: Lead with: "${selectedBriefing.talkingPoints[0]?.opener || 'operational efficiency'}" and align with ${selectedBriefing.stakeholderName || 'the stakeholder'}'s top objectives.`
          : `Advice for "${query}": Anchor on value deliverables, reference 3-year performance benchmarks, and establish compliance readiness early.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: 'Chat cleared. Ask me any strategic sales question!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Gemini-Powered Sales Assistant
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
            AI Sales Intelligence Chat
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Ask strategic questions, practice objection handling, or ask for custom meeting preparation advice.
          </p>
        </div>

        {/* Active Briefing Context Picker */}
        <div className="flex items-center gap-2">
          <select
            value={selectedBriefing?.id || ''}
            onChange={(e) => {
              const b = briefings.find((item) => item.id === e.target.value) || null;
              onSelectBriefing(b);
            }}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0B1F3A] focus:ring-2 focus:ring-[#1FA9A0]"
          >
            <option value="">-- General AI Chat (All Context) --</option>
            {briefings.map((b) => (
              <option key={b.id} value={b.id}>
                Focus: {b.companyName} ({b.stakeholderName || 'Lead'})
              </option>
            ))}
          </select>

          <button
            onClick={handleClearChat}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl border border-slate-300 transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[580px]">
        
        {/* Context Bar */}
        {selectedBriefing && (
          <div className="bg-[#0B1F3A] text-white px-6 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-semibold">
              <Building2 className="w-4 h-4 text-[#1FA9A0]" />
              <span>Active Context: <strong>{selectedBriefing.companyName}</strong> ({selectedBriefing.stakeholderName})</span>
            </div>
            <button
              onClick={() => onSelectBriefing(null)}
              className="text-[#1FA9A0] hover:underline font-bold"
            >
              Clear Focus
            </button>
          </div>
        )}

        {/* Messages Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-xl bg-[#0B1F3A] text-[#1FA9A0] flex items-center justify-center font-bold flex-shrink-0 shadow">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm relative group ${
                  isAI
                    ? 'bg-white text-slate-800 border border-slate-200/80'
                    : 'bg-[#0B1F3A] text-white font-medium'
                }`}>
                  <div className="whitespace-pre-line">{msg.text}</div>

                  <div className={`mt-2 flex items-center justify-between text-[10px] ${
                    isAI ? 'text-slate-400' : 'text-slate-300'
                  }`}>
                    <span>{msg.timestamp}</span>

                    {isAI && (
                      <button
                        onClick={() => handleCopyText(msg.text, msg.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-[#1FA9A0] cursor-pointer flex items-center gap-1"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-xl bg-[#1FA9A0] text-white flex items-center justify-center font-extrabold flex-shrink-0 shadow">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-[#0B1F3A] text-[#1FA9A0] flex items-center justify-center font-bold flex-shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs text-slate-500 font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>SalesScout AI is generating strategic advice...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Preset Prompt Buttons */}
        <div className="px-6 py-2 bg-slate-100/80 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex-shrink-0">Quick Ask:</span>
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 bg-white hover:bg-[#1FA9A0]/10 border border-slate-200 hover:border-[#1FA9A0] text-slate-700 hover:text-[#0B1F3A] rounded-lg text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Query Input Box */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                selectedBriefing
                  ? `Ask a strategic question about ${selectedBriefing.companyName}...`
                  : 'Ask SalesScout AI any pre-meeting question...'
              }
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1FA9A0]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-5 py-3 bg-[#0B1F3A] hover:bg-[#15345d] active:bg-[#071426] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5 text-[#1FA9A0]" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
