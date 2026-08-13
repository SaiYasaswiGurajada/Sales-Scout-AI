export interface SourceCitation {
  sourceName: string; // e.g., "TechCrunch", "Q2 Earnings Call", "SEC 10-K Filing"
  attribution: string; // e.g., "Reported June 2026" or "— Jane Doe, CFO"
  quoteOrTitle: string; // e.g., "Acme Corp expands healthcare network in Q2"
}

export interface SearchInput {
  companyName: string;
  stakeholderName?: string;
  stakeholderTitle?: string;
  dealSize?: string; // Optional context e.g. "$50k-$100k ARR"
  industry?: string;
  naturalLanguagePrompt?: string; // Free-text prompt e.g., "Meeting on 5 Aug 2026. Give me 3 years financial records..."
  timeframe?: string; // Delivery timeframe e.g. "15 minutes before"
  customScheduledDate?: string; // Manually picked report date/time
}

export interface CompanySnapshot {
  industry: string;
  companySize: string;
  hqLocation: string;
  fundingOrRevenue: string;
  recentNews: string[];
  whyItMattersNow: string;
  sources?: SourceCitation[];
}

export interface FinancialYearData {
  year: string;
  revenue: string;
  growthOrMargin?: string;
  keyHighlight?: string;
  growth?: string;
}

export interface FinancialOverview {
  summary: string;
  threeYearTrend?: FinancialYearData[];
  records?: FinancialYearData[];
  keyFinancialHighlights?: string[];
  highlights?: string[];
  sources?: SourceCitation[];
}

export interface CurrentAffairs {
  topHeadlines?: string[];
  recentEvents?: Array<{ title: string; date?: string; impact?: string }>;
  strategicImpact?: string;
  summary?: string;
  sources?: SourceCitation[];
}

export interface StakeholderProfile {
  name: string;
  title: string;
  roleOverview: string;
  topKPIs: string[];
  communicationStyle: string;
  perceivedPainPoints: string[];
  recentPublicActivity: string[];
  sources?: SourceCitation[];
}

export interface TalkingPoint {
  topic: string;
  opener: string;
  strategicContext: string;
  sources?: SourceCitation[];
}

export interface ObjectionItem {
  objection: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  responseAngle: string;
  sources?: SourceCitation[];
}

export interface CompetitiveContext {
  keyCompetitors: string[];
  incumbentAdvantage: string;
  ourDifferentiators: string[];
  trapQuestionsToAsk: string[];
  sources?: SourceCitation[];
}

export interface BriefingData {
  id: string;
  createdAt: string;
  companyName: string;
  stakeholderName?: string;
  stakeholderTitle?: string;
  scheduledDeliveryTime?: string;
  deliveryTimeframe?: string;
  
  companySnapshot: CompanySnapshot;
  financialOverview?: FinancialOverview;
  currentAffairs?: CurrentAffairs;
  stakeholderProfile: StakeholderProfile;
  talkingPoints: TalkingPoint[];
  objectionRadar: ObjectionItem[];
  competitiveContext: CompetitiveContext;
  discoveryQuestions: string[];
  sources?: Array<{ publication: string; title: string; date?: string; snippet?: string; url?: string }>;
  isFavorite?: boolean;
}

export interface RefineInstruction {
  customFocus: string;
}

// User and Auth Types
export type AccountType = 'individual' | 'enterprise';
export type EnterpriseRole = 'team_member' | 'supervisor';

export interface UserProfile {
  name: string;
  email: string;
  picture?: string;
  accountType: AccountType;
  enterpriseRole?: EnterpriseRole;
  googleConnected: boolean;
  defaultTimeframe?: string;
}

// CRM & Tool Connector
export interface CRMConnector {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  connected: boolean;
  lastSynced?: string;
}

// Meeting Platform Connector
export interface MeetingPlatformConnector {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  lastSynced?: string;
}

// AI Chat Message Type
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

// Live Assistant Transcript Item
export interface TranscriptItem {
  id: string;
  speaker: string;
  role: 'rep' | 'prospect' | 'system';
  text: string;
  timestamp: string;
}

// Live Assistant Suggestion
export interface LiveSuggestion {
  id: string;
  triggerPhrase: string;
  category: 'Talking Point' | 'Objection Re-frame' | 'Financial Insight' | 'Competitive Advantage';
  title: string;
  suggestionText: string;
  confidence: number;
  timestamp: string;
}

// Team Activity for Enterprise Mode
export interface TeamMemberActivity {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  currentResearch: string;
  lastBriefingGenerated: {
    companyName: string;
    timestamp: string;
  };
  totalBriefingsCount: number;
}

// Calendar Event Type
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  attendees?: Array<{ email: string; displayName?: string }>;
  companyNameParsed?: string;
  stakeholderNameParsed?: string;
}

// Scheduled Reminder Type
export interface ScheduledReminder {
  id: string;
  briefingId?: string;
  companyName: string;
  stakeholderName?: string;
  sendAt: string;
  deliveryTimeframe: string;
  recipients: string[];
  note?: string;
  status: 'Scheduled' | 'Sent' | 'Failed';
  createdDate: string;
}


