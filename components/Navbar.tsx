"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "./i18n";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();

  const links = [
    { label: t.nav.event, href: "#event", sectionId: "event" },
    { label: t.nav.gallery, href: "#gallery", sectionId: "gallery" },
    { label: t.nav.rsvp, href: "#rsvp", sectionId: "rsvp" },
  ] as const;

  /** Mobil Chrome: hash değişir ama kaydırma olmaz — menü kapanınca programatik scroll (layout + smooth scroll yarışı) */
  function handleMobileNavClick(e: React.MouseEvent<HTMLAnchorElement>, sectionId: string, href: string) {
    e.preventDefault();
    setMobileOpen(false);
    window.setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (window.location.hash !== href) {
        window.history.replaceState(null, "", href);
      }
    }, 120);
  }

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 bg-hero-mist/92 backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="#"
            className="font-[family-name:var(--font-hero)] text-xl sm:text-2xl tracking-wide text-warm shrink-0"
          >
            D &amp; A
          </a>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-[0.2em] text-warm-light hover:text-warm transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5"
          aria-label={t.nav.menu}
        >
          <span
            className={`w-6 h-0.5 bg-warm transition-transform duration-300 ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-warm transition-opacity duration-300 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-warm transition-transform duration-300 ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-hero-mist/95 backdrop-blur-md overflow-hidden"
          >
            <div className="flex flex-col items-center gap-6 py-8">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleMobileNavClick(e, link.sectionId, link.href)}
                  className="text-sm tracking-[0.2em] text-warm-light hover:text-warm transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
