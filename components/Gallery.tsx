"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import ScrollReveal from "./ScrollReveal";

const images = [
  { src: "/photo1.jpg" },
  { src: "/photo2.jpg" },
  { src: "/photo3.jpg" },
];

export default function Gallery() {
  const [index, setIndex] = useState(-1);

  return (
    <section id="gallery" className="py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <p className="text-sm uppercase tracking-[0.3em] text-rose mb-4 text-center">
            Moments
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-center mb-16 text-warm">
            Gallery
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {images.map((img, i) => (
            <ScrollReveal key={img.src} delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500"
                onClick={() => setIndex(i)}
              >
                <img
                  src={img.src}
                  alt={`Wedding photo ${i + 1}`}
                  className="w-full h-72 sm:h-80 object-cover transition-transform duration-700 hover:scale-110"
                  loading="lazy"
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
