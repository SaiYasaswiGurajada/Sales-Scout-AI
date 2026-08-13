import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Sparkles, Clock, Users, ArrowRight, CheckCircle, ExternalLink } from 'lucide-react';
import { GoogleCalendarEvent, SearchInput } from '../types';
import { fetchGoogleCalendarEvents, MOCK_CALENDAR_EVENTS } from '../lib/googleCalendarApi';

interface CalendarMeetingsViewProps {
  accessToken?: string;
  googleConnected: boolean;
  onGenerateForMeeting: (input: SearchInput) => void;
  onConnectGoogle: () => void;
}

export const CalendarMeetingsView: React.FC<CalendarMeetingsViewProps> = ({
  accessToken,
  googleConnected,
  onGenerateForMeeting,
  onConnectGoogle,
}) => {
  const [events, setEvents] = useState<GoogleCalendarEvent[]>(MOCK_CALENDAR_EVENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>('Just now');

  const loadCalendar = async () => {
    setIsLoading(true);
    if (accessToken && googleConnected) {
      const realEvents = await fetchGoogleCalendarEvents(accessToken);
      setEvents(realEvents);
    } else {
      setEvents(MOCK_CALENDAR_EVENTS);
    }
    setLastSynced(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setIsLoading(false);
  };

  useEffect(() => {
    loadCalendar();
  }, [accessToken, googleConnected]);

  const handleQuickGenerate = (event: GoogleCalendarEvent) => {
    const companyName = event.companyNameParsed || event.summary;
    const stakeholderName = event.stakeholderNameParsed;

    onGenerateForMeeting({
      companyName,
      stakeholderName,
      naturalLanguagePrompt: `Meeting scheduled on ${new Date(event.start.dateTime || Date.now()).toLocaleDateString()}: "${event.summary}". Please provide 3 years financial records, current affairs, and stakeholder priorities.`,
      timeframe: '60 minutes before',
      customScheduledDate: event.start.dateTime,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1FA9A0]/10 text-[#1FA9A0] border border-[#1FA9A0]/20 text-xs font-bold uppercase tracking-wider mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            Real-Time Google Calendar Sync
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
            Detected Upcoming Meetings
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
            SalesScout AI scans your connected Google Calendar to automatically surface upcoming sales calls and generate pre-meeting briefs before you walk in.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
          {googleConnected ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Synced {lastSynced}</span>
              <button
                onClick={loadCalendar}
                disabled={isLoading}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Sync Now</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onConnectGoogle}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#0B1F3A] hover:bg-[#15345d] text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CalendarIcon className="w-4 h-4 text-[#1FA9A0]" />
              <span>Connect Google Calendar</span>
            </button>
          )}
        </div>
      </div>

      {/* Calendar Events List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          <span>{events.length} Upcoming Sales Conversations</span>
          <span>Auto-Detected Prospects</span>
        </div>

        {events.map((evt) => {
          const startDate = evt.start.dateTime ? new Date(evt.start.dateTime) : new Date();
          const formattedTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const formattedDate = startDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

          return (
            <div
              key={evt.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#1FA9A0]/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Date Badge */}
                <div className="bg-[#0B1F3A] text-white rounded-xl p-3 text-center min-w-[70px] flex-shrink-0 shadow">
                  <div className="text-[10px] uppercase tracking-wider text-[#1FA9A0] font-bold">
                    {startDate.toLocaleDateString([], { month: 'short' })}
                  </div>
                  <div className="text-xl font-extrabold leading-tight">
                    {startDate.getDate()}
                  </div>
                  <div className="text-[10px] text-slate-300 font-medium mt-0.5">
                    {formattedTime}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#0B1F3A] group-hover:text-[#1FA9A0] transition-colors">
                      {evt.summary}
                    </h3>
                  </div>

                  {evt.description && (
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                      {evt.description}
                    </p>
                  )}

                  {/* Attendees & Extracted Info */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#0B1F3A] bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                      Company: <strong className="text-[#1FA9A0]">{evt.companyNameParsed}</strong>
                    </span>

                    {evt.stakeholderNameParsed && (
                      <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        Stakeholder: <strong>{evt.stakeholderNameParsed}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleQuickGenerate(evt)}
                className="w-full md:w-auto py-3 px-5 bg-[#F5A623] hover:bg-[#E09419] active:bg-[#C98212] text-[#0B1F3A] font-extrabold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:scale-105 flex-shrink-0"
              >
                <Sparkles className="w-4 h-4 text-[#0B1F3A]" />
                <span>Generate Briefing for This Meeting</span>
                <ArrowRight className="w-4 h-4 text-[#0B1F3A]" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
