import React, { useState } from 'react';
import { Users, Search, Clock, FileText, CheckCircle2, Award, ArrowUpRight, UserPlus, Trash2, X, AlertTriangle } from 'lucide-react';
import { TeamMemberActivity, EnterpriseRole } from '../types';

interface TeamActivityViewProps {
  userRole?: EnterpriseRole;
  onSelectCompanyForSearch?: (companyName: string) => void;
}

export const MOCK_TEAM_MEMBERS: TeamMemberActivity[] = [
  {
    id: 'team-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@salesscout.ai',
    role: 'Senior Account Executive',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    currentResearch: 'Stripe Global (Fintech Infrastructure)',
    lastBriefingGenerated: {
      companyName: 'Stripe Global',
      timestamp: '12 mins ago',
    },
    totalBriefingsCount: 14,
  },
  {
    id: 'team-2',
    name: 'Sarah Connor',
    email: 'sarah.c@salesscout.ai',
    role: 'Enterprise AE — Healthcare & SaaS',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    currentResearch: 'Acme Health Tech (Procurement)',
    lastBriefingGenerated: {
      companyName: 'Acme Health Tech',
      timestamp: '1 hour ago',
    },
    totalBriefingsCount: 22,
  },
  {
    id: 'team-3',
    name: 'Marcus Brody',
    email: 'marcus.b@salesscout.ai',
    role: 'Strategic SDR Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    currentResearch: 'Datadog Systems (DevOps Observability)',
    lastBriefingGenerated: {
      companyName: 'Datadog Systems',
      timestamp: '3 hours ago',
    },
    totalBriefingsCount: 9,
  },
  {
    id: 'team-4',
    name: 'Elena Rostova',
    email: 'elena.r@salesscout.ai',
    role: 'Key Account Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    currentResearch: 'Snowflake Data (Data Cloud)',
    lastBriefingGenerated: {
      companyName: 'Snowflake Data',
      timestamp: 'Yesterday',
    },
    totalBriefingsCount: 18,
  },
];

