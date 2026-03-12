"use client";

import ScrollReveal from "./ScrollReveal";

const events = [
  {
    title: "Ceremony",
    time: "4:00 PM",
    description: "Join us as we exchange our vows in the garden.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    title: "Reception",
    time: "7:00 PM",
    description: "Dinner, dancing and celebration under the Tuscan stars.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    title: "Location",
    time: "Villa di Maiano",
    description: "Via Benedetto da Maiano 11, Fiesole, Florence, Italy.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

export default function EventDetails() {
  return (
    <section id="event" className="py-28 md:py-36 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <p className="text-sm uppercase tracking-[0.3em] text-rose mb-4 text-center">
            The Details
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-center mb-16 text-warm">
            Wedding Day
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((ev, i) => (
            <ScrollReveal key={ev.title} delay={i * 0.15}>
              <div className="text-center p-8 rounded-2xl bg-cream hover:shadow-lg transition-shadow duration-500">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose/10 text-rose mb-6">
                  {ev.icon}
                </div>
                <h3 className="font-[family-name:var(--font-serif)] text-2xl mb-2 text-warm">
                  {ev.title}
                </h3>
                <p className="text-rose-dark font-semibold mb-3">{ev.time}</p>
                <p className="text-warm-light leading-relaxed text-sm">
                  {ev.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
