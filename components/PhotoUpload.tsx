"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { useI18n } from "./i18n";

const UPLOAD_URL =
  "https://drive.google.com/drive/folders/1BSh60imfmqlm4JW0tfHjYzFk8Z137n9N?usp=sharing";

/** Katılım bölümünden hemen sonra: fotoğraf yükleme daveti + QR pop-up */
export default function PhotoUpload() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <section className="scroll-mt-24 py-20 md:py-28 bg-paper-cream">
      <div className="max-w-lg mx-auto px-6 text-center">
        <ScrollReveal>
          <p className="text-sm uppercase tracking-[0.3em] text-rose mb-4">
            {t.photos.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl mb-4 text-warm">
            {t.photos.title}
          </h2>
          <p className="text-warm-light mb-8 leading-relaxed">{t.photos.description}</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-rose/40 px-8 py-3 text-xs uppercase tracking-[0.3em] text-rose hover:bg-rose/10 hover:border-rose transition-all duration-500"
          >
            {t.photos.buttonLabel}
          </button>
        </ScrollReveal>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm px-6"
            onClick={() => setOpen(false)}
            role="presentation"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={t.photos.modalTitle}
              className="relative w-full max-w-sm bg-paper-white-soft rounded-2xl border border-rose/30 shadow-xl p-6 sm:p-8 text-center"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.photos.closeAria}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-warm-light hover:text-warm hover:bg-rose/10 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="font-[family-name:var(--font-serif)] text-2xl mb-5 text-warm">
                {t.photos.modalTitle}
              </h3>

              <a
                href={UPLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block mx-auto mb-6 w-48 h-48 rounded-xl overflow-hidden border border-rose/20 bg-white hover:opacity-90 transition-opacity"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/eventpics-qr-heart.svg"
                  alt={t.photos.qrAlt}
                  className="w-full h-full object-contain"
                />
              </a>

              <a
                href={UPLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-warm text-white px-4 py-3 text-sm hover:bg-warm-light transition-colors duration-300"
              >
                {t.photos.linkButtonLabel}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
