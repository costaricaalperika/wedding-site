"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Story", href: "#story" },
  { label: "Event", href: "#event" },
  { label: "Gallery", href: "#gallery" },
  { label: "RSVP", href: "#rsvp" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a
          href="#"
          className="font-[family-name:var(--font-serif)] text-xl tracking-wide text-warm"
        >
          A & E
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex gap-10">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-[0.2em] text-warm-light hover:text-warm transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5"
          aria-label="Toggle menu"
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
            className="md:hidden bg-white/95 backdrop-blur-md overflow-hidden"
          >
            <div className="flex flex-col items-center gap-6 py-8">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm uppercase tracking-[0.2em] text-warm-light hover:text-warm transition-colors"
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
