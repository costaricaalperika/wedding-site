"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { useI18n } from "./i18n";

type Props = {
  src: string;
  /** true: çok daha dar sütun (pikselleşen görseller için) */
  compact?: boolean;
  /** true: üst boşluğu azalt (ör. galeriden hemen sonra) */
  tightTop?: boolean;
  /** true: üst+alt padding çok az (passage2 gibi sıkışık bölümler) */
  dense?: boolean;
};

export default function PassageBreak({ src, compact, tightTop, dense }: Props) {
  const { t } = useI18n();

  let paddingClass = "px-6 py-10 md:py-14";
  if (tightTop) {
    paddingClass = "px-6 pt-4 pb-10 md:pt-5 md:pb-14";
  } else if (dense) {
    paddingClass = "px-6 py-3 md:py-4";
  }

  return (
    <div className={paddingClass}>
      <div
        className={
          compact ? "max-w-[10rem] sm:max-w-[12rem] mx-auto" : "max-w-lg mx-auto"
        }
      >
        <ScrollReveal>
          <figure className="m-0">
            <Image
              src={src}
              alt={t.passage.imageAlt}
              width={1600}
              height={900}
              className="w-full h-auto"
              sizes={
                compact
                  ? "(max-width: 640px) 160px, 192px"
                  : "(max-width: 768px) 100vw, 512px"
              }
            />
          </figure>
        </ScrollReveal>
      </div>
    </div>
  );
}
