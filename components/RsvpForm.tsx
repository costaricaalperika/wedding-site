"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabase } from "@/lib/supabase";
import ScrollReveal from "./ScrollReveal";

type Status = "idle" | "loading" | "success" | "error";

export default function RsvpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attending, setAttending] = useState(true);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const { error } = await getSupabase().from("guests").insert({
        name,
        email,
        attending,
      });

      if (error) {
        console.error("RSVP error:", error);
        setStatus("error");
      } else {
        setStatus("success");
        setName("");
        setEmail("");
        setAttending(true);
      }
    } catch (err) {
      console.error("RSVP error:", err);
      setStatus("error");
    }
  }

  return (
    <section id="rsvp" className="py-28 md:py-36 bg-white">
      <div className="max-w-lg mx-auto px-6">
        <ScrollReveal>
          <p className="text-sm uppercase tracking-[0.3em] text-rose mb-4 text-center">
            Be There
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-center mb-4 text-warm">
            RSVP
          </h2>
          <p className="text-center text-warm-light mb-12">
            We would love for you to celebrate with us.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-[family-name:var(--font-serif)] text-2xl mb-2 text-warm">
                  Thank You!
                </h3>
                <p className="text-warm-light">
                  Your response has been recorded. We can&apos;t wait to see you!
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm text-rose hover:text-rose-dark underline underline-offset-4 transition-colors"
                >
                  Submit another response
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="name" className="block text-sm text-warm-light mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-rose/40 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-warm-light mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-rose/40 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-warm-light mb-3">
                    Will you attend?
                  </label>
                  <div className="flex gap-4">
                    {[
                      { value: true, label: "Joyfully Accept" },
                      { value: false, label: "Regretfully Decline" },
                    ].map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => setAttending(opt.value)}
                        className={`flex-1 py-3 rounded-xl text-sm transition-all duration-300 border ${
                          attending === opt.value
                            ? "bg-warm text-white border-warm"
                            : "bg-cream border-cream-dark text-warm-light hover:border-rose"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-sm text-center">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 rounded-xl bg-warm text-white text-sm uppercase tracking-[0.2em] hover:bg-warm-light transition-colors duration-300 disabled:opacity-50"
                >
                  {status === "loading" ? "Sending..." : "Send RSVP"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </ScrollReveal>
      </div>
    </section>
  );
}
