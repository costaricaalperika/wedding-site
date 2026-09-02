"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabase } from "@/lib/supabase";
import { fireRsvpConfetti } from "@/lib/rsvpConfetti";
import ScrollReveal from "./ScrollReveal";
import { useI18n } from "./i18n";
import RsvpCalendarAdd from "./RsvpCalendarAdd";

type Status = "idle" | "loading" | "success" | "error";

type Props = {
  /** Davet kapağı açıldıysa (katılım sonrası takvim öner) */
  invitationOpened?: boolean;
};

function companionSlots(partySize: number): number {
  return Math.max(0, partySize - 1);
}

export default function RsvpForm({ invitationOpened = false }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState(true);
  const [partySize, setPartySize] = useState(1);
  const [companions, setCompanions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [validationError, setValidationError] = useState<string | null>(null);
  /** resetForm sonrası da katılım başarısını bilmek için */
  const [successWasAttending, setSuccessWasAttending] = useState<boolean | null>(null);
  const { t } = useI18n();

  function updatePartySize(n: number) {
    const clamped = Math.min(5, Math.max(1, n));
    setPartySize(clamped);
    const need = companionSlots(clamped);
    setCompanions((prev) => {
      if (prev.length === need) return prev;
      if (prev.length > need) return prev.slice(0, need);
      return [...prev, ...Array(need - prev.length).fill("")];
    });
  }

  function setCompanionAt(index: number, value: string) {
    setCompanions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setAttending(true);
    setPartySize(1);
    setCompanions([]);
    setNotes("");
    setValidationError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidationError(null);
    setStatus("loading");

    const nameTrim = name.trim();
    const emailVal = email.trim() || null;
    const phoneVal = phone.trim() || null;
    const notesVal = notes.trim() || null;

    if (!nameTrim) {
      setStatus("idle");
      return;
    }

    try {
      if (attending) {
        const slots = companionSlots(partySize);
        const compVals = companions.slice(0, slots).map((c) => c.trim());
        if (compVals.length < slots || compVals.some((c) => !c)) {
          setValidationError(t.rsvp.companionRequiredError);
          setStatus("idle");
          return;
        }

        const partyId = crypto.randomUUID();
        const allNames = [nameTrim, ...compVals];
        const rows = allNames.map((n, i) => ({
          name: n,
          email: emailVal,
          phone: phoneVal,
          notes: notesVal,
          attending: true,
          party_id: partyId,
          party_index: i + 1,
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (getSupabase().from("guests") as any).insert(rows);

        if (error) {
          console.error("RSVP error:", error);
          setStatus("error");
        } else {
          setSuccessWasAttending(true);
          setStatus("success");
          fireRsvpConfetti();
          resetForm();
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (getSupabase().from("guests") as any).insert({
          name: nameTrim,
          email: emailVal,
          phone: phoneVal,
          notes: notesVal,
          attending: false,
          party_id: null,
          party_index: null,
        });

        if (error) {
          console.error("RSVP error:", error);
          setStatus("error");
        } else {
          setStatus("success");
          resetForm();
        }
      }
    } catch (err) {
      console.error("RSVP error:", err);
      setStatus("error");
    }
  }

  return (
    <section id="rsvp" className="scroll-mt-24 py-28 md:py-36 bg-paper-elevated">
      <div className="max-w-lg mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-center mb-4 text-warm">
            {t.rsvp.title}
          </h2>
          <p className="text-center text-warm-light mb-12">{t.rsvp.subtitle}</p>
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
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-[family-name:var(--font-serif)] text-2xl mb-2 text-warm">
                  {t.rsvp.successTitle}
                </h3>
                <p className="text-warm-light">{t.rsvp.successText}</p>
                {successWasAttending === true && invitationOpened && <RsvpCalendarAdd />}
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setSuccessWasAttending(null);
                    resetForm();
                  }}
                  className="mt-6 text-sm text-rose hover:text-rose-dark underline underline-offset-4 transition-colors"
                >
                  {t.rsvp.submitAnother}
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
                <AnimatePresence>
                  {attending && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <label htmlFor="party-size" className="block text-sm text-warm-light mb-1.5">
                        {t.rsvp.partySizeLabel}
                      </label>
                      <select
                        id="party-size"
                        value={partySize}
                        onChange={(e) => updatePartySize(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-paper-cream focus:outline-none focus:ring-2 focus:ring-rose/40 transition-all"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label htmlFor="name" className="block text-sm text-warm-light mb-1.5">
                    {t.rsvp.nameLabel}
                    <span className="text-rose ml-1">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.rsvp.namePlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-paper-cream focus:outline-none focus:ring-2 focus:ring-rose/40 transition-all"
                  />
                </div>

                <AnimatePresence>
                  {attending && companionSlots(partySize) > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3 overflow-hidden"
                    >
                      {Array.from({ length: companionSlots(partySize) }).map((_, i) => (
                        <div key={i}>
                          <label
                            htmlFor={`companion-${i}`}
                            className="block text-sm text-warm-light mb-1.5"
                          >
                            {t.rsvp.companionLabel.replace("{n}", String(i + 1))}
                            <span className="text-rose ml-1">*</span>
                          </label>
                          <input
                            id={`companion-${i}`}
                            type="text"
                            value={companions[i] ?? ""}
                            onChange={(e) => setCompanionAt(i, e.target.value)}
                            placeholder={t.rsvp.companionPlaceholder}
                            className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-paper-cream focus:outline-none focus:ring-2 focus:ring-rose/40 transition-all"
                          />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label htmlFor="email" className="block text-sm text-warm-light mb-1.5">
                    {t.rsvp.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.rsvp.emailPlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-paper-cream focus:outline-none focus:ring-2 focus:ring-rose/40 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm text-warm-light mb-1.5">
                    {t.rsvp.phoneLabel}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.rsvp.phonePlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-paper-cream focus:outline-none focus:ring-2 focus:ring-rose/40 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="rsvp-notes" className="block text-sm text-warm-light mb-1.5">
                    {t.rsvp.notesLabel}
                  </label>
                  <textarea
                    id="rsvp-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t.rsvp.notesPlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-paper-cream focus:outline-none focus:ring-2 focus:ring-rose/40 transition-all resize-y min-h-[5rem] text-warm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-warm-light mb-3">{t.rsvp.attendingLabel}</label>
                  <div className="flex gap-4">
                    {[
                      { value: true, label: t.rsvp.accept },
                      { value: false, label: t.rsvp.decline },
                    ].map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => {
                          setAttending(opt.value);
                          if (!opt.value) {
                            setPartySize(1);
                            setCompanions([]);
                          }
                        }}
                        className={`flex-1 py-3 rounded-xl text-sm transition-all duration-300 border ${
                          attending === opt.value
                            ? "bg-warm text-white border-warm"
                            : "bg-paper-cream border-cream-dark text-warm-light hover:border-rose"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {(validationError || status === "error") && (
                  <p className="text-red-500 text-sm text-center">
                    {validationError || t.rsvp.error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 rounded-xl bg-warm text-white text-sm hover:bg-warm-light transition-colors duration-300 disabled:opacity-50 tracking-wide"
                >
                  {status === "loading" ? t.rsvp.sending : t.rsvp.send}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </ScrollReveal>
      </div>
    </section>
  );
}
