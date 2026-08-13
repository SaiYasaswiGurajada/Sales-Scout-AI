import React, { useState } from 'react';
import { X, Bell, Clock, Calendar, Mail, CheckCircle, Send } from 'lucide-react';
import { ScheduledReminder, BriefingData } from '../types';
import { MOCK_TEAM_MEMBERS } from './TeamActivityView';

interface RemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefing?: BriefingData;
  userEmail?: string;
  onScheduleReminder: (reminder: ScheduledReminder) => void;
  existingReminders: ScheduledReminder[];
}

export const RemindersModal: React.FC<RemindersModalProps> = ({
  isOpen,
  onClose,
  briefing,
  userEmail = 'user@company.com',
  onScheduleReminder,
  existingReminders,
}) => {
  const [targetDate, setTargetDate] = useState<string>(() => {
    const d = new Date(Date.now() + 24 * 3600 * 1000);
    return d.toISOString().slice(0, 16);
  });
  const [timeframe, setTimeframe] = useState('60 minutes before');
  const [selectedTeammates, setSelectedTeammates] = useState<string[]>([userEmail]);
  const [reminderNote, setReminderNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleToggleTeammate = (email: string) => {
    if (selectedTeammates.includes(email)) {
      if (selectedTeammates.length > 1) {
        setSelectedTeammates(selectedTeammates.filter((e) => e !== email));
      }
    } else {
      setSelectedTeammates([...selectedTeammates, email]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReminder: ScheduledReminder = {
      id: `rem-${Date.now()}`,
      briefingId: briefing?.id,
      companyName: briefing?.companyName || 'Prospect Company',
      stakeholderName: briefing?.stakeholderName,
      sendAt: new Date(targetDate).toISOString(),
      deliveryTimeframe: timeframe,
      recipients: selectedTeammates,
      note: reminderNote.trim() || undefined,
      status: 'Scheduled',
      createdDate: new Date().toISOString(),
    };

    onScheduleReminder(newReminder);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-[#0B1F3A] text-[#1FA9A0]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#0B1F3A]">
              Set Briefing Reminder & Auto-Delivery
            </h2>
            <p className="text-xs text-slate-500">
              Schedule when this pre-meeting intelligence report should be delivered.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="my-8 text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2 animate-bounce" />
            <h3 className="text-base font-bold text-emerald-900">Reminder Scheduled!</h3>
            <p className="text-xs text-emerald-700 mt-1">
              Briefing for <strong>{briefing?.companyName || 'Prospect'}</strong> will automatically be emailed to {selectedTeammates.length} recipients at the target time.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {/* Target Date & Time */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#1FA9A0]" />
                Target Meeting / Delivery Date & Time
              </label>
              <input
                type="datetime-local"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:ring-2 focus:ring-[#1FA9A0]"
              />
            </div>

            {/* Timeframe Relative Offset */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#1FA9A0]" />
                Deliver Briefing Relative To Meeting:
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:ring-2 focus:ring-[#1FA9A0]"
              >
                <option value="15 minutes before">15 minutes before meeting</option>
                <option value="60 minutes before">60 minutes before meeting</option>
                <option value="24 hours before">24 hours before meeting</option>
                <option value="48 hours before">48 hours before meeting</option>
                <option value="At exact scheduled time">At exact scheduled time</option>
              </select>
            </div>

            {/* Recipients Selection */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#1FA9A0]" />
                Email Recipients (Self & Teammates)
              </label>
              
              <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={selectedTeammates.includes(userEmail)}
                    onChange={() => handleToggleTeammate(userEmail)}
                    className="text-[#1FA9A0] focus:ring-[#1FA9A0]"
                  />
                  <span>You ({userEmail})</span>
                </label>

                {MOCK_TEAM_MEMBERS.map((mem) => (
                  <label key={mem.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedTeammates.includes(mem.email)}
                      onChange={() => handleToggleTeammate(mem.email)}
                      className="text-[#1FA9A0] focus:ring-[#1FA9A0]"
                    />
                    <span>{mem.name} ({mem.email})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Optional Note for Team
              </label>
              <textarea
                value={reminderNote}
                onChange={(e) => setReminderNote(e.target.value)}
                placeholder="e.g. Focus on financial record highlights during our QBR intro."
                rows={2}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-[#1FA9A0]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#F5A623] hover:bg-[#E09419] text-[#0B1F3A] font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Confirm Scheduled Briefing Delivery</span>
            </button>
          </form>
        )}

        {/* Existing Reminders */}
        {existingReminders.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Active Scheduled Reminders ({existingReminders.length})</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {existingReminders.map((rem) => (
                <div key={rem.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[#0B1F3A]">{rem.companyName}</div>
                    <div className="text-[10px] text-slate-500">Deliver: {new Date(rem.sendAt).toLocaleString()}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {rem.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
