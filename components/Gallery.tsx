"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import ScrollReveal from "./ScrollReveal";
import { useI18n } from "./i18n";

const images = [
  { src: "/Portrait.jpg" },
  { src: "/Landscape.jpg" },
  { src: "/photo3.jpg" },
  { src: "/photo4.jpg" },
  { src: "/photo5.jpeg" },
  { src: "/photo6.jpeg" },
  { src: "/1.jpeg" },
  { src: "/2.jpeg" },
  { src: "/3.jpeg" },
  { src: "/4.jpeg" },
  { src: "/5.jpeg" },
  { src: "/6.jpeg" },
  { src: "/7.jpeg" },
  { src: "/8.jpeg" },
  { src: "/9.jpeg" },
];

export default function Gallery() {
  const [index, setIndex] = useState(-1);
  const { t } = useI18n();

  return (
    <section
      id="gallery"
      className="scroll-mt-24 pt-28 md:pt-36 pb-14 md:pb-16 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <p className="text-sm uppercase tracking-[0.3em] text-rose mb-4 text-center">
            {t.gallery.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-center mb-16 text-warm">
            {t.gallery.title}
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {images.map((img, i) => (
            <ScrollReveal key={img.src} delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="relative h-72 sm:h-80 overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500"
                onClick={() => setIndex(i)}
              >
                <Image
                  src={img.src}
                  alt={`${t.gallery.photoAlt} ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <Lightbox
          open={index >= 0}
          close={() => setIndex(-1)}
          slides={images}
          index={index}
        />
      </div>
    </section>
  );
}
