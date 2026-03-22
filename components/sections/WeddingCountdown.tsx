"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const WEDDING_DATE = new Date("2026-05-03T18:00:00");

type RemainingTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeRemaining(): RemainingTime {
  const difference = WEDDING_DATE.getTime() - Date.now();
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function WeddingCountdown() {
  const [timeLeft, setTimeLeft] = useState<RemainingTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const parts = useMemo(
    () => [
      { label: "Days", value: timeLeft.days },
      { label: "Hours", value: timeLeft.hours },
      { label: "Minutes", value: timeLeft.minutes },
      { label: "Seconds", value: timeLeft.seconds },
    ],
    [timeLeft]
  );

  return (
    <section id="countdown" className="section-padding relative z-10 bg-[#fafafa] pt-6">
      <motion.div
        className="mx-auto max-w-4xl rounded-3xl border border-[#b23a48]/15 bg-white p-6 shadow-[0_20px_45px_rgba(17,17,17,0.06)] md:p-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="mb-5 text-center text-xs uppercase tracking-[0.24em] text-[#b23a48]">Countdown To Marriage At Sunset</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {parts.map((part) => (
            <div key={part.label} className="rounded-2xl border border-[#b23a48]/15 bg-[#fffdfd] px-4 py-5 text-center">
              <p className="font-heading text-3xl text-[#b23a48] md:text-4xl">{pad(part.value)}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#444]">{part.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
