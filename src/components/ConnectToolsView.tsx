import React, { useState } from 'react';
import {
  Link2,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Building2,
  UserCheck,
  Zap,
  Sparkles,
  Lock,
  X,
  ExternalLink,
  Info
} from 'lucide-react';
import { CRMConnector } from '../types';

interface ConnectToolsViewProps {
  connectors: CRMConnector[];
  onToggleConnect: (connectorId: string) => void;
  onProceedToDashboard: () => void;
}

// Brand-accurate icon renderer for CRM & Sales Tech integrations
const renderConnectorIcon = (iconId: string) => {
  switch (iconId) {
    case 'twitter':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-slate-900">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0A66C2]">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      );
    case 'hubspot':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FF7A59]">
          <path d="M18.12 10.82v-2.3a2.38 2.38 0 1 0-1.8 0v2.3a7.48 7.48 0 0 0-4.04 2.87L8.9 11.41a2.6 2.6 0 1 0-1.57.94l3.36 2.28a7.51 7.51 0 0 0 1.25 7.84 2.38 2.38 0 1 0 3.32-3.41 4.7 4.7 0 0 1-1.3-3.27 4.72 4.72 0 0 1 3.51-4.57 2.38 2.38 0 1 0 .65-1.4z" />
        </svg>
      );
    case 'salesforce':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#00A1E0]">
          <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
      );
    case 'zoho':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#E42527]">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H6v-2h4v2zm0-4H6v-2h4v2zm0-4H6V7h4v2zm8 8h-6v-2h6v2zm0-4h-6v-2h6v2zm0-4h-6V7h6v2z" />
        </svg>
      );
    case 'pipedrive':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#222222]">
          <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 15a5 5 0 1 1 5-5 5.006 5.006 0 0 1-5 5zm-1-8h2v3h-2z" />
        </svg>
      );
    case 'microsoft':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#F25022" d="M1 1h10v10H1z" />
          <path fill="#7FBA00" d="M13 1h10v10H13z" />
          <path fill="#00A4EF" d="M1 13h10v10H1z" />
          <path fill="#FFB900" d="M13 13h10v10H13z" />
        </svg>
      );
    case 'slack':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#E01E5A" d="M6 15a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0-7.5a2.5 2.5 0 0 1 2.5 2.5V15A2.5 2.5 0 0 1 6 17.5 2.5 2.5 0 0 1 3.5 15V10A2.5 2.5 0 0 1 6 7.5z" />
          <path fill="#36C5F0" d="M9 6a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm7.5 0a2.5 2.5 0 0 1-2.5 2.5H9A2.5 2.5 0 0 1 6.5 6 2.5 2.5 0 0 1 9 3.5h5A2.5 2.5 0 0 1 16.5 6z" />
          <path fill="#2EB67D" d="M18 9a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zm0 7.5a2.5 2.5 0 0 1-2.5-2.5V9A2.5 2.5 0 0 1 18 6.5a2.5 2.5 0 0 1 2.5 2.5v5A2.5 2.5 0 0 1 18 16.5z" />
          <path fill="#ECB22E" d="M15 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm-7.5 0a2.5 2.5 0 0 1 2.5-2.5h5a2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 7.5 18z" />
        </svg>
      );
    default:
      return <Link2 className="w-5 h-5 text-slate-700" />;
  }
};

export const INITIAL_CRM_CONNECTORS: CRMConnector[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn Sales Navigator',
    category: 'Social Intelligence',
    icon: 'linkedin',
    description: 'Sync prospect executive career histories, recent posts, and mutual connections.',
    connected: true,
    lastSynced: '10 mins ago',
  },
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    category: 'CRM & Pipeline',
    icon: 'hubspot',
    description: 'Auto-pull deal stages, contact notes, and activity timeline prior to briefing creation.',
    connected: false,
  },
  {
    id: 'salesforce',
    name: 'Salesforce Sales Cloud',
    category: 'Enterprise CRM',
    icon: 'salesforce',
    description: 'Sync opportunity records, custom fields, and account history for enterprise deals.',
    connected: false,
  },
  {
    id: 'twitter',
    name: 'X / Twitter Business',
    category: 'Executive Signals',
    icon: 'twitter',
    description: 'Track real-time stakeholder tweets, public opinions, and corporate announcements.',
    connected: false,
  },
  {
    id: 'zoho',
    name: 'Zoho CRM',
    category: 'CRM',
    icon: 'zoho',
    description: 'Import lead status and historical communication logs into briefing radar.',
    connected: false,
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    category: 'Sales Pipeline',
    icon: 'pipedrive',
    description: 'Map deal progress and key stakeholders to automated meeting reminder triggers.',
    connected: false,
  },
  {
    id: 'microsoft',
    name: 'Microsoft Dynamics 365 & Outlook',
    category: 'Enterprise Workspace',
    icon: 'microsoft',
    description: 'Sync Outlook calendar events, emails, and Dynamics account records.',
    connected: false,
  },
  {
    id: 'slack',
    name: 'Slack Enterprise',
    category: 'Team Messaging',
    icon: 'slack',
    description: 'Post automated pre-meeting briefing summaries directly into sales channels.',
    connected: false,
  }
];

