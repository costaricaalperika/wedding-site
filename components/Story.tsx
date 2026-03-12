"use client";

import ScrollReveal from "./ScrollReveal";

export default function Story() {
  return (
    <section id="story" className="py-28 md:py-36 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <p className="text-sm uppercase tracking-[0.3em] text-rose mb-4">
            Our Journey
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl mb-12 text-warm">
            Our Story
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="w-16 h-px bg-rose mx-auto mb-12" />
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <p className="text-lg leading-9 text-warm-light">
            We met on a warm summer evening in Florence, where a chance encounter
            at a tiny café by the Arno turned into hours of conversation and
            laughter. What began as a simple hello slowly blossomed into a love
            story filled with shared dreams, spontaneous adventures, and quiet
            moments that meant the world. From sunsets in Tuscany to city strolls
            under the stars, every step of this journey has led us here — to the
            moment we say &ldquo;I do.&rdquo;
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.35}>
          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-rose/40" />
            <span className="font-[family-name:var(--font-serif)] italic text-rose text-xl">
              A & E
            </span>
            <div className="w-12 h-px bg-rose/40" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