export const TeamActivityView: React.FC<TeamActivityViewProps> = ({
  userRole = 'supervisor',
  onSelectCompanyForSearch,
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMemberActivity[]>(MOCK_TEAM_MEMBERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Senior Account Executive');

  const [memberToRemove, setMemberToRemove] = useState<TeamMemberActivity | null>(null);

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newMember: TeamMemberActivity = {
      id: `team-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      avatarUrl: `https://images.unsplash.com/photo-${1535713875002 + teamMembers.length}?w=150&auto=format&fit=crop&q=80`,
      currentResearch: 'New Account Discovery & Outreach',
      lastBriefingGenerated: {
        companyName: 'Prospective Lead Co.',
        timestamp: 'Just now',
      },
      totalBriefingsCount: 1,
    };

    setTeamMembers((prev) => [newMember, ...prev]);
    setNewName('');
    setNewEmail('');
    setNewRole('Senior Account Executive');
    setIsAddModalOpen(false);
  };

  const handleConfirmRemove = () => {
    if (!memberToRemove) return;
    setTeamMembers((prev) => prev.filter((m) => m.id !== memberToRemove.id));
    setMemberToRemove(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#0B1F3A] text-white">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1FA9A0]">
              Enterprise Workspace Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0B1F3A]">
            Team Activity & Pre-Meeting Coverage
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Real-time supervisor oversight into active prospect research, stakeholder briefings, and sales call readiness across your team.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <Award className="w-4 h-4 text-[#F5A623]" />
          <span>63 Briefings Generated This Month</span>
        </div>
      </div>

      {/* Supervisor Metrics Overview */}
      {userRole === 'supervisor' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex justify-between items-center">
              <span>Active Reps Researching</span>
              <Users className="w-4 h-4 text-[#1FA9A0]" />
            </div>
            <div className="text-3xl font-extrabold text-[#0B1F3A]">{teamMembers.length} / {teamMembers.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              100% pre-meeting preparation rate
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex justify-between items-center">
              <span>Top Account Targeted</span>
              <FileText className="w-4 h-4 text-[#F5A623]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B1F3A] truncate">Stripe Global</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              3 briefings generated by Alex Rivera
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex justify-between items-center">
              <span>Avg Prep Time Saved</span>
              <Clock className="w-4 h-4 text-[#0B1F3A]" />
            </div>
            <div className="text-3xl font-extrabold text-[#0B1F3A]">42 min <span className="text-xs font-normal text-slate-500">/ meeting</span></div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              ~28 hours saved across team this week
            </div>
          </div>
        </div>
      )}

      {/* Team Members List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-[#0B1F3A]">
              Team Members & Research Status
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {teamMembers.length} Active
            </span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#0B1F3A] hover:bg-[#15345d] text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4 text-[#1FA9A0]" />
            <span>Add Team Member</span>
          </button>
        </div>

        {/* Table Column Headers */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider items-center">
          <div className="col-span-4">Team Member & Role</div>
          <div className="col-span-4">Current Research Focus</div>
          <div className="col-span-3">Last Briefing Generated</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="divide-y divide-slate-100">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center"
            >
              {/* Col 1: Avatar & Member Info */}
              <div className="md:col-span-4 flex items-center gap-3 min-w-0">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                  onError={(e) => {
                    // Fallback avatar
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <h3 className="font-bold text-sm text-[#0B1F3A] truncate">{member.name}</h3>
                  </div>
                  <div className="text-xs text-slate-500 truncate flex items-center gap-1.5">
                    <span className="font-medium text-slate-600 truncate">{member.role}</span>
                    <span>•</span>
                    <span className="truncate">{member.email}</span>
                  </div>
                </div>
              </div>

              {/* Col 2: Research Focus */}
              <div className="md:col-span-4 min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 md:hidden">
                  Current Research Focus:
                </div>
                <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 min-w-0">
                  <Search className="w-3.5 h-3.5 text-[#1FA9A0] flex-shrink-0" />
                  <span className="truncate" title={member.currentResearch}>{member.currentResearch}</span>
                </div>
              </div>

              {/* Col 3: Last Briefing */}
              <div className="md:col-span-3 min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 md:hidden">
                  Last Briefing:
                </div>
                <div className="text-xs font-bold text-[#0B1F3A] truncate" title={member.lastBriefingGenerated.companyName}>
                  {member.lastBriefingGenerated.companyName}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {member.lastBriefingGenerated.timestamp}
                </div>
              </div>

              {/* Col 4: Action Buttons (View + Remove icon only) */}
              <div className="md:col-span-1 flex items-center justify-end gap-1 flex-shrink-0">
                {onSelectCompanyForSearch && (
                  <button
                    onClick={() => onSelectCompanyForSearch(member.lastBriefingGenerated.companyName)}
                    className="p-2 text-[#1FA9A0] hover:bg-[#1FA9A0]/10 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                    title={`View briefing for ${member.lastBriefingGenerated.companyName}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => setMemberToRemove(member)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                  title={`Remove ${member.name} from team`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {teamMembers.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              No team members in list. Click <strong>Add Team Member</strong> above to invite reps.
            </div>
          )}
        </div>
      </div>

      {/* Add Team Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] text-[#1FA9A0] flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0B1F3A]">Add New Team Member</h3>
                <p className="text-xs text-slate-500">Invite a rep or manager to your team workspace</p>
              </div>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#1FA9A0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. jordan.h@salesscout.ai"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#1FA9A0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Role Title
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0B1F3A] focus:ring-2 focus:ring-[#1FA9A0]"
                >
                  <option value="Senior Account Executive">Senior Account Executive</option>
                  <option value="Enterprise AE — SaaS & Tech">Enterprise AE — SaaS & Tech</option>
                  <option value="Strategic SDR Lead">Strategic SDR Lead</option>
                  <option value="Key Account Manager">Key Account Manager</option>
                  <option value="Sales Director / Team Lead">Sales Director / Team Lead</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0B1F3A] hover:bg-[#15345d] text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4 text-[#1FA9A0]" />
                  <span>Add Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove Confirmation Dialog */}
      {memberToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center relative">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-extrabold text-[#0B1F3A] mb-1">
              Remove Team Member?
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Are you sure you want to remove <strong>{memberToRemove.name}</strong> ({memberToRemove.email}) from your team workspace?
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setMemberToRemove(null)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-400 mt-6">
        * Multi-user enterprise team backend state simulated for MVP presentation.
      </p>
    </div>
  );
};
