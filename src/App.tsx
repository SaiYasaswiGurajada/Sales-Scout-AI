import React, { useState, useEffect } from 'react';
import { Header, HeaderTab, ProfileOption } from './components/Header';
import { DashboardView, DataTimeframeConfig } from './components/DashboardView';
import { SearchForm } from './components/SearchForm';
import { LoadingSequence } from './components/LoadingSequence';
import { BriefingView } from './components/BriefingView';
import { ConnectToolsView, INITIAL_CRM_CONNECTORS } from './components/ConnectToolsView';
import { AIChatView } from './components/AIChatView';
import { MeetingAssistantView } from './components/MeetingAssistantView';
import { HistorySidebar } from './components/HistorySidebar';
import { RefineModal } from './components/RefineModal';
import { AuthScreen } from './components/AuthScreen';
import { UpgradeModal } from './components/UpgradeModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { ThemeModal, AppThemeMode, AppAccentColor } from './components/ThemeModal';
import { SignOutModal } from './components/SignOutModal';
import { TeamActivityView } from './components/TeamActivityView';
import { CalendarMeetingsView } from './components/CalendarMeetingsView';
import { RemindersModal } from './components/RemindersModal';
import {
  BriefingData,
  SearchInput,
  UserProfile,
  ScheduledReminder,
  CRMConnector,
  GoogleCalendarEvent
} from './types';
import { SAMPLE_BRIEFINGS } from './data/sampleBriefings';
import { AlertCircle } from 'lucide-react';
import { generateBriefing, refineBriefing } from './lib/gemini';

