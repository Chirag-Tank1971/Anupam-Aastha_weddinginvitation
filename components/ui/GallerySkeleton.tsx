"use client";

import { motion } from "framer-motion";

export default function GallerySkeleton() {
  return (
    <section className="section-padding relative z-10 bg-[#fafafa]">
      <div className="mx-auto mb-12 h-10 max-w-xs animate-pulse rounded-lg bg-[#eee]" />
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="aspect-[4/5] rounded-xl bg-gradient-to-br from-[#eee] via-[#f5f5f5] to-[#e8e8e8]"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.08 }}
          />
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-[#888]">Loading gallery…</p>
    </section>
  );
}
