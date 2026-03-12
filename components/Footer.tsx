"use client";

import ScrollReveal from "./ScrollReveal";

export default function Footer() {
  return (
    <footer className="py-16 text-center bg-cream">
      <ScrollReveal>
        <p className="font-[family-name:var(--font-serif)] text-2xl text-warm mb-2">
          Andrea & Emilio
        </p>
        <p className="text-sm text-warm-light tracking-widest">
          May 16, 2026 &bull; Tuscany
        </p>
        <div className="w-12 h-px bg-rose/40 mx-auto mt-6 mb-4" />
        <p className="text-xs text-warm-light/60">
          Made with love
        </p>
      </ScrollReveal>
    </footer>
  );
}
