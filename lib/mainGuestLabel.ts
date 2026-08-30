import type { Guest } from "@/lib/supabase";

/**
 * Aynı RSVP’de birden fazla kişi varsa: `AnaDavetliAdı - 1`, `AnaDavetliAdı - 2`, …
 * Tek kişi veya katılmıyorsa: "—"
 */
export function formatMainGuestLabel(guest: Guest, allGuests: Guest[]): string {
  if (!guest.attending || guest.party_id == null || guest.party_index == null) {
    return "—";
  }

  const members = allGuests.filter(
    (g) => g.party_id === guest.party_id && g.attending
  );

  if (members.length <= 1) {
    return "—";
  }

  const main = members.find((m) => m.party_index === 1);
  if (!main) {
    return "—";
  }

  return `${main.name} - ${guest.party_index}`;
}
