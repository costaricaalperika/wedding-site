"use client";

import ScrollReveal from "./ScrollReveal";
import { useI18n } from "./i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="py-16 text-center bg-paper-cream">
      <ScrollReveal>
        <p className="font-[family-name:var(--font-hero)] text-3xl text-warm mb-2">
          Duygu <span aria-hidden>♥</span> Alper
        </p>
        <p className="text-sm text-warm-light tracking-widest">
          {t.footer.datePlace}
        </p>
        <div className="w-12 h-px bg-rose/40 mx-auto mt-6 mb-4" />
        <p className="text-xs text-warm-light/60">
          {t.footer.madeWithLove}
        </p>
      </ScrollReveal>
    </footer>
  );
}
