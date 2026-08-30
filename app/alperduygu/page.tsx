"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSupabase, type Guest } from "@/lib/supabase";
import { downloadGuestsPdf } from "@/lib/exportGuestsPdf";
import { downloadGuestsExcel } from "@/lib/exportGuestsExcel";
import { formatMainGuestLabel } from "@/lib/mainGuestLabel";
import { sortGuests, type AdminSortKey, type SortDir } from "@/lib/sortGuests";
import { useI18n } from "@/components/i18n";
import AdminLangSwitcher from "@/components/AdminLangSwitcher";

export default function AdminPage() {
  const { locale, t } = useI18n();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [sortKey, setSortKey] = useState<AdminSortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const a = t.admin;
  const dateLocale = locale === "tr" ? "tr-TR" : "en-GB";

  const sortedGuests = useMemo(
    () => sortGuests(guests, sortKey, sortDir, locale),
    [guests, sortKey, sortDir, locale]
  );

  function toggleSort(key: AdminSortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      if (key === "date") setSortDir("desc");
      else setSortDir("asc");
    }
  }

  const pdfLabelsCommon = useMemo(
    () => ({
      pdfGenerated: a.pdfGenerated,
      pdfTotal: a.pdfTotal,
      pdfAttending: a.pdfAttending,
      pdfDeclined: a.pdfDeclined,
      colName: a.colName,
      colParty: a.colParty,
      colEmail: a.colEmail,
      colPhone: a.colPhone,
      colStatus: a.colStatus,
      colNotes: a.colNotes,
      pdfColSubmitted: a.pdfColSubmitted,
      statusAttending: a.statusAttending,
      statusDeclined: a.statusDeclined,
    }),
    [a]
  );

  const excelLabels = useMemo(
    () => ({
      colName: a.colName,
      colParty: a.colParty,
      colEmail: a.colEmail,
      colPhone: a.colPhone,
      colStatus: a.colStatus,
      colNotes: a.colNotes,
      colSubmitted: a.pdfColSubmitted,
      statusAttending: a.statusAttending,
      statusDeclined: a.statusDeclined,
      excelSheetName: a.excelSheetName,
      excelFilePrefix: a.excelFilePrefix,
    }),
    [a]
  );

  async function handleDownloadPdf(kind: "all" | "attending" | "declined") {
    const rows =
      kind === "all"
        ? sortedGuests
        : kind === "attending"
          ? sortedGuests.filter((g) => g.attending)
          : sortedGuests.filter((g) => !g.attending);
    if (rows.length === 0) return;

    setPdfLoading(true);
    try {
      const titleAndPrefix =
        kind === "all"
          ? { pdfDocTitle: a.pdfDocTitle, pdfFilePrefix: a.pdfFilePrefix }
          : kind === "attending"
            ? {
                pdfDocTitle: a.pdfDocTitleAttendingOnly,
                pdfFilePrefix: a.pdfFilePrefixAttendingOnly,
              }
            : {
                pdfDocTitle: a.pdfDocTitleDeclinedOnly,
                pdfFilePrefix: a.pdfFilePrefixDeclinedOnly,
              };

      await downloadGuestsPdf(rows, locale, {
        ...pdfLabelsCommon,
        ...titleAndPrefix,
      });
    } catch (e) {
      console.error(e);
      alert(a.pdfError);
    } finally {
      setPdfLoading(false);
    }
  }

  async function handleDownloadExcel() {
    if (sortedGuests.length === 0) return;
    setExcelLoading(true);
    try {
      await downloadGuestsExcel(sortedGuests, locale, excelLabels);
    } catch (e) {
      console.error(e);
      alert(a.excelError);
    } finally {
      setExcelLoading(false);
    }
  }

  const loadGuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (getSupabase().from("guests") as any)
        .select("*")
        .order("created_at", { ascending: false }) as { data: Guest[] | null; error: { message: string } | null };

      if (error) {
        console.error("Fetch error:", error);
        setError(error.message);
        setGuests([]);
      } else {
        setGuests(data ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to Supabase");
      setGuests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGuests();
  }, [loadGuests]);

  async function handleDeleteGuest(guest: Guest) {
    const msg = a.deleteGuestConfirm.replace("{name}", guest.name);
    if (!window.confirm(msg)) return;

    setDeletingId(guest.id);
    try {
      const res = await fetch(`/api/alperduygu/guests/${encodeURIComponent(guest.id)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        alert(
          `${a.deleteGuestError}${body?.error ? `\n${body.error}` : ""}`
        );
        return;
      }
      setGuests((prev) => prev.filter((g) => g.id !== guest.id));
    } catch {
      alert(a.deleteGuestError);
    } finally {
      setDeletingId(null);
    }
  }

  const totalGuests = guests.length;
  const attending = guests.filter((g) => g.attending).length;
  const declined = guests.filter((g) => !g.attending).length;

  return (
    <div className="min-h-screen bg-paper-cream">
      <header className="bg-paper-white border-b border-cream-dark">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-2xl text-warm">
              {a.dashboardTitle}
            </h1>
            <p className="text-sm text-warm-light mt-1">{a.dashboardSubtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <AdminLangSwitcher />
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/alperduygu/auth", { method: "DELETE" });
                window.location.href = "/alperduygu/login";
              }}
              className="text-sm text-warm-light hover:text-warm transition-colors"
            >
              {a.logout}
            </button>
            <Link
              href="/"
              className="text-sm text-rose hover:text-rose-dark underline underline-offset-4 transition-colors"
            >
              &larr; {a.backToSite}
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {[
            { label: a.totalResponses, value: totalGuests, color: "text-warm" },
            { label: a.attendingStat, value: attending, color: "text-green-600" },
            { label: a.declinedStat, value: declined, color: "text-red-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-paper-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-warm-light mb-1">{stat.label}</p>
              <p className={`font-[family-name:var(--font-serif)] text-4xl ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-paper-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-cream-dark flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-warm">
                {a.guestList}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto sm:justify-end">
              <button
                type="button"
                disabled={loading || guests.length === 0 || pdfLoading || excelLoading}
                onClick={() => handleDownloadPdf("all")}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose text-white text-sm font-medium hover:bg-rose-dark transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                {pdfLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {a.preparingPdf}
                  </>
                ) : (
                  <>
                    <PdfIcon />
                    {a.downloadPdf}
                  </>
                )}
              </button>
              <button
                type="button"
                disabled={loading || attending === 0 || pdfLoading || excelLoading}
                onClick={() => handleDownloadPdf("attending")}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-green-600 bg-paper-white text-green-800 text-sm font-medium hover:bg-green-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                {pdfLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                ) : null}
                <span>{pdfLoading ? a.preparingPdf : a.downloadPdfAttendingOnly}</span>
              </button>
              <button
                type="button"
                disabled={loading || declined === 0 || pdfLoading || excelLoading}
                onClick={() => handleDownloadPdf("declined")}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-red-500 bg-paper-white text-red-800 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                {pdfLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : null}
                <span>{pdfLoading ? a.preparingPdf : a.downloadPdfDeclinedOnly}</span>
              </button>
              <button
                type="button"
                disabled={loading || guests.length === 0 || excelLoading || pdfLoading}
                onClick={() => void handleDownloadExcel()}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-emerald-700 bg-paper-white text-emerald-900 text-sm font-medium hover:bg-emerald-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                title={a.downloadExcel}
              >
                {excelLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                    {a.preparingExcel}
                  </>
                ) : (
                  <>
                    <ExcelIcon />
                    {a.downloadExcel}
                  </>
                )}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center text-warm-light">
              <div className="inline-block w-6 h-6 border-2 border-rose border-t-transparent rounded-full animate-spin mb-4" />
              <p>{a.loadingGuests}</p>
            </div>
          ) : error ? (
            <div className="p-16 text-center text-red-500">
              <p className="font-medium mb-2">{a.connectionError}</p>
              <p className="text-sm text-warm-light">{error}</p>
            </div>
          ) : guests.length === 0 ? (
            <div className="p-16 text-center text-warm-light">
              <p>{a.noResponses}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-cream-dark bg-cream/50">
                    <th className="px-6 py-3 text-xs tracking-wide text-warm-light font-medium">
                      <button
                        type="button"
                        onClick={() => toggleSort("name")}
                        title={`${a.sortByName} (${sortKey === "name" ? (sortDir === "asc" ? a.sortAsc : a.sortDesc) : a.sortAsc})`}
                        className="inline-flex items-center gap-1.5 text-left font-medium hover:text-warm transition-colors"
                      >
                        {a.colName}
                        <SortArrow active={sortKey === "name"} dir={sortDir} />
                      </button>
                    </th>
                    <th
                      className="px-6 py-3 text-xs tracking-wide text-warm-light font-medium min-w-[10rem] max-w-[18rem]"
                      title={a.colPartyHint}
                    >
                      <span className="cursor-help border-b border-dotted border-warm-light/50">
                        {a.colParty}
                      </span>
                    </th>
                    <th className="px-6 py-3 text-xs tracking-wide text-warm-light font-medium">
                      {a.colEmail}
                    </th>
                    <th className="px-6 py-3 text-xs tracking-wide text-warm-light font-medium">
                      {a.colPhone}
                    </th>
                    <th className="px-6 py-3 text-xs tracking-wide text-warm-light font-medium">
                      <button
                        type="button"
                        onClick={() => toggleSort("status")}
                        title={`${a.sortByStatus} (${sortKey === "status" ? (sortDir === "asc" ? a.sortAsc : a.sortDesc) : a.sortAsc})`}
                        className="inline-flex items-center gap-1.5 text-left font-medium hover:text-warm transition-colors"
                      >
                        {a.colStatus}
                        <SortArrow active={sortKey === "status"} dir={sortDir} />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-xs tracking-wide text-warm-light font-medium min-w-[8rem] max-w-[14rem]">
                      {a.colNotes}
                    </th>
                    <th className="px-6 py-3 text-xs tracking-wide text-warm-light font-medium">
                      <button
                        type="button"
                        onClick={() => toggleSort("date")}
                        title={`${a.sortByDate} (${sortKey === "date" ? (sortDir === "asc" ? a.sortAsc : a.sortDesc) : a.sortDesc})`}
                        className="inline-flex items-center gap-1.5 text-left font-medium hover:text-warm transition-colors"
                      >
                        {a.colDate}
                        <SortArrow active={sortKey === "date"} dir={sortDir} />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-xs tracking-wide text-warm-light font-medium text-right w-28">
                      {a.colActions}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedGuests.map((guest) => (
                    <tr
                      key={guest.id}
                      className="border-b border-cream-dark/50 hover:bg-cream/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-warm font-medium">{guest.name}</td>
                      <td className="px-6 py-4 text-warm-light text-sm break-words">
                        {formatMainGuestLabel(guest, guests)}
                      </td>
                      <td className="px-6 py-4 text-warm-light">{guest.email}</td>
                      <td className="px-6 py-4 text-warm-light">
                        {guest.phone ?? <span className="text-warm-light/40">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full font-medium ${
                            guest.attending
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              guest.attending ? "bg-green-500" : "bg-red-400"
                            }`}
                          />
                          {guest.attending ? a.statusAttending : a.statusDeclined}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-warm-light text-sm align-top max-w-[14rem]">
                        {guest.notes?.trim() ? (
                          <span className="line-clamp-4" title={guest.notes}>
                            {guest.notes}
                          </span>
                        ) : (
                          <span className="text-warm-light/40">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-warm-light text-sm">
                        {new Date(guest.created_at).toLocaleString(dateLocale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right align-middle">
                        <button
                          type="button"
                          disabled={deletingId !== null}
                          onClick={() => void handleDeleteGuest(guest)}
                          className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline disabled:opacity-40 disabled:pointer-events-none"
                          aria-label={`${a.deleteGuest}: ${guest.name}`}
                        >
                          {deletingId === guest.id ? a.deleteGuestDeleting : a.deleteGuest}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SortArrow({
  active,
  dir,
}: {
  active: boolean;
  dir: SortDir;
}) {
  if (!active) {
    return (
      <span className="inline-block w-3 text-warm-light/40 select-none" aria-hidden>
        ↕
      </span>
    );
  }
  return (
    <span className="text-rose font-sans tabular-nums" aria-hidden>
      {dir === "asc" ? "↑" : "↓"}
    </span>
  );
}

function ExcelIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
