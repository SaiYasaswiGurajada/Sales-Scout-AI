import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  History,
  PlusCircle,
  Calendar,
  Users,
  Zap,
  LayoutDashboard,
  Link2,
  MessageSquare,
  Video,
  User,
  ArrowUpRight,
  ChevronDown,
  Settings,
  Palette,
  LogOut
} from 'lucide-react';
import { UserProfile } from '../types';

export type HeaderTab =
  | 'dashboard'
  | 'search'
  | 'crm'
  | 'chat'
  | 'meeting'
  | 'calendar'
  | 'team'
  | 'history';

export type ProfileOption = 'profile' | 'account_settings' | 'theme' | 'sign_out';

interface HeaderProps {
  currentTab: HeaderTab;
  onSelectTab: (tab: HeaderTab) => void;
  userProfile: UserProfile | null;
  isDemoMode: boolean;
  tokensRemaining: number;
  onOpenUpgradeModal: () => void;
  onOpenProfileOption: (option: ProfileOption) => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  userProfile,
  isDemoMode,
  tokensRemaining,
  onOpenUpgradeModal,
  onOpenProfileOption,
  savedCount,
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header className="sticky top-0 z-30 bg-[#0B1F3A] text-white border-b border-slate-800 shadow-md font-sans">
      
      {/* 1. Primary Top Bar (Always identical on every screen) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand logo & tagline */}
        <div 
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#1FA9A0] to-[#F5A623] p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-[#0B1F3A] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#1FA9A0] group-hover:text-[#F5A623] transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                SalesScout <span className="text-[#1FA9A0]">AI</span>
              </span>
              {isDemoMode && (
                <span className="bg-[#F5A623] text-[#0B1F3A] text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider">
                  Demo Mode
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
              Walk in informed. Every time.
            </p>
          </div>
        </div>

        {/* Top Bar Right: Tokens, Upgrade, Profile Icon */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Token Usage Indicator */}
          <button
            onClick={onOpenUpgradeModal}
            className="flex items-center gap-1.5 bg-[#F5A623]/10 hover:bg-[#F5A623]/20 border border-[#F5A623]/40 text-[#F5A623] px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
            title="Free briefing tokens remaining"
          >
            <Zap className="w-3.5 h-3.5 fill-[#F5A623]" />
            <span>{tokensRemaining} Briefings</span>
          </button>

          {/* Upgrade Button */}
          <button
            onClick={onOpenUpgradeModal}
            className="bg-[#F5A623] hover:bg-[#E09419] text-[#0B1F3A] font-extrabold text-xs px-3 py-1.5 rounded-xl shadow transition-all cursor-pointer hidden sm:flex items-center gap-1"
          >
            <span>Upgrade</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Profile Icon Dropdown */}
          {userProfile && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl border transition-all cursor-pointer text-xs group ${
                  isProfileDropdownOpen
                    ? 'bg-slate-700 border-[#1FA9A0] text-white shadow-sm'
                    : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
                title="Account menu"
              >
                {userProfile.picture ? (
                  <img
                    src={userProfile.picture}
                    alt={userProfile.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#1FA9A0]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#1FA9A0] text-[#0B1F3A] font-extrabold flex items-center justify-center text-xs shadow">
                    {userProfile.name.charAt(0) || 'U'}
                  </div>
                )}
                <span className="font-semibold hidden md:inline max-w-[90px] truncate group-hover:text-white">
                  {userProfile.name.split(' ')[0]}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180 text-[#1FA9A0]' : ''}`} />
              </button>

              {/* Compact Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-1.5 text-slate-800 z-50 animate-fade-in font-sans">
                  {/* User Summary Header */}
                  <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center gap-2.5">
                    {userProfile.picture ? (
                      <img
                        src={userProfile.picture}
                        alt={userProfile.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#1FA9A0]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#0B1F3A] text-[#1FA9A0] font-extrabold flex items-center justify-center text-xs">
                        {userProfile.name.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-[#0B1F3A] truncate">{userProfile.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{userProfile.email}</p>
                    </div>
                  </div>

                  {/* Menu Options (Vertical List) */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        onOpenProfileOption('profile');
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:text-[#0B1F3A] hover:bg-slate-100/80 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#1FA9A0]" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        onOpenProfileOption('account_settings');
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:text-[#0B1F3A] hover:bg-slate-100/80 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-[#1FA9A0]" />
                      <span>Account Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        onOpenProfileOption('theme');
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:text-[#0B1F3A] hover:bg-slate-100/80 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Palette className="w-4 h-4 text-[#1FA9A0]" />
                      <span>Theme</span>
                    </button>
                  </div>

                  {/* Sign Out Divider & Button */}
                  <div className="border-t border-slate-100 pt-1 mt-0.5">
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        onOpenProfileOption('sign_out');
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 2. Secondary Navigation Row (Directly below top bar; Hidden on Dashboard) */}
      {currentTab !== 'dashboard' && (
        <div className="bg-[#071527] border-t border-slate-800/80 px-4 py-1.5">
          <nav className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold">
            
            {/* Dashboard Link */}
            <button
              onClick={() => onSelectTab('dashboard')}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <span className="text-slate-700 select-none">|</span>

            {/* Generator */}
            <button
              onClick={() => onSelectTab('search')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentTab === 'search'
                  ? 'bg-[#1FA9A0] text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#F5A623]" />
              <span>Generator</span>
            </button>

            {/* Connect Tools */}
            <button
              onClick={() => onSelectTab('crm')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentTab === 'crm'
                  ? 'bg-[#1FA9A0] text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Connect Tools</span>
            </button>

            {/* AI Chat */}
            <button
              onClick={() => onSelectTab('chat')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentTab === 'chat'
                  ? 'bg-[#1FA9A0] text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>AI Chat</span>
            </button>

            {/* Meeting Assistant */}
            <button
              onClick={() => onSelectTab('meeting')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentTab === 'meeting'
                  ? 'bg-[#1FA9A0] text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Meeting Assistant</span>
            </button>

            {/* Calendar */}
            <button
              onClick={() => onSelectTab('calendar')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentTab === 'calendar'
                  ? 'bg-[#1FA9A0] text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendar Sync</span>
            </button>

            {/* Enterprise Team Activity */}
            {userProfile?.accountType === 'enterprise' && (
              <button
                onClick={() => onSelectTab('team')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  currentTab === 'team'
                    ? 'bg-[#1FA9A0] text-white shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Team Activity</span>
              </button>
            )}

            {/* History */}
            <button
              onClick={() => onSelectTab('history')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentTab === 'history'
                  ? 'bg-[#1FA9A0] text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
              {savedCount > 0 && (
                <span className="bg-slate-700 text-white text-[10px] px-1.5 rounded-full ml-0.5">
                  {savedCount}
                </span>
              )}
            </button>

          </nav>
        </div>
      )}

    </header>
  );
};


