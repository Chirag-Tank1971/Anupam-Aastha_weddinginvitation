"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { buildWeddingIcs, downloadIcs, WHATSAPP_SHARE_TEXT } from "@/lib/calendar";
import { Heart } from "lucide-react";

type RSVPForm = {
  name: string;
  email: string;
  attendance: "yes" | "no";
  guests: string;
  message: string;
};

export default function RSVP() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RSVPForm>();

  const onSubmit = async (values: RSVPForm) => {
    setSubmitError(null);
    setSubmitted(false);

    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      setSubmitError("We could not send your RSVP right now. Please try again.");
      return;
    }

    setSubmitted(true);
    reset();
  };

  const handleSaveDate = () => {
    downloadIcs("anupam-aastha-wedding.ics", buildWeddingIcs());
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(WHATSAPP_SHARE_TEXT)}`;

  return (
    <section id="rsvp" className="section-padding relative z-10 bg-[#fafafa] pb-32">
      <h2 className="font-heading mb-10 text-center text-5xl text-[#111111]">RSVP</h2>
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="card-gradient mx-auto grid max-w-3xl gap-4 rounded-3xl p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <input
          placeholder="Full Name"
          className="rounded-xl border border-[#b23a48]/20 bg-white px-4 py-3 text-[#111] outline-none"
          {...register("name", { required: true })}
        />
        {errors.name && <span className="text-xs text-[#b23a48]">Please enter your name.</span>}

        <input
          placeholder="Email"
          className="rounded-xl border border-[#b23a48]/20 bg-white px-4 py-3 text-[#111] outline-none"
          {...register("email", { required: true })}
        />
        {errors.email && <span className="text-xs text-[#b23a48]">Please enter your email.</span>}

        <select className="rounded-xl border border-[#b23a48]/20 bg-white px-4 py-3 text-[#111] outline-none" {...register("attendance")}>
          <option value="yes">Joyfully Accepts</option>
          <option value="no">Regretfully Declines</option>
        </select>

        <input
          placeholder="Number of Guests"
          className="rounded-xl border border-[#b23a48]/20 bg-white px-4 py-3 text-[#111] outline-none"
          {...register("guests")}
        />

        <textarea
          placeholder="Message for the couple"
          className="min-h-28 rounded-xl border border-[#b23a48]/20 bg-white px-4 py-3 text-[#111] outline-none"
          {...register("message")}
        />

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-full border border-[#b23a48]/50 px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#b23a48]"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isSubmitting ? "Sending..." : "Submit RSVP"}
        </motion.button>

        {submitError && <p className="text-sm text-[#b23a48]">{submitError}</p>}
      </motion.form>

      <AnimatePresence>
        {submitted && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#111]/55 p-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="rsvp-success-title"
          >
            <motion.div
              className="relative max-w-md rounded-3xl border border-[#b23a48]/25 bg-white p-8 text-center shadow-[0_30px_80px_rgba(17,17,17,0.2)]"
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <motion.div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#b23a48]/10 text-[#b23a48]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 18 }}
              >
                <Heart className="h-7 w-7 fill-[#b23a48]/20" strokeWidth={1.5} />
              </motion.div>
              <h3 id="rsvp-success-title" className="font-heading text-3xl text-[#111]">
                Thank You
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#555]">
                Your RSVP has been received. We can&apos;t wait to celebrate with you — Anupam & Aastha.
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
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
                className="mt-8 text-xs uppercase tracking-[0.2em] text-[#888] underline-offset-4 hover:text-[#111] hover:underline"
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
