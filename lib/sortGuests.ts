import type { Locale } from "@/components/i18n";
import type { Guest } from "@/lib/supabase";

export type AdminSortKey = "name" | "status" | "date";
export type SortDir = "asc" | "desc";

/**
 * İsim (yerel alfabe), durum (katılıyor önce / sonra) veya tarih.
 */
export function sortGuests(
  guests: Guest[],
  key: AdminSortKey,
  dir: SortDir,
  locale: Locale
): Guest[] {
  const copy = [...guests];
  const mul = dir === "asc" ? 1 : -1;
  const loc = locale === "tr" ? "tr" : "en";

  copy.sort((a, b) => {
    if (key === "name") {
      return mul * a.name.localeCompare(b.name, loc, { sensitivity: "base" });
    }
    if (key === "status") {
      const rank = (g: Guest) => (g.attending ? 0 : 1);
      if (rank(a) !== rank(b)) {
        return mul * (rank(a) - rank(b));
      }
      return a.name.localeCompare(b.name, loc, { sensitivity: "base" });
    }
    if (key === "date") {
      const ta = new Date(a.created_at).getTime();
      const tb = new Date(b.created_at).getTime();
      if (ta !== tb) return mul * (ta - tb);
      return a.name.localeCompare(b.name, loc, { sensitivity: "base" });
    }
    return 0;
  });

  return copy;
}
