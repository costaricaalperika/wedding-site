import type { Locale } from "@/components/i18n";
import type { Guest } from "@/lib/supabase";
import { formatMainGuestLabel } from "@/lib/mainGuestLabel";

/** Admin sözlüğünden PDF için gerekli alanlar */
export type AdminPdfLabels = {
  pdfDocTitle: string;
  pdfGenerated: string;
  pdfTotal: string;
  pdfAttending: string;
  pdfDeclined: string;
  colName: string;
  colParty: string;
  colEmail: string;
  colPhone: string;
  colStatus: string;
  colNotes: string;
  pdfColSubmitted: string;
  pdfFilePrefix: string;
  statusAttending: string;
  statusDeclined: string;
};

function cell(v: string | null | undefined): string {
  if (v == null || v === "") return "—";
  return String(v);
}

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
 * Misafir listesini PDF olarak indirir (Roboto vfs — Türkçe karakter uyumlu).
 */
export async function downloadGuestsPdf(
  guests: Guest[],
  locale: Locale,
  admin: AdminPdfLabels
): Promise<void> {
  if (guests.length === 0) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfMake: any = (await import("pdfmake/build/pdfmake")).default;
  const vfsMod = await import("pdfmake/build/vfs_fonts");
  const vfs = (vfsMod as { default?: Record<string, string> }).default ?? vfsMod;
  pdfMake.vfs = vfs;

  const total = guests.length;
  const attending = guests.filter((g) => g.attending).length;
  const declined = total - attending;

  const tableBody: unknown[][] = [
    [
      { text: admin.colName, style: "th", bold: true },
      { text: admin.colParty, style: "th", bold: true },
      { text: admin.colEmail, style: "th", bold: true },
      { text: admin.colPhone, style: "th", bold: true },
      { text: admin.colStatus, style: "th", bold: true },
      { text: admin.colNotes, style: "th", bold: true },
      { text: admin.pdfColSubmitted, style: "th", bold: true },
    ],
    ...guests.map((g) => [
      cell(g.name),
      formatMainGuestLabel(g, guests),
      cell(g.email),
      cell(g.phone),
      g.attending
        ? { text: admin.statusAttending, color: "#15803d", bold: true }
        : { text: admin.statusDeclined, color: "#dc2626", bold: true },
      { text: cell(g.notes), fontSize: 7 },
      formatDate(g.created_at, locale),
    ]),
  ];

  const fileName = `${admin.pdfFilePrefix}-${new Date().toISOString().slice(0, 10)}.pdf`;

  const docDefinition: Record<string, unknown> = {
    pageMargins: [40, 48, 40, 56],
    defaultStyle: { font: "Roboto", fontSize: 9 },
    content: [
      {
        text: admin.pdfDocTitle,
        style: "title",
        margin: [0, 0, 0, 6],
      },
      {
        text: `${admin.pdfGenerated}: ${formatDate(new Date().toISOString(), locale)}`,
        style: "muted",
        margin: [0, 0, 0, 16],
      },
      {
        columns: [
          { text: `${admin.pdfTotal}: ${total}`, width: "auto" },
          { text: `${admin.pdfAttending}: ${attending}`, width: "auto", margin: [16, 0, 0, 0] },
          { text: `${admin.pdfDeclined}: ${declined}`, width: "auto", margin: [16, 0, 0, 0] },
        ],
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          headerRows: 1,
          widths: ["*", 100, "auto", 48, 38, 52, 58],
          body: tableBody,
        },
        layout: {
          fillColor: (i: number) => (i === 0 ? "#f5f0eb" : null),
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#d4c4bc",
          vLineColor: () => "#d4c4bc",
        },
      },
    ],
    styles: {
      title: { fontSize: 14, bold: true, color: "#5c4033" },
      muted: { fontSize: 8, color: "#8b7355" },
      th: { fontSize: 8, color: "#5c4033" },
    },
  };

  pdfMake.createPdf(docDefinition).download(fileName);
}
