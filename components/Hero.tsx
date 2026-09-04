"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useI18n } from "./i18n";
import HeartsRain from "./HeartsRain";

/** Aşağı düşen kalpler — `true` yapınca tekrar açılır (Hero arka plan animasyonu). */
const ENABLE_FALLING_HEARTS = false;

/** Hero'daki "Katılım Gönder" butonu — `true` yapınca tekrar görünür. */
const SHOW_HERO_CTA = false;

const HEART_COUNT = 22;

type Heart = {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
};

/** Sadece ENABLE_FALLING_HEARTS true iken mount olur; boşken hook çalışmaz. */
function FallingHeartsLayer() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setHearts(
        Array.from({ length: HEART_COUNT }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          size: Math.random() * 10 + 12,
          delay: Math.random() * 8,
          duration: Math.random() * 6 + 8,
          rotation: Math.random() * 360,
        }))
      );
    });
  }, []);

  return (
    <>
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute top-0 pointer-events-none select-none"
          style={{ left: `${h.x}%` }}
          animate={{ y: ["0vh", "110vh"], rotate: [h.rotation, h.rotation + 360] }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              className="fill-rose/40"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useI18n();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const nameVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, delay },
    }),
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 1.4, delay: 1.2 },
    },
  };

  return (
    <section
      ref={ref}
      className="relative isolate h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-hero-mist to-cream"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#ffffff40_0%,_transparent_72%)]" />

      <HeartsRain active />

      {ENABLE_FALLING_HEARTS ? <FallingHeartsLayer /> : null}

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 text-center px-6 flex flex-col items-center"
      >
        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="w-24 h-px bg-warm/25 mb-8 origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-xs uppercase tracking-[0.45em] mb-8 text-warm/60"
        >
          {t.hero.intro}
        </motion.p>

        <div className="flex flex-col items-center gap-1 sm:gap-2">
          <motion.span
            custom={0.5}
            variants={nameVariants}
            initial="hidden"
            animate="visible"
            className="font-[family-name:var(--font-hero)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal text-rose leading-none tracking-wide"
          >
            Duygu
          </motion.span>

          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.0, ease: "easeOut" }}
            className="font-[family-name:var(--font-hero)] text-4xl md:text-5xl text-rose my-0.5"
          >
            &
          </motion.span>

          <motion.span
            custom={1.1}
            variants={nameVariants}
            initial="hidden"
            animate="visible"
            className="font-[family-name:var(--font-hero)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal text-rose leading-none tracking-wide"
          >
            Alper
          </motion.span>
        </div>

        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="w-24 h-px bg-warm/25 mt-8 mb-6 origin-center"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.8 }}
          className="text-sm tracking-[0.25em] text-warm/60 mb-10"
        >
          {t.hero.datePlace}
        </motion.p>

        {SHOW_HERO_CTA && (
          <motion.a
            href="#rsvp"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="inline-block border border-rose/35 px-8 py-3 text-xs uppercase tracking-[0.3em] text-rose hover:bg-rose/10 hover:border-rose transition-all duration-500"
          >
            {t.hero.cta}
          </motion.a>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 border-2 border-warm/25 rounded-full flex justify-center pt-1"
        >
          <div className="w-1 h-2 bg-warm/35 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
