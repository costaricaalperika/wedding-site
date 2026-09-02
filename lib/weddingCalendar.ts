/**
 * Nikâh + Kutlama — 3 Ekim 2026, İzmir (Türkiye saati / UTC+3).
 * Google Calendar ve .ics için UTC anlık zaman damgaları.
 */

/** Nikâh 14:30–15:30 Türkiye saati (Fuar Evlendirme Dairesi) */
const CEREMONY_START_UTC = "20261003T113000Z";
const CEREMONY_END_UTC = "20261003T123000Z";
const CEREMONY_LOCATION = "Fuar Evlendirme Dairesi, İzmir";

/** Kutlama 19:00–23:00 Türkiye saati (yaklaşık) */
const CELEBRATION_START_UTC = "20261003T160000Z";
const CELEBRATION_END_UTC = "20261003T200000Z";
const CELEBRATION_LOCATION = "Viola Event, İzmir";

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

function buildIcsContent(params: {
  uid: string;
  title: string;
  description: string;
  start: string;
  end: string;
  location: string;
}): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AlperDuygu//Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${params.uid}`,
    `DTSTAMP:${formatIcsStamp(new Date())}`,
    `DTSTART:${params.start}`,
    `DTEND:${params.end}`,
    `SUMMARY:${escapeIcsText(params.title)}`,
    `DESCRIPTION:${escapeIcsText(params.description)}`,
    `LOCATION:${escapeIcsText(params.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

/** Nikâh — Google Calendar bağlantısı */
export function buildGoogleCeremonyUrl(params: { title: string; details: string }): string {
  return googleCalendarUrl({
    title: params.title,
    start: CEREMONY_START_UTC,
    end: CEREMONY_END_UTC,
    details: params.details,
    location: CEREMONY_LOCATION,
  });
}

/** Nikâh etkinliği (.ics) */
export function buildCeremonyIcsContent(params: { title: string; description: string }): string {
  return buildIcsContent({
    uid: "ceremony-alper-duygu-20261003@wedding-site",
    title: params.title,
    description: params.description,
    start: CEREMONY_START_UTC,
    end: CEREMONY_END_UTC,
    location: CEREMONY_LOCATION,
  });
}

/** Kutlama — Google Calendar bağlantısı */
export function buildGoogleCelebrationUrl(params: { title: string; details: string }): string {
  return googleCalendarUrl({
    title: params.title,
    start: CELEBRATION_START_UTC,
    end: CELEBRATION_END_UTC,
    details: params.details,
    location: CELEBRATION_LOCATION,
  });
}

/** Kutlama etkinliği (.ics) */
export function buildCelebrationIcsContent(params: { title: string; description: string }): string {
  return buildIcsContent({
    uid: "celebration-alper-duygu-20261003@wedding-site",
    title: params.title,
    description: params.description,
    start: CELEBRATION_START_UTC,
    end: CELEBRATION_END_UTC,
    location: CELEBRATION_LOCATION,
  });
}
