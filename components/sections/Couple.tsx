"use client";

import { motion } from "framer-motion";
import { couple } from "@/lib/data";

export default function Couple() {
  const members = [couple.bride, couple.groom];

  return (
    <section id="couple" className="section-padding relative z-10 bg-[#ffffff]">
      <h2 className="font-heading mb-12 text-center text-5xl text-[#111111]">The Couple</h2>
      <div className="soft-divider mx-auto mb-10 max-w-3xl" />
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        {members.map((person, index) => (
          <motion.article
            key={person.name}
            className="card-gradient rounded-3xl p-5"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-[#b23a48]">{person.role}</p>
            <h3 className="font-serif mt-2 text-[2rem] font-semibold leading-tight text-[#111111] md:text-[2.15rem]">
              {person.name}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#3f3f3f]">{person.bio}</p>
            {"family" in person && Array.isArray(person.family) && (
              <div className="mt-3 space-y-1">
                {person.family.map((line) => (
                  <p key={line} className="text-sm leading-7 text-[#3f3f3f]">
                    {line}
                  </p>
                ))}
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
