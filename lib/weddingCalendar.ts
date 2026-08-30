/**
 * Kutlama — 16 Mayıs 2026, Londra (BST / UTC+1).
 * Google Calendar ve .ics için UTC anlık zaman damgaları.
 */

/** Kutlama 19:00–23:00 BST (yaklaşık) */
const CELEBRATION_START_UTC = "20260516T180000Z";
const CELEBRATION_END_UTC = "20260516T220000Z";

const CELEBRATION_LOCATION = "The Old Brewery, Greenwich, London SE10, United Kingdom";

function googleCalendarUrl(params: {
  title: string;
  start: string;
  end: string;
  details: string;
  location: string;
}): string {
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: params.title,
    dates: `${params.start}/${params.end}`,
    details: params.details,
    location: params.location,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

function escapeIcsText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

export function buildGoogleCelebrationUrl(params: {
  title: string;
  details: string;
}): string {
  return googleCalendarUrl({
    title: params.title,
    start: CELEBRATION_START_UTC,
    end: CELEBRATION_END_UTC,
    details: params.details,
    location: CELEBRATION_LOCATION,
  });
}

/** Yalnızca kutlama etkinliği (.ics) */
export function buildCelebrationIcsContent(params: {
  title: string;
  description: string;
}): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AlperDuygu//Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:celebration-alper-duygu-20260516@wedding-site`,
    `DTSTAMP:${formatIcsStamp(new Date())}`,
    `DTSTART:${CELEBRATION_START_UTC}`,
    `DTEND:${CELEBRATION_END_UTC}`,
    `SUMMARY:${escapeIcsText(params.title)}`,
    `DESCRIPTION:${escapeIcsText(params.description)}`,
    `LOCATION:${escapeIcsText(CELEBRATION_LOCATION)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

/** ICS DTSTAMP (UTC) */
function formatIcsStamp(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  const s = String(d.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${day}T${h}${min}${s}Z`;
}
