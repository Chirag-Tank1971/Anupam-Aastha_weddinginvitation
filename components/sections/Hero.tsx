"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section id="hero" ref={sectionRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-45"
        style={{ y: prefersReducedMotion ? 0 : backgroundY }}
        animate={prefersReducedMotion ? {} : { scale: [1, 1.06, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),#f9f5f2_62%,#f8f8f8)]" />
      <motion.div
        className="relative z-10 px-6 text-center"
        style={{ y: prefersReducedMotion ? 0 : contentY }}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1 }}
      >
        <p className="mb-3 text-sm tracking-[0.3em] uppercase text-[#b23a48]">30 April - 5 May</p>
        <h1 className="font-heading text-6xl text-[#111111] md:text-8xl">Anupam & Aastha</h1>
        <p className="mt-4 text-lg text-[#333] md:text-2xl">A celebration of love, family, and forever.</p>
      </motion.div>
    </section>
  );
}
