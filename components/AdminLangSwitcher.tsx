"use client";

import { useI18n, type Locale } from "@/components/i18n";

export default function AdminLangSwitcher() {
  const { locale, setLocale, t } = useI18n();

  function pill(active: boolean) {
    return `px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
      active
        ? "bg-rose text-white"
        : "text-warm-light hover:text-warm hover:bg-cream"
    }`;
  }

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-cream-dark bg-cream/50 p-0.5"
      role="group"
      aria-label={t.admin.langAria}
    >
      <button
        type="button"
        onClick={() => setLocale("en" satisfies Locale)}
        className={pill(locale === "en")}
        aria-pressed={locale === "en"}
      >
        {t.admin.langEn}
      </button>
      <button
        type="button"
        onClick={() => setLocale("tr" satisfies Locale)}
        className={pill(locale === "tr")}
        aria-pressed={locale === "tr"}
      >
        {t.admin.langTr}
      </button>
    </div>
  );
}
