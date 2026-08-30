"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onOpen: () => void;
}

const EXIT_DURATION = 1;
const EXIT_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export default function InvitationCover({ onOpen }: Props) {
  const [opened, setOpened] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const dismissedRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  function handleOpen() {
    if (opened || dismissedRef.current) return;
    dismissedRef.current = true;
    document.body.style.overflow = "";
    window.scrollTo({ top: 0 });
    setOpened(true);
    onOpen();
  }

  return (
    <AnimatePresence>
      {!opened && (
        <motion.div
          key="invitation-cover"
          initial={{ y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { y: "-100%" }}
          transition={{
            duration: reduceMotion ? 0.2 : EXIT_DURATION,
            ease: reduceMotion ? "easeOut" : EXIT_EASE,
          }}
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpen();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Davetiyeyi aç"
          className="fixed inset-0 z-[200] cursor-pointer select-none bg-paper-cream flex items-center justify-center"
        >
          <div className="absolute inset-4 border border-rose/35 pointer-events-none" />
          <div className="absolute inset-[18px] border border-rose/15 pointer-events-none" />

          <CornerOrnament className="absolute top-6 left-6" />
          <CornerOrnament className="absolute top-6 right-6 rotate-90" />
          <CornerOrnament className="absolute bottom-6 left-6 -rotate-90" />
          <CornerOrnament className="absolute bottom-6 right-6 rotate-180" />

          <div className="text-center px-8 max-w-xs">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="w-24 h-24 rounded-full border-2 border-rose/50 flex items-center justify-center mx-auto mb-8 bg-cream-dark/60"
            >
              <span className="font-[family-name:var(--font-hero)] text-xl leading-tight text-rose-dark px-1 text-center">
                D &amp; A
              </span>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-20 h-px mx-auto mb-7 bg-rose origin-center"
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              <p className="font-[family-name:var(--font-serif)] text-base leading-relaxed text-warm">
                Bu davetiye sizin için özeldir.
              </p>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="w-20 h-px mx-auto mt-7 mb-7 bg-rose origin-center"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-xs tracking-[0.25em] uppercase mb-3 text-warm-light"
            >
              03-10-2026
            </motion.p>

            <motion.div
              className="relative mt-10 flex w-full max-w-[20rem] flex-col items-center justify-center sm:mt-12 mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="relative z-[1] flex w-full flex-col items-center rounded-2xl border-2 border-rose/45 bg-paper-white-soft px-5 py-4 sm:px-7 sm:py-5"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.035, 1],
                }}
                transition={{
                  duration: 1.85,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <p className="max-w-[18rem] text-center text-[11px] font-semibold leading-relaxed tracking-wide text-warm sm:text-sm">
                  <span className="font-bold tracking-[0.14em] uppercase">
                    AÇMAK İÇİN DOKUNUN
                  </span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CornerOrnament({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className ? `text-rose ${className}` : "text-rose"}
      aria-hidden
    >
      <path d="M2 12 L2 2 L12 2" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="2" cy="2" r="1.5" fill="currentColor" />
    </svg>
  );
}
