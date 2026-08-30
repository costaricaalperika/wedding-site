"use client";

import ScrollReveal from "./ScrollReveal";
import { useI18n } from "./i18n";

export default function Story() {
  const { t } = useI18n();

  return (
    <section id="welcome-message" className="scroll-mt-24 pt-4 md:pt-5 pb-5 md:pb-6 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <p className="text-lg md:text-xl leading-relaxed text-warm-light font-[family-name:var(--font-serif)]">
            {t.story.text}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-5 flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-rose/40" />
            <span className="font-[family-name:var(--font-hero)] text-rose text-2xl md:text-3xl">
              D &amp; A
            </span>
            <div className="w-12 h-px bg-rose/40" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
