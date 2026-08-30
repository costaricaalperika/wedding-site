import type { Locale } from "@/components/i18n";
import type { Guest } from "@/lib/supabase";
import { formatMainGuestLabel } from "@/lib/mainGuestLabel";

export type AdminExcelLabels = {
  colName: string;
  colParty: string;
  colEmail: string;
  colPhone: string;
  colStatus: string;
  colNotes: string;
  colSubmitted: string;
  statusAttending: string;
  statusDeclined: string;
  excelSheetName: string;
  excelFilePrefix: string;
};

function formatDate(iso: string, locale: Locale): string {
  const loc = locale === "tr" ? "tr-TR" : "en-GB";
  return new Date(iso).toLocaleString(loc, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Tüm misafirleri .xlsx olarak indirir (UTF-8, Excel uyumlu).
 */
export async function downloadGuestsExcel(
  guests: Guest[],
  locale: Locale,
  labels: AdminExcelLabels
): Promise<void> {
  if (guests.length === 0) return;

  const XLSX = await import("xlsx");

  const rows = guests.map((g) => ({
    [labels.colName]: g.name,
    [labels.colParty]: formatMainGuestLabel(g, guests),
    [labels.colEmail]: g.email ?? "",
    [labels.colPhone]: g.phone ?? "",
    [labels.colStatus]: g.attending ? labels.statusAttending : labels.statusDeclined,
    [labels.colNotes]: (g.notes ?? "").replace(/\r?\n/g, " "),
    [labels.colSubmitted]: formatDate(g.created_at, locale),
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  const sheetName = labels.excelSheetName.slice(0, 31);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  const fileName = `${labels.excelFilePrefix}-${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
