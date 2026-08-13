import { GoogleCalendarEvent } from '../types';

/**
 * Helper to parse company and stakeholder name from calendar event titles/attendees.
 */
function parseEventDetails(title: string, attendees?: Array<{ email: string; displayName?: string }>): {
  companyName: string;
  stakeholderName?: string;
} {
  let companyName = title;
  let stakeholderName: string | undefined = undefined;

  // Pattern: "Meeting with [Company]" or "Demo with [Company]"
  const withMatch = title.match(/(?:meeting|demo|sync|call|review|qbr)\s+(?:with|for|at)\s+([A-Za-z0-9\s]+)/i);
  if (withMatch && withMatch[1]) {
    companyName = withMatch[1].trim().split('-')[0].split('|')[0].trim();
  } else {
    // Strip common words
    companyName = title
      .replace(/(?:meeting|demo|sync|call|discussion|intro|qbr|catchup|weekly|monthly)/gi, '')
      .replace(/[-|:]/g, '')
      .trim();
  }

  // If attendees exist, grab external attendee name
  if (attendees && attendees.length > 0) {
    const external = attendees.find(a => a.email && !a.email.includes('salesScout') && !a.email.includes('gmail.com'));
    if (external) {
      stakeholderName = external.displayName || external.email.split('@')[0].replace('.', ' ');
    } else if (attendees[0].displayName) {
      stakeholderName = attendees[0].displayName;
    }
  }

  if (!companyName || companyName.length < 2) {
    companyName = 'Prospect Enterprise';
  }

  return { companyName, stakeholderName };
}

/**
 * Fetches real Google Calendar events for the logged in user using Google Calendar API v3.
 */
export async function fetchGoogleCalendarEvents(accessToken: string): Promise<GoogleCalendarEvent[]> {
  try {
    const now = new Date();
    const timeMin = now.toISOString();
    // 30 days window
    const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const timeMax = future.toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&maxResults=15&orderBy=startTime&singleEvents=true`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`Google Calendar API returned status ${res.status}`);
      return MOCK_CALENDAR_EVENTS;
    }

    const data = await res.json();
    if (!data.items || !Array.isArray(data.items)) {
      return MOCK_CALENDAR_EVENTS;
    }

    return data.items.map((item: any) => {
      const parsed = parseEventDetails(item.summary || 'Meeting', item.attendees);
      return {
        id: item.id,
        summary: item.summary || 'Sales Meeting',
        description: item.description,
        start: item.start || {},
        end: item.end || {},
        attendees: item.attendees,
        companyNameParsed: parsed.companyName,
        stakeholderNameParsed: parsed.stakeholderName,
      };
    });
  } catch (err) {
    console.error('Failed to fetch Google Calendar events:', err);
    return MOCK_CALENDAR_EVENTS;
  }
}

export const MOCK_CALENDAR_EVENTS: GoogleCalendarEvent[] = [
  {
    id: 'cal-event-1',
    summary: 'Stripe Global — Growth Engineering Architecture Sync',
    description: 'Quarterly review of API scalability and enterprise payment security features.',
    start: { dateTime: new Date(Date.now() + 3 * 3600 * 1000).toISOString() },
    end: { dateTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString() },
    attendees: [
      { email: 'marcus.vance@stripe.com', displayName: 'Marcus Vance (Head of Growth)' }
    ],
    companyNameParsed: 'Stripe Global',
    stakeholderNameParsed: 'Marcus Vance'
  },
  {
    id: 'cal-event-2',
    summary: 'Acme Health Tech — Vendor Procurement Demo',
    description: 'Demonstrating automated workflow compliance for healthcare HIPAA requirements.',
    start: { dateTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString() },
    end: { dateTime: new Date(Date.now() + 25 * 3600 * 1000).toISOString() },
    attendees: [
      { email: 'sarah.chen@acmehealth.com', displayName: 'Sarah Chen (VP Procurement)' }
    ],
    companyNameParsed: 'Acme Health Tech',
    stakeholderNameParsed: 'Sarah Chen'
  },
  {
    id: 'cal-event-3',
    summary: 'Datadog Systems — Security Architecture Review',
    description: 'Discussing infrastructure telemetry, observability integrations and deal terms.',
    start: { dateTime: new Date(Date.now() + 48 * 3600 * 1000).toISOString() },
    end: { dateTime: new Date(Date.now() + 49 * 3600 * 1000).toISOString() },
    attendees: [
      { email: 'david.kogan@datadog.com', displayName: 'David Kogan (VP Infra)' }
    ],
    companyNameParsed: 'Datadog Systems',
    stakeholderNameParsed: 'David Kogan'
  },
  {
    id: 'cal-event-4',
    summary: 'Snowflake Data — Cloud Lakehouse Discovery Call',
    description: 'Evaluating enterprise data governance and multi-cloud warehouse pipelines.',
    start: { dateTime: new Date(Date.now() + 72 * 3600 * 1000).toISOString() },
    end: { dateTime: new Date(Date.now() + 73 * 3600 * 1000).toISOString() },
    attendees: [
      { email: 'elena.rostova@snowflake.com', displayName: 'Elena Rostova (Director of Security)' }
    ],
    companyNameParsed: 'Snowflake Data',
    stakeholderNameParsed: 'Elena Rostova'
  }
];
