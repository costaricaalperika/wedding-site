"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import ScrollReveal from "./ScrollReveal";
import { useI18n } from "./i18n";

/** Nikâh / tören bloğu (Fuar Evlendirme Dairesi + harita). `false` yapınca tekrar gizlenir. */
const SHOW_CEREMONY_SECTION = true;

const ceremonyIcon = (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const celebrationIcon = (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
  </svg>
);

const eventPhotos = [{ src: "/Viola_Event_Pic.jpg" }];

/** Google Haritalar API yok: normal web URL; tıklanınca yol tarifi açılır. */
const CEREMONY_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=38.4312951,27.1434633";

const CELEBRATION_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=38.3382394,27.2548208";

/** Kutlama — Google Haritalar gömülü harita (koordinatlar yol tarifi ile aynı; ScrollReveal dışında) */
const CELEBRATION_EMBED_SRC =
  "https://maps.google.com/maps?q=Viola+Event,+Izmir&ll=38.3382394,27.2548208&z=17&output=embed";

/** Nikâh — Google Haritalar gömülü harita (Fuar Evlendirme Dairesi, Kültür Parkı, Alsancak, Konak/İzmir) */
const CEREMONY_EMBED_SRC =
  "https://maps.google.com/maps?q=Fuar+Evlendirme+Dairesi,+Izmir&ll=38.4312951,27.1434633&z=17&output=embed";

export default function EventDetails() {
  const { t } = useI18n();
  const celebration = t.event.items[1];
  const ceremony = SHOW_CEREMONY_SECTION ? t.event.items[0] : null;
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  return (
    <section
      id="event"
      className="scroll-mt-24 pt-12 md:pt-16 pb-28 md:pb-36 bg-paper-elevated"
    >
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <p className="text-sm uppercase tracking-[0.3em] text-rose mb-4 text-center">
            {t.event.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-center mb-20 text-warm">
            {t.event.title}
          </h2>
        </ScrollReveal>

        {/* Ceremony — SHOW_CEREMONY_SECTION ile aç/kapa; metin solda, harita sağda (iframe ScrollReveal dışında) */}
        {SHOW_CEREMONY_SECTION && ceremony && (
          <>
            <div className="flex flex-col md:flex-row items-center gap-10 mb-20">
              <ScrollReveal className="flex-1 w-full">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose/10 text-rose mb-5">
                    {ceremonyIcon}
                  </div>
                  <h3 className="font-[family-name:var(--font-serif)] text-3xl mb-2 text-warm">
                    {ceremony.title}
                  </h3>
                  <p className="text-rose-dark font-semibold mb-4 text-lg">{ceremony.time}</p>
                  <p className="text-warm-light leading-relaxed">{ceremony.description}</p>
                  <a
                    href={CEREMONY_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 text-sm uppercase tracking-[0.2em] text-rose border border-rose/40 px-5 py-2.5 rounded-full hover:bg-rose/10 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {t.event.ceremonyDirectionsLabel}
                  </a>
                </div>
              </ScrollReveal>

              <div className="flex-1 w-full min-w-0 max-w-[600px] md:max-w-none self-stretch">
                <div className="relative isolate h-[280px] w-full overflow-hidden rounded-2xl bg-neutral-200 shadow-lg sm:h-[320px] md:h-96">
                  <iframe
                    src={CEREMONY_EMBED_SRC}
                    title="Fuar Evlendirme Dairesi — harita"
                    className="absolute inset-0 h-full w-full border-0"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>

            <ScrollReveal>
              <div className="w-24 h-px bg-rose/30 mx-auto mb-20" />
            </ScrollReveal>
          </>
        )}

        {/* Celebration — fotoğraf solda, metin sağda */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row-reverse items-center gap-10">
            <div className="flex-1 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose/10 text-rose mb-5">
                {celebrationIcon}
              </div>
              <h3 className="font-[family-name:var(--font-serif)] text-3xl mb-2 text-warm">
                {celebration.title}
              </h3>
              <p className="text-rose-dark font-semibold mb-4 text-lg">{celebration.time}</p>
              <p className="text-warm-light leading-relaxed">{celebration.description}</p>
              <a
                href={CELEBRATION_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-sm uppercase tracking-[0.2em] text-rose border border-rose/40 px-5 py-2.5 rounded-full hover:bg-rose/10 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {t.event.celebrationDirectionsLabel}
              </a>
            </div>

            <div className="flex-1 w-full">
              <div
                className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => setLightboxIndex(0)}
              >
                <Image
                  src="/Viola_Event_Pic.jpg"
                  alt={celebration.title}
                  fill
                  className="object-cover object-[center_75%] hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 bg-paper-white-misty rounded-full p-3">
                    <svg className="w-5 h-5 text-warm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Viola Event — tam genişlik harita (iframe ScrollReveal dışında, tören bloğu ile aynı ölçüler) */}
        <div className="mt-12 md:mt-16 w-full min-w-0">
          <div className="relative isolate h-[280px] w-full overflow-hidden rounded-2xl bg-neutral-200 shadow-lg sm:h-[320px] md:h-96">
            <iframe
              src={CELEBRATION_EMBED_SRC}
              title="Viola Event, İzmir — Google Haritalar"
              className="absolute inset-0 h-full w-full border-0"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        slides={eventPhotos}
        index={lightboxIndex}
      />
    </section>
  );
}
