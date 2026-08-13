import React, { useState } from 'react';
import { X, Settings, Clock, Bell, Link2, Calendar, CheckCircle2, Save, Video, Shield } from 'lucide-react';
import { UserProfile } from '../types';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile | null;
  onUpdateProfile?: (updatedProfile: UserProfile) => void;
  defaultTimeframe?: string;
  onSaveSettings?: (settings: { defaultTimeframe?: any }) => void;
  crmConnectorsCount?: number;
  connectedAccountsCount?: number;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  defaultTimeframe: initialDefaultTimeframe,
  onSaveSettings,
  crmConnectorsCount = 1,
  connectedAccountsCount,
}) => {
  const [defaultTimeframe, setDefaultTimeframe] = useState<string>(
    initialDefaultTimeframe || userProfile?.defaultTimeframe || '3m'
  );
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [calendarSyncAlerts, setCalendarSyncAlerts] = useState(true);
  const [teamDigest, setTeamDigest] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const activeConnectorsCount = connectedAccountsCount ?? crmConnectorsCount;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile && onUpdateProfile) {
      onUpdateProfile({
        ...userProfile,
        defaultTimeframe,
      });
    }
    if (onSaveSettings) {
      onSaveSettings({ defaultTimeframe });
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0B1F3A] text-[#1FA9A0] flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#0B1F3A]">Account Settings</h2>
              <p className="text-xs text-slate-500">Briefing defaults & notification preferences</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Account Tier Badge */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#1FA9A0]" />
              <span className="text-xs font-bold text-[#0B1F3A]">Account Tier</span>
            </div>
            <span className="text-xs font-extrabold bg-[#0B1F3A] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {userProfile?.accountType === 'enterprise' ? 'Enterprise' : 'Individual'}
            </span>
          </div>

          {/* Delivery Timeframe Preference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#1FA9A0]" />
              <span>Default Delivery Timeframe</span>
            </label>
            <p className="text-[11px] text-slate-500 mb-2">When scheduled briefings should be auto-delivered to your inbox</p>
            <select
              value={defaultTimeframe}
              onChange={(e) => setDefaultTimeframe(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#1FA9A0] focus:outline-none"
            >
              <option value="15m">15 Minutes Before Meeting</option>
              <option value="60m">60 Minutes Before Meeting (Recommended)</option>
              <option value="24h">24 Hours Before Meeting</option>
              <option value="48h">48 Hours Before Meeting</option>
            </select>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-[#1FA9A0]" />
              <span>Notification Preferences</span>
            </label>
            
            <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="pr-2">
                <div className="text-xs font-bold text-[#0B1F3A]">Send PDF Briefing Copies to Gmail</div>
                <div className="text-[10px] text-slate-500">Auto-attach PDF briefs when generating</div>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-[#1FA9A0] focus:ring-[#1FA9A0]"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="pr-2">
                <div className="text-xs font-bold text-[#0B1F3A]">Calendar Sync Alerts</div>
                <div className="text-[10px] text-slate-500">Alert when upcoming meetings lack briefings</div>
              </div>
              <input
                type="checkbox"
                checked={calendarSyncAlerts}
                onChange={(e) => setCalendarSyncAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#1FA9A0] focus:ring-[#1FA9A0]"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="pr-2">
                <div className="text-xs font-bold text-[#0B1F3A]">Weekly Team Activity Summary</div>
                <div className="text-[10px] text-slate-500">Receive weekly supervisor research report</div>
              </div>
              <input
                type="checkbox"
                checked={teamDigest}
                onChange={(e) => setTeamDigest(e.target.checked)}
                className="w-4 h-4 rounded text-[#1FA9A0] focus:ring-[#1FA9A0]"
              />
            </label>
          </div>

          {/* Connected Accounts Overview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Integrations Status
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Calendar className="w-4 h-4 mx-auto mb-1 text-[#1FA9A0]" />
                <span className="font-bold text-[11px] block text-[#0B1F3A]">Google Cal</span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-center gap-0.5 mt-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Synced
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Link2 className="w-4 h-4 mx-auto mb-1 text-[#F5A623]" />
                <span className="font-bold text-[11px] block text-[#0B1F3A]">CRM Stack</span>
                <span className="text-[10px] text-slate-600 font-semibold mt-0.5 block">
                  {activeConnectorsCount} Connected
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Video className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                <span className="font-bold text-[11px] block text-[#0B1F3A]">Meeting Bots</span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-center gap-0.5 mt-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Active
                </span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#0B1F3A] hover:bg-[#15345d] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Settings Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#1FA9A0]" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
