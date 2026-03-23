"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

const quickLinks = [
  { href: "#date", label: "Date" },
  { href: "#events", label: "Events" },
  { href: "#venue-card", label: "Venue" },
  { href: "#location", label: "Map" },
];

export default function MobileStickyNav() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.nav
      className="fixed bottom-3 left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 md:hidden"
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.8, duration: 0.45 }}
      aria-label="Quick links"
    >
      <div className="flex justify-between gap-1 rounded-2xl border border-[#b23a48]/20 bg-white/95 px-2 py-2 shadow-lg backdrop-blur-md">
        {quickLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#fafafa] px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-[#8f2231] active:scale-95"
          >
            {link.label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
