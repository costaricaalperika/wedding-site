"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 scale-110"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 text-center text-white px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-sm uppercase tracking-[0.3em] mb-6 text-white/80"
        >
          We're getting married
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="font-[family-name:var(--font-serif)] text-5xl sm:text-6xl md:text-8xl font-light leading-tight"
        >
          Andrea
          <span className="block text-3xl sm:text-4xl md:text-5xl my-3 font-[family-name:var(--font-serif)] italic text-white/70">
            &
          </span>
          Emilio
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-8"
        >
          <p className="text-lg tracking-widest text-white/90">
            May 16, 2026 &bull; Tuscany, Italy
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-12"
        >
          <a
            href="#rsvp"
            className="inline-block border border-white/50 px-8 py-3 text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-warm transition-all duration-500"
          >
            RSVP Now
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 border-2 border-white/50 rounded-full flex justify-center pt-1"
        >
          <div className="w-1 h-2 bg-white/70 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
