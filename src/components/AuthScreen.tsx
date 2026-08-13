import React, { useState } from 'react';
import { Sparkles, Shield, Lock, Users, UserCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { AccountType, EnterpriseRole, UserProfile } from '../types';
import { requestGoogleToken, getDemoGoogleProfile } from '../lib/googleAuth';
import { GOOGLE_CLIENT_ID } from '../config';

interface AuthScreenProps {
  onLoginSuccess: (profile: UserProfile, accessToken?: string, isDemo?: boolean) => void;
  onSkipForNow: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, onSkipForNow }) => {
  const [accountType, setAccountType] = useState<AccountType>('enterprise');
  const [enterpriseRole, setEnterpriseRole] = useState<EnterpriseRole>('supervisor');
  const [email, setEmail] = useState('alex.rivera@salesscout.ai');
  const [password, setPassword] = useState('••••••••');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const { accessToken, userProfile } = await requestGoogleToken();
      onLoginSuccess(
        {
          name: userProfile.name,
          email: userProfile.email,
          picture: userProfile.picture,
          accountType,
          enterpriseRole: accountType === 'enterprise' ? enterpriseRole : undefined,
          googleConnected: true,
        },
        accessToken,
        false
      );
    } catch (err: any) {
      console.error('Google login failed:', err);
      setAuthError(err.message || 'Google authorization was canceled or failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleEmailPasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsAuthenticating(true);

    setTimeout(() => {
      onLoginSuccess(
        {
          name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          email: email.trim(),
          accountType,
          enterpriseRole: accountType === 'enterprise' ? enterpriseRole : undefined,
          googleConnected: false,
        },
        undefined,
        false
      );
      setIsAuthenticating(false);
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    const demo = getDemoGoogleProfile();
    onLoginSuccess(
      {
        name: demo.userProfile.name,
        email: demo.userProfile.email,
        picture: demo.userProfile.picture,
        accountType,
        enterpriseRole: accountType === 'enterprise' ? enterpriseRole : undefined,
        googleConnected: true,
      },
      demo.accessToken,
      true
    );
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Radial Background Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1FA9A0]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#F5A623]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1FA9A0]/20 text-[#1FA9A0] border border-[#1FA9A0]/30 text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Pre-Meeting Sales Intelligence
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            SalesScout <span className="text-[#1FA9A0]">AI</span>
          </h1>
          <p className="text-slate-300 text-sm font-medium tracking-wide">
            "Walk in informed. Every time."
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 text-slate-900 shadow-2xl border border-white/20">
          
          {/* Account Type Selection */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Workspace Mode
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setAccountType('individual')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  accountType === 'individual'
                    ? 'bg-white text-[#0B1F3A] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-[#1FA9A0]" />
                Individual Rep
              </button>
              <button
                type="button"
                onClick={() => setAccountType('enterprise')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  accountType === 'enterprise'
                    ? 'bg-[#0B1F3A] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-[#F5A623]" />
                Enterprise Team
              </button>
            </div>

            {accountType === 'enterprise' && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Your Enterprise Role:
                </span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="enterpriseRole"
                      checked={enterpriseRole === 'supervisor'}
                      onChange={() => setEnterpriseRole('supervisor')}
                      className="text-[#1FA9A0] focus:ring-[#1FA9A0]"
                    />
                    <span>Supervisor / Team Lead</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="enterpriseRole"
                      checked={enterpriseRole === 'team_member'}
                      onChange={() => setEnterpriseRole('team_member')}
                      className="text-[#1FA9A0] focus:ring-[#1FA9A0]"
                    />
                    <span>Team Member</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Error Notice */}
          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs leading-relaxed">
              {authError}
            </div>
          )}

          {/* Primary Action: Continue with Google */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isAuthenticating}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 rounded-xl shadow-md font-bold text-slate-800 text-sm flex items-center justify-center gap-3 transition-all cursor-pointer group hover:border-[#1FA9A0]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.28v3.15C3.25 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.28C.46 8.21 0 10.05 0 12s.46 3.79 1.28 5.42l4-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.58l4 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-snug px-2">
              🔒 Connecting Google enables real <strong>Google Calendar sync</strong> and <strong>Gmail API briefing delivery</strong>.
            </p>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">or email fallback</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailPasswordLogin} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1FA9A0]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1FA9A0]"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 bg-[#0B1F3A] hover:bg-[#15345d] text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>Sign In with Email</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Mode & Skip Options */}
          <div className="mt-5 pt-4 border-t border-slate-200/80 text-center space-y-2">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 px-3 bg-[#F5A623]/10 hover:bg-[#F5A623]/20 border border-[#F5A623]/40 text-[#0B1F3A] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" />
              <span>⚡ Demo Mode (1-Click Sample Login)</span>
            </button>

            <button
              type="button"
              onClick={onSkipForNow}
              className="text-xs text-slate-500 hover:text-[#0B1F3A] font-bold underline transition-colors cursor-pointer py-1 block w-full text-center"
            >
              Skip for now — explore app with sample data →
            </button>
          </div>
        </div>

        {/* Footnote */}
        <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#1FA9A0]" />
          Enterprise-grade SOC2 compliant security • No passwords stored
        </p>
      </div>
    </div>
  );
};
