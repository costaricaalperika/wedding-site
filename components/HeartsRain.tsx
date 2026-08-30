"use client";

import { useEffect, useMemo, useState } from "react";

interface Props {
  /** Davetiye açıldıktan sonra true olur, kalpler yağmaya başlar */
  active: boolean;
}

type HeartConfig = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
};

const HEART_COUNT = 22;

function generateHearts(): HeartConfig[] {
  return Array.from({ length: HEART_COUNT }, () => ({
    left: Math.random() * 100,
    size: 12 + Math.random() * 16,
    duration: 9 + Math.random() * 8,
    delay: Math.random() * 12,
    drift: (Math.random() - 0.5) * 60,
    opacity: 0.35 + Math.random() * 0.4,
  }));
}

/** Davetiye açılınca ekranda yağmur gibi düşen kalpler (dekoratif, tıklamayı engellemez) */
export default function HeartsRain({ active }: Props) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const hearts = useMemo(() => generateHearts(), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!active || reduceMotion) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {hearts.map((h, i) => (
        <span
          key={i}
          className="hearts-rain-item absolute top-0 select-none"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            color: "#d68fa0",
            opacity: h.opacity,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            ["--heart-drift" as string]: `${h.drift}px`,
          }}
        >
          ♥
        </span>
      ))}

      <style>{`
        .hearts-rain-item {
          animation-name: heartsRainFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }

        @keyframes heartsRainFall {
          0% {
            transform: translateY(-10vh) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(50vh) translateX(var(--heart-drift, 20px)) rotate(180deg);
          }
          100% {
            transform: translateY(115vh) translateX(0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
