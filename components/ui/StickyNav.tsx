"use client";

import { motion } from "framer-motion";

const links = [
  { href: "#hero", label: "Home" },
  { href: "#date", label: "Date" },
  { href: "#countdown", label: "Timer" },
  { href: "#couple", label: "Couple" },
  { href: "#events", label: "Events" },
  { href: "#venue-card", label: "Venue" },
  { href: "#location", label: "Map" },
  { href: "#faq", label: "FAQ" },
];

export default function StickyNav() {
  return (
    <motion.nav
      className="fixed bottom-4 left-1/2 z-30 hidden max-w-[calc(100vw-2rem)] -translate-x-1/2 md:block lg:bottom-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      aria-label="Section navigation"
    >
      <div className="flex max-w-[min(90vw,720px)] items-center gap-1 overflow-x-auto rounded-full border border-[#111]/10 bg-white/90 px-2 py-1.5 shadow-[0_8px_30px_rgba(17,17,17,0.08)] backdrop-blur-md [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[#444] transition hover:bg-[#111] hover:text-white lg:text-xs"
          >
            {link.label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