export default function App() {
  // Demo Mode State
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('salesscout_demo_mode') === 'true';
  });

  // User Authentication State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('salesscout_user_profile');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      name: 'Alex Rivera',
      email: 'alex.rivera@salesscout.ai',
      accountType: 'enterprise',
      enterpriseRole: 'supervisor',
      googleConnected: true,
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
  });

  const [accessToken, setAccessToken] = useState<string | undefined>(() => {
    return localStorage.getItem('salesscout_google_token') || undefined;
  });

  // AI Data Lookback Timeframe State (3m, 6m, 1y, custom)
  const [dataTimeframe, setDataTimeframe] = useState<DataTimeframeConfig>(() => {
    try {
      const stored = localStorage.getItem('salesscout_data_timeframe');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { option: '3m', customLabel: '3 Months' };
  });

  // Appearance / Theme State
  const [appTheme, setAppTheme] = useState<AppThemeMode>(() => {
    return (localStorage.getItem('salesscout_theme') as AppThemeMode) || 'light';
  });
  const [appAccent, setAppAccent] = useState<AppAccentColor>(() => {
    return (localStorage.getItem('salesscout_accent') as AppAccentColor) || 'teal';
  });

  // CRM Connectors State
  const [crmConnectors, setCrmConnectors] = useState<CRMConnector[]>(INITIAL_CRM_CONNECTORS);

  // Briefings state
  const [briefings, setBriefings] = useState<BriefingData[]>(() => {
    try {
      const stored = localStorage.getItem('salesscout_briefings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return SAMPLE_BRIEFINGS;
  });

  // Free Tokens Balance
  const [tokensRemaining, setTokensRemaining] = useState<number>(() => {
    const stored = localStorage.getItem('salesscout_tokens');
    return stored !== null ? Number(stored) : 5;
  });

  // Scheduled Reminders
  const [scheduledReminders, setScheduledReminders] = useState<ScheduledReminder[]>(() => {
    try {
      const stored = localStorage.getItem('salesscout_reminders');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  });

  // Navigation & UI States
  const [currentTab, setCurrentTab] = useState<HeaderTab>('dashboard');
  const [activeBriefing, setActiveBriefing] = useState<BriefingData | null>(null);
  const [chatSelectedBriefing, setChatSelectedBriefing] = useState<BriefingData | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [loadingCompany, setLoadingCompany] = useState('');
  const [loadingStakeholder, setLoadingStakeholder] = useState<string | undefined>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [activeProfileModal, setActiveProfileModal] = useState<ProfileOption | null>(null);

  // Sync Data Timeframe & Theme to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('salesscout_data_timeframe', JSON.stringify(dataTimeframe));
    } catch (e) {}
  }, [dataTimeframe]);

  useEffect(() => {
    try {
      localStorage.setItem('salesscout_theme', appTheme);
      localStorage.setItem('salesscout_accent', appAccent);
      const isDark =
        appTheme === 'dark' ||
        (appTheme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  }, [appTheme, appAccent]);

  // Sync localStorage
  useEffect(() => {
    try {
      localStorage.setItem('salesscout_briefings', JSON.stringify(briefings));
    } catch (e) {}
  }, [briefings]);

  useEffect(() => {
    try {
      if (userProfile) {
        localStorage.setItem('salesscout_user_profile', JSON.stringify(userProfile));
      } else {
        localStorage.removeItem('salesscout_user_profile');
      }
    } catch (e) {}
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('salesscout_demo_mode', isDemoMode.toString());
    } catch (e) {}
  }, [isDemoMode]);

  useEffect(() => {
    try {
      localStorage.setItem('salesscout_tokens', tokensRemaining.toString());
    } catch (e) {}
  }, [tokensRemaining]);

  useEffect(() => {
    try {
      localStorage.setItem('salesscout_reminders', JSON.stringify(scheduledReminders));
    } catch (e) {}
  }, [scheduledReminders]);

  const handleLoginSuccess = (profile: UserProfile, token?: string, isDemo?: boolean) => {
    setUserProfile(profile);
    if (isDemo) setIsDemoMode(true);
    if (token) {
      setAccessToken(token);
      localStorage.setItem('salesscout_google_token', token);
    }
    setCurrentTab('dashboard');
  };

  const handleSkipForNow = () => {
    setIsDemoMode(true);
    setUserProfile({
      name: 'Alex Rivera (Guest)',
      email: 'alex.rivera@salesscout.ai',
      accountType: 'enterprise',
      enterpriseRole: 'supervisor',
      googleConnected: true,
    });
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setUserProfile(null);
    setAccessToken(undefined);
    setIsDemoMode(false);
    localStorage.removeItem('salesscout_user_profile');
    localStorage.removeItem('salesscout_google_token');
    localStorage.removeItem('salesscout_demo_mode');
  };

  const handleToggleConnectCRM = (id: string) => {
    setCrmConnectors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, connected: !c.connected } : c))
    );
  };

  // Handle Generating a new briefing
  const handleSearch = async (input: SearchInput) => {
    if (tokensRemaining <= 0) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsLoading(true);
    setLoadingCompany(input.companyName);
    setLoadingStakeholder(input.stakeholderName);
    setErrorMessage(null);
    setActiveBriefing(null);
    setCurrentTab('search');

    try {
      const apiKey = localStorage.getItem('geminiApiKey');
      if (!apiKey) {
        throw new Error('Missing Gemini API Key! Please click your profile avatar in the top right and open "Account Settings" to add your API key before generating briefings.');
      }

      const newBriefing: BriefingData = await generateBriefing(apiKey, { ...input, dataTimeframe });

      setBriefings((prev) => [newBriefing, ...prev]);
      setActiveBriefing(newBriefing);
      setTokensRemaining((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Generation Error:', err);
      setErrorMessage(
        err.message || 'Unable to generate briefing at this moment. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Refining active briefing
  const handleRefine = async (instruction: string) => {
    if (!activeBriefing) return;

    setIsRefining(true);
    setErrorMessage(null);

    try {
      const apiKey = localStorage.getItem('geminiApiKey');
      if (!apiKey) {
        throw new Error('Missing Gemini API Key! Please click your profile avatar in the top right and open "Account Settings" to add your API key before refining briefings.');
      }

      const updatedBriefing: BriefingData = await refineBriefing(apiKey, activeBriefing, instruction);

      setBriefings((prev) =>
        prev.map((b) => (b.id === activeBriefing.id ? updatedBriefing : b))
      );
      setActiveBriefing(updatedBriefing);
      setIsRefineModalOpen(false);
    } catch (err: any) {
      console.error('Refine Error:', err);
      setErrorMessage(err.message || 'Failed to refine briefing.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setBriefings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b))
    );
    if (activeBriefing && activeBriefing.id === id) {
      setActiveBriefing((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const handleDeleteBriefing = (id: string) => {
    setBriefings((prev) => prev.filter((b) => b.id !== id));
    if (activeBriefing && activeBriefing.id === id) {
      setActiveBriefing(null);
    }
  };

  const handleNewSearch = () => {
    setActiveBriefing(null);
    setErrorMessage(null);
    setCurrentTab('search');
  };

  const handleSelectTab = (tab: HeaderTab) => {
    if (tab === 'history') {
      setIsHistoryOpen(true);
    } else {
      setCurrentTab(tab);
      if (tab === 'search') {
        setActiveBriefing(null);
      }
    }
  };

  const handleTopUpTokens = () => {
    setTokensRemaining((prev) => prev + 5);
  };

  const handleScheduleReminder = (reminder: ScheduledReminder) => {
    setScheduledReminders((prev) => [reminder, ...prev]);
  };

  const handleOpenChatWithBriefing = (briefing: BriefingData) => {
    setChatSelectedBriefing(briefing);
    setCurrentTab('chat');
  };

  // Sample Upcoming Events for Dashboard View
  const MOCK_UPCOMING_MEETINGS: GoogleCalendarEvent[] = [
    {
      id: 'm-1',
      summary: 'Acme Health Tech — Q3 Vendor Consolidation Sync',
      companyNameParsed: 'Acme Health Tech',
      stakeholderNameParsed: 'Sarah Chen (CFO)',
      start: { dateTime: new Date(Date.now() + 3600000 * 2).toISOString() },
      end: { dateTime: new Date(Date.now() + 3600000 * 3).toISOString() },
      attendees: [{ email: 'sarah.chen@acmehealth.com', displayName: 'Sarah Chen' }],
    },
    {
      id: 'm-2',
      summary: 'Apex Logistics — Enterprise API Integration Demo',
      companyNameParsed: 'Apex Logistics',
      stakeholderNameParsed: 'Marcus Vance (VP Engineering)',
      start: { dateTime: new Date(Date.now() + 86400000).toISOString() },
      end: { dateTime: new Date(Date.now() + 86400000 + 3600000).toISOString() },
      attendees: [{ email: 'marcus.vance@apexlogistics.io', displayName: 'Marcus Vance' }],
    },
  ];

  // If user is not authenticated, show AuthScreen
  if (!userProfile) {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        onSkipForNow={handleSkipForNow}
      />
    );
  }

  const crmConnectedCount = crmConnectors.filter((c) => c.connected).length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-[#1FA9A0] selection:text-white">
      {/* Header Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        userProfile={userProfile}
        isDemoMode={isDemoMode}
        tokensRemaining={tokensRemaining}
        onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
        onOpenProfileOption={(option) => setActiveProfileModal(option)}
        savedCount={briefings.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block mb-0.5">Briefing Generation Issue</span>
                <p>{errorMessage}</p>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-xs font-semibold text-rose-700 hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Tab View Switcher */}
        {isLoading ? (
          <LoadingSequence companyName={loadingCompany} stakeholderName={loadingStakeholder} />
        ) : currentTab === 'dashboard' ? (
          <DashboardView
            userProfile={userProfile}
            isDemoMode={isDemoMode}
            briefings={briefings}
            upcomingEvents={MOCK_UPCOMING_MEETINGS}
            crmConnectedCount={crmConnectedCount}
            dataTimeframe={dataTimeframe}
            onChangeDataTimeframe={setDataTimeframe}
            onSelectTab={handleSelectTab}
            onSelectBriefing={(b) => {
              setActiveBriefing(b);
              setCurrentTab('search');
            }}
            onQuickGenerateMeeting={handleSearch}
            onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
          />
        ) : currentTab === 'crm' ? (
          <ConnectToolsView
            connectors={crmConnectors}
            onToggleConnect={handleToggleConnectCRM}
            onProceedToDashboard={() => setCurrentTab('dashboard')}
          />
        ) : currentTab === 'chat' ? (
          <AIChatView
            briefings={briefings}
            selectedBriefing={chatSelectedBriefing}
            onSelectBriefing={setChatSelectedBriefing}
          />
        ) : currentTab === 'meeting' ? (
          <MeetingAssistantView />
        ) : currentTab === 'calendar' ? (
          <CalendarMeetingsView
            accessToken={accessToken}
            googleConnected={!!userProfile.googleConnected}
            onGenerateForMeeting={handleSearch}
            onConnectGoogle={() => setUserProfile({ ...userProfile, googleConnected: true })}
          />
        ) : currentTab === 'team' ? (
          <TeamActivityView
            userRole={userProfile.enterpriseRole || 'supervisor'}
            onSelectCompanyForSearch={(comp) => {
              handleSearch({ companyName: comp });
            }}
          />
        ) : activeBriefing ? (
          <BriefingView
            briefing={activeBriefing}
            accessToken={accessToken}
            userEmail={userProfile.email}
            onToggleFavorite={handleToggleFavorite}
            onOpenRefine={() => setIsRefineModalOpen(true)}
            onOpenReminderModal={() => setIsReminderModalOpen(true)}
            onOpenChatWithBriefing={handleOpenChatWithBriefing}
          />
        ) : (
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        )}
      </main>

      {/* History Slide-Over Drawer */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        briefings={briefings}
        activeBriefingId={activeBriefing?.id}
        onSelectBriefing={(briefing) => {
          setActiveBriefing(briefing);
          setCurrentTab('search');
        }}
        onToggleFavorite={handleToggleFavorite}
        onDeleteBriefing={handleDeleteBriefing}
        onStartNewSearch={handleNewSearch}
      />

      {/* Strategy Refine Modal */}
      {activeBriefing && (
        <RefineModal
          isOpen={isRefineModalOpen}
          onClose={() => setIsRefineModalOpen(false)}
          onRefine={handleRefine}
          isLoading={isRefining}
          companyName={activeBriefing.companyName}
        />
      )}

      {/* Upgrade / Pricing Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onTopUpTokens={handleTopUpTokens}
      />

      {/* Scheduled Reminders Modal */}
      <RemindersModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        briefing={activeBriefing || undefined}
        userEmail={userProfile?.email || 'sales.exec@enterprise.com'}
        onScheduleReminder={handleScheduleReminder}
        existingReminders={scheduledReminders}
      />

      {/* Focused Account Modals */}
      <ProfileEditModal
        isOpen={activeProfileModal === 'profile'}
        onClose={() => setActiveProfileModal(null)}
        userProfile={userProfile}
        onSaveProfile={(updated) => setUserProfile(updated)}
      />

      <AccountSettingsModal
        isOpen={activeProfileModal === 'account_settings'}
        onClose={() => setActiveProfileModal(null)}
        userProfile={userProfile}
        defaultTimeframe={dataTimeframe.option}
        onSaveSettings={(settings) => {
          if (settings.defaultTimeframe) {
            let label = '3 Months';
            if (settings.defaultTimeframe === '6m') label = '6 Months';
            if (settings.defaultTimeframe === '1y') label = '1 Year';
            if (settings.defaultTimeframe === 'custom') label = 'Custom Range';
            setDataTimeframe({
              option: settings.defaultTimeframe,
              customLabel: label,
            });
          }
        }}
        connectedAccountsCount={crmConnectedCount}
      />

      <ThemeModal
        isOpen={activeProfileModal === 'theme'}
        onClose={() => setActiveProfileModal(null)}
        currentTheme={appTheme}
        currentAccent={appAccent}
        onSelectTheme={setAppTheme}
        onSelectAccent={setAppAccent}
      />

      <SignOutModal
        isOpen={activeProfileModal === 'sign_out'}
        onClose={() => setActiveProfileModal(null)}
        onConfirmLogout={handleLogout}
        userName={userProfile?.name}
      />
    </div>
  );
}

