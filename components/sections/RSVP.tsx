"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildWeddingIcs, downloadIcs, WHATSAPP_SHARE_TEXT } from "@/lib/calendar";
import { rsvpEventOptions, rsvpFunOptions } from "@/lib/data";
import { Heart } from "lucide-react";

export default function RSVP() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const name = String(fd.get("name") || "").trim();
    const attending = String(fd.get("attending") || "").trim();
    const wishes = String(fd.get("wishes") || "").trim();
    const guests = String(fd.get("guests") || "").trim();
    const events = fd.getAll("events").map(String);
    const fun = fd.getAll("fun").map(String);

    if (!name || !attending) {
      alert("Please enter your name and choose whether you are attending.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, attending, events, fun, wishes, guests }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        alert(data.error || "We could not send your RSVP. Please try again.");
        return;
      }

      form.reset();
      setSubmitted(true);
    } catch {
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDate = () => {
    downloadIcs("anupam-aastha-wedding.ics", buildWeddingIcs());
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(WHATSAPP_SHARE_TEXT)}`;

  return (
    <section id="rsvp" className="rsvp section-padding relative z-10 bg-[#fafafa] pb-32">
      <h2 className="rsvp-title font-heading mb-10 text-center text-5xl text-[#111111]">RSVP</h2>

      <motion.form
        className="rsvp-form card-gradient mx-auto grid max-w-3xl gap-4 rounded-3xl border border-[#b23a48]/15 p-6 md:p-8"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <input
          name="name"
          required
          placeholder="Full Name"
          className="rsvp-input rounded-xl border border-[#b23a48]/20 bg-white px-4 py-3 text-[#111] outline-none"
        />

        <label className="rsvp-label text-left text-xs font-medium uppercase tracking-wide text-[#555]">
          Will you attend?
        </label>
        <select
          name="attending"
          required
          className="rsvp-select rounded-xl border border-[#b23a48]/20 bg-white px-4 py-3 text-[#111] outline-none"
          defaultValue=""
        >
          <option value="" disabled>
            Select one
          </option>
          <option value="yes">Joyfully Accepts</option>
          <option value="no">Regretfully Declines</option>
          <option value="later">Will confirm later</option>
        </select>

        <input
          name="guests"
          placeholder="Number of Guests"
          className="rsvp-input rounded-xl border border-[#b23a48]/20 bg-white px-4 py-3 text-[#111] outline-none"
        />

        <fieldset className="rsvp-fieldset rounded-xl border border-[#b23a48]/15 bg-white/80 p-4">
          <legend className="rsvp-legend px-1 text-xs font-semibold uppercase tracking-wide text-[#b23a48]">
            Events you plan to attend
          </legend>
          <div className="mt-2 flex flex-col gap-2">
            {rsvpEventOptions.map((label) => (
              <label key={label} className="rsvp-check-label flex cursor-pointer items-start gap-2 text-sm text-[#333]">
                <input type="checkbox" name="events" value={label} className="rsvp-checkbox mt-1" />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rsvp-fieldset rounded-xl border border-[#b23a48]/15 bg-white/80 p-4">
          <legend className="rsvp-legend px-1 text-xs font-semibold uppercase tracking-wide text-[#b23a48]">
            Preferences
          </legend>
          <div className="mt-2 flex flex-col gap-2">
            {rsvpFunOptions.map((label) => (
              <label key={label} className="rsvp-check-label flex cursor-pointer items-start gap-2 text-sm text-[#333]">
                <input type="checkbox" name="fun" value={label} className="rsvp-checkbox mt-1" />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <textarea
          name="wishes"
          placeholder="Message or wishes for the couple"
          className="rsvp-textarea min-h-28 rounded-xl border border-[#b23a48]/20 bg-white px-4 py-3 text-[#111] outline-none"
        />

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="rsvp-submit mt-2 rounded-full border border-[#b23a48]/50 px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#b23a48]"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isSubmitting ? "Sending..." : "Submit RSVP"}
        </motion.button>
      </motion.form>

      <AnimatePresence>
        {submitted && (
          <motion.div
            className="rsvp-modal-backdrop fixed inset-0 z-[60] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="rsvp-success-title"
          >
            <motion.div
              className="rsvp-modal relative max-w-md rounded-3xl border border-[#b23a48]/25 bg-white p-8 text-center shadow-[0_30px_80px_rgba(17,17,17,0.2)]"
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <motion.div
                className="rsvp-modal-icon mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#b23a48]/10 text-[#b23a48]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 18 }}
              >
                <Heart className="h-7 w-7 fill-[#b23a48]/20" strokeWidth={1.5} />
              </motion.div>
              <h3 id="rsvp-success-title" className="rsvp-modal-title font-heading text-3xl text-[#111]">
                Thank You
              </h3>
              <p className="rsvp-modal-body mt-3 text-sm leading-relaxed text-[#555]">
                Your RSVP has been received. We can&apos;t wait to celebrate with you — Anupam & Aastha.
              </p>
              <div className="rsvp-modal-actions mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={handleSaveDate}
                  className="rounded-full border border-[#c9a962] bg-[#fffdf8] px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#8a7030] transition hover:bg-[#c9a962]/15"
                >
                  Save the date
                </button>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#b23a48]/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#b23a48] transition hover:bg-[#b23a48]/10"
                >
                  Share invite
                </a>
              </div>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="rsvp-modal-close mt-8 text-xs uppercase tracking-[0.2em] text-[#888] underline-offset-4 hover:text-[#111] hover:underline"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
