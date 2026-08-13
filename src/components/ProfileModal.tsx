import React, { useState } from 'react';
import { X, User, Mail, Shield, CheckCircle2, Save, LogOut, Link2, Calendar, Video, Clock } from 'lucide-react';
import { UserProfile, CRMConnector } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  onLogout: () => void;
  crmConnectorsCount?: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onLogout,
  crmConnectorsCount = 1,
}) => {
  const [name, setName] = useState(userProfile.name || '');
  const [picture, setPicture] = useState(userProfile.picture || '');
  const [defaultTimeframe, setDefaultTimeframe] = useState<string>(
    userProfile.defaultTimeframe || '60m'
  );
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...userProfile,
      name,
      picture: picture || undefined,
      defaultTimeframe,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          {picture ? (
            <img
              src={picture}
              alt={name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#1FA9A0] shadow"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#0B1F3A] text-[#1FA9A0] font-extrabold flex items-center justify-center text-xl shadow">
              {name.charAt(0) || 'U'}
            </div>
          )}

          <div>
            <h2 className="text-xl font-extrabold text-[#0B1F3A]">{name || 'User Profile'}</h2>
            <p className="text-xs text-slate-500 font-medium">{userProfile.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-[#0B1F3A]">
                <Shield className="w-3 h-3 text-[#1FA9A0]" />
                {userProfile.accountType === 'enterprise' ? 'Enterprise' : 'Individual'} Account
              </span>
              {userProfile.enterpriseRole && (
                <span className="text-[10px] text-slate-400 capitalize font-semibold">
                  ({userProfile.enterpriseRole})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-[#1FA9A0] focus:outline-none"
              />
            </div>
          </div>

          {/* Email (Readonly) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={userProfile.email}
                disabled
                className="w-full pl-10 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Profile Photo URL Placeholder */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Avatar Image URL <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="url"
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#1FA9A0] focus:outline-none"
            />
          </div>

          {/* Default Timeframe Preference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#1FA9A0]" />
              <span>Default Briefing Delivery Timeframe</span>
            </label>
            <select
              value={defaultTimeframe}
              onChange={(e) => setDefaultTimeframe(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#1FA9A0]"
            >
              <option value="15m">15 Minutes Before Meeting</option>
              <option value="60m">60 Minutes Before Meeting</option>
              <option value="24h">24 Hours Before Meeting</option>
              <option value="48h">48 Hours Before Meeting</option>
            </select>
          </div>

          {/* Connected Accounts Summary */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Connected Integrations Summary
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Calendar className="w-4 h-4 mx-auto mb-1 text-[#1FA9A0]" />
                <span className="font-bold text-[11px] block text-[#0B1F3A]">Google Calendar</span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-center gap-0.5 mt-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Synced
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Link2 className="w-4 h-4 mx-auto mb-1 text-[#F5A623]" />
                <span className="font-bold text-[11px] block text-[#0B1F3A]">CRM Stack</span>
                <span className="text-[10px] text-slate-600 font-semibold mt-0.5 block">
                  {crmConnectorsCount} Connected
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Video className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                <span className="font-bold text-[11px] block text-[#0B1F3A]">Video Platforms</span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-center gap-0.5 mt-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Ready
                </span>
              </div>
            </div>
          </div>

          {/* Submit / Save button */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 py-3 bg-[#0B1F3A] hover:bg-[#15345d] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Changes Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#1FA9A0]" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Logout Action */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
          <span className="text-slate-400">SalesScout AI v4.0 Enterprise</span>
          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1.5 hover:underline cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
