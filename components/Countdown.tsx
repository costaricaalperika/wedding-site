"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const WEDDING_DATE = new Date("2026-05-16T16:00:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft {
  const distance = WEDDING_DATE.getTime() - Date.now();
  if (distance <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  };
}

const units: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

export default function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    setTime(calcTimeLeft());
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-24 bg-white">
      <ScrollReveal>
        <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-center mb-14 text-warm">
          Counting the Days
        </h2>
      </ScrollReveal>

      <div className="flex justify-center gap-6 sm:gap-12 px-6">
        {units.map((unit, i) => (
          <ScrollReveal key={unit.key} delay={i * 0.1}>
            <div className="flex flex-col items-center">
              <motion.span
                key={mounted ? time[unit.key] : "init"}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-[family-name:var(--font-serif)] text-4xl sm:text-5xl md:text-6xl text-warm"
              >
                {mounted ? String(time[unit.key]).padStart(2, "0") : "--"}
              </motion.span>
              <span className="mt-2 text-xs uppercase tracking-[0.2em] text-warm-light">
                {unit.label}
              </span>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