export const ConnectToolsView: React.FC<ConnectToolsViewProps> = ({
  connectors,
  onToggleConnect,
  onProceedToDashboard,
}) => {
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [modalConnector, setModalConnector] = useState<CRMConnector | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');

  const handleStartConnect = (connector: CRMConnector) => {
    if (connector.connected) {
      // Disconnect directly
      onToggleConnect(connector.id);
      return;
    }
    setModalConnector(connector);
    setApiKeyInput('');
    setUsernameInput('alex.rivera@salesscout.ai');
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalConnector) return;

    const targetId = modalConnector.id;
    setConnectingId(targetId);
    setModalConnector(null);

    /* 
      FRONT-END SIMULATION NOTE:
      In production, this triggers an OAuth popup or server-to-server API token handshake with the respective CRM endpoint.
      For MVP presentation, we simulate authentication and initial data synchronization.
    */

    setLoadingStep('Authenticating credentials with secure token exchange...');
    await new Promise((r) => setTimeout(r, 700));

    setLoadingStep('Syncing account history & recent contact activities...');
    await new Promise((r) => setTimeout(r, 700));

    setLoadingStep('Almost there! Finalizing real-time webhook listener...');
    await new Promise((r) => setTimeout(r, 600));

    onToggleConnect(targetId);
    setConnectingId(null);
    setLoadingStep('');
  };

  const connectedCount = connectors.filter((c) => c.connected).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 font-sans">
      
      {/* Header Banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1FA9A0]/10 text-[#1FA9A0] border border-[#1FA9A0]/20 text-xs font-bold uppercase tracking-wider mb-3">
          <Link2 className="w-3.5 h-3.5" />
          Step 2: Connect Your Sales Tech Stack
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight mb-2">
          Connect Your Tools & CRMs
        </h1>
        
        <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
          Link SalesScout AI to your existing CRM and communication platforms so pre-meeting briefs automatically pull deal context and stakeholder history.
        </p>

        {/* Demo Callout */}
        <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs px-4 py-1.5 rounded-full font-medium">
          <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>Interactive CRM simulation for capstone demo — click "Connect" on any platform to test the live sync flow.</span>
        </div>
      </div>

      {/* Progress & Quick Action Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] text-white flex items-center justify-center font-extrabold text-sm shadow">
            {connectedCount}/{connectors.length}
          </div>
          <div>
            <div className="font-bold text-sm text-[#0B1F3A]">
              {connectedCount === 0 ? 'No Tools Connected Yet' : `${connectedCount} CRM Integrations Active`}
            </div>
            <p className="text-xs text-slate-500">
              {connectedCount > 0 ? 'Briefings will automatically incorporate CRM deal history.' : 'Connect at least 1 CRM or skip to dashboard.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onProceedToDashboard}
            className="w-full sm:w-auto px-6 py-3 bg-[#F5A623] hover:bg-[#E09419] text-[#0B1F3A] font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{connectedCount > 0 ? 'Continue to Dashboard' : 'Skip for Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectors.map((c) => {
          const isConnectingThis = connectingId === c.id;

          return (
            <div
              key={c.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between overflow-hidden ${
                c.connected
                  ? 'border-[#1FA9A0] shadow-md bg-gradient-to-b from-[#1FA9A0]/5 to-white'
                  : 'border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header row with Icon, Name, and Connected Badge side by side without overlapping */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-100 border border-slate-200/80 p-2 shadow-sm">
                      {renderConnectorIcon(c.icon || c.id)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-[#0B1F3A] truncate" title={c.name}>
                        {c.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
                        {c.category}
                      </span>
                    </div>
                  </div>

                  {c.connected && (
                    <div className="flex-shrink-0 flex items-center gap-1 bg-[#1FA9A0] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Connected</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {c.description}
                </p>
              </div>

              {/* Status / Connect Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {c.connected ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Synced {c.lastSynced || 'Just now'}
                    </span>
                    <button
                      onClick={() => handleStartConnect(c)}
                      className="text-xs text-red-500 hover:text-red-700 font-bold hover:underline cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartConnect(c)}
                    disabled={connectingId !== null}
                    className="w-full py-2.5 px-4 bg-[#0B1F3A] hover:bg-[#15345d] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isConnectingThis ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#1FA9A0]" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-[#F5A623]" />
                        <span>Connect Integration</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Connection Animation Loading Overlay */}
      {connectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm font-sans animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-[#0B1F3A] text-[#1FA9A0] mx-auto flex items-center justify-center mb-4 shadow-lg">
              <RefreshCw className="w-8 h-8 animate-spin text-[#1FA9A0]" />
            </div>

            <h3 className="text-lg font-extrabold text-[#0B1F3A] mb-2">Connecting CRM Integration</h3>
            <p className="text-xs text-slate-600 font-medium mb-6 animate-pulse leading-relaxed">
              {loadingStep}
            </p>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
              <div className="bg-gradient-to-r from-[#1FA9A0] to-[#F5A623] h-full w-3/4 animate-pulse rounded-full" />
            </div>
            
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              TLS 1.3 Encrypted OAuth Handshake
            </span>
          </div>
        </div>
      )}

      {/* Mock Credential Modal */}
      {modalConnector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setModalConnector(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 p-2 border border-slate-200 flex items-center justify-center font-extrabold text-sm shadow-sm">
                {renderConnectorIcon(modalConnector.icon || modalConnector.id)}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0B1F3A]">
                  Authorize {modalConnector.name}
                </h3>
                <p className="text-xs text-slate-500">SalesScout AI Secure Integration</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
              Grant SalesScout AI read permission to pull account metadata, deal timeline notes, and meeting contacts.
            </p>

            <form onSubmit={handleModalSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Workspace Account Email
                </label>
                <input
                  type="email"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#1FA9A0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  API Key / OAuth Secret <span className="text-slate-400 font-normal">(optional for demo)</span>
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#1FA9A0]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0B1F3A] hover:bg-[#15345d] text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#1FA9A0]" />
                  <span>Authorize & Sync Data</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
