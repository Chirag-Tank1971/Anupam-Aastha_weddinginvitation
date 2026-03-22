"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { timeline } from "@/lib/data";

export default function LoveStoryTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 30%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="story" ref={sectionRef} className="section-padding relative z-10 bg-[#fafafa]">
      <h2 className="font-heading mb-12 text-center text-5xl text-[#111111]">Our Love Story</h2>
      <div className="relative mx-auto max-w-4xl space-y-8 md:pl-10">
        <div className="pointer-events-none absolute left-3 top-0 bottom-0 hidden w-px bg-[#b23a48]/15 md:left-[1.15rem] md:block" />
        <motion.div
          className="pointer-events-none absolute left-3 top-0 bottom-0 hidden w-px origin-top bg-[#b23a48] md:left-[1.15rem] md:block"
          style={{ scaleY: lineScale }}
        />

        {timeline.map((item, index) => (
          <motion.div
            key={item.year}
            className="card-gradient relative rounded-2xl p-6 md:ml-4 md:p-8"
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <span className="absolute -left-[0.2rem] top-10 hidden h-2.5 w-2.5 rounded-full border-2 border-white bg-[#b23a48] shadow-sm md:-left-[1.0rem] md:block" />
            <span className="inline-block rounded-full bg-[#b23a48]/10 px-3 py-1 text-xs tracking-[0.24em] uppercase text-[#b23a48]">{item.year}</span>
            <h3 className="font-heading mt-3 text-3xl text-[#111111]">{item.title}</h3>
            <p className="mt-2 text-[#3f3f3f]">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
